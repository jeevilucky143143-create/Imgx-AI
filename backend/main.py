import os
import uuid
import json
from contextlib import asynccontextmanager
from typing import List, Optional

import httpx
from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv()

from database import engine, Base, get_db, DATABASE_URL
from models import User, ClassificationHistory

from schemas import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse,
    ClassificationResponse,
    HistoryItemResponse,
)

from auth import (
    get_password_hash,
    verify_password,
    create_access_token,
)

from dependencies import get_current_user
from classifier import get_classifier


# ============================================================================
# CONFIGURATION
# ============================================================================

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

UPLOAD_DIR = os.getenv(
    "UPLOAD_DIR",
    "./uploads"
)

MAX_FILE_SIZE_MB = int(
    os.getenv("MAX_FILE_SIZE_MB", "15")
)

MAX_FILE_SIZE_BYTES = (
    MAX_FILE_SIZE_MB * 1024 * 1024
)

SUPABASE_URL = (
    os.getenv("SUPABASE_URL", "")
    .strip()
    .rstrip("/")
)

SUPABASE_SERVICE_KEY = (
    os.getenv("SUPABASE_SERVICE_KEY", "")
    .strip()
)

SUPABASE_STORAGE_BUCKET = (
    os.getenv(
        "SUPABASE_STORAGE_BUCKET",
        "imgx-images"
    )
    .strip()
)

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}


# ============================================================================
# APPLICATION LIFESPAN
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    # ------------------------------------------------------------------------
    # Database initialization
    # ------------------------------------------------------------------------

    Base.metadata.create_all(bind=engine)

    # ------------------------------------------------------------------------
    # Upload directory
    # ------------------------------------------------------------------------

    os.makedirs(
        UPLOAD_DIR,
        exist_ok=True
    )

    # ------------------------------------------------------------------------
    # SQLite migration
    # ------------------------------------------------------------------------

    if DATABASE_URL.startswith("sqlite"):

        try:

            with engine.connect() as conn:

                existing_cols = [
                    row[1]
                    for row in conn.execute(
                        text(
                            """
                            PRAGMA table_info(
                                classification_history
                            );
                            """
                        )
                    ).fetchall()
                ]

                # Add subcategory column if missing
                if "subcategory" not in existing_cols:

                    conn.execute(
                        text(
                            """
                            ALTER TABLE classification_history
                            ADD COLUMN subcategory
                            VARCHAR(100)
                            DEFAULT 'General';
                            """
                        )
                    )

                    conn.commit()

                    print(
                        "[Server] Migrated: "
                        "added 'subcategory' column."
                    )

                # Add specific column if missing
                if "specific" not in existing_cols:

                    conn.execute(
                        text(
                            """
                            ALTER TABLE classification_history
                            ADD COLUMN specific
                            VARCHAR(150);
                            """
                        )
                    )

                    conn.commit()

                    print(
                        "[Server] Migrated: "
                        "added 'specific' column."
                    )

        except Exception as e:

            print(
                f"[Server] Migration notice: {e}"
            )

    # ------------------------------------------------------------------------
    # IMPORTANT:
    #
    # Do NOT load the ML model here.
    #
    # The previous version called:
    #
    #     get_classifier()
    #
    # during startup.
    #
    # This caused PyTorch / the classification model to consume memory
    # before FastAPI could finish starting on Render's 512 MB instance.
    #
    # The model is now loaded lazily inside /api/classify.
    # ------------------------------------------------------------------------

    print(
        "[Server] Database initialized."
    )

    print(
        "[Server] ML classifier will be loaded "
        "on first classification request."
    )

    yield

    # ------------------------------------------------------------------------
    # Shutdown
    # ------------------------------------------------------------------------

    print(
        "[Server] Application shutting down."
    )


# ============================================================================
# FASTAPI APPLICATION
# ============================================================================

app = FastAPI(
    title="imgx.ai API",
    description=(
        "FastAPI Backend for imgx.ai "
        "General-Purpose Hierarchical "
        "Image Classification Platform"
    ),
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)


# ============================================================================
# CORS CONFIGURATION
# ============================================================================

frontend_env = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

configured_origins = [
    url.strip().rstrip("/")
    for url in frontend_env.split(",")
    if url.strip()
]

origins = [
    *configured_origins,

    # Local development
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

unique_origins = list(
    dict.fromkeys(origins)
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=unique_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# SUPABASE STORAGE HELPERS
# ============================================================================

def upload_to_supabase_storage(
    file_bytes: bytes,
    filename: str,
    content_type: str,
) -> Optional[str]:
    """
    Upload an image directly to Supabase Storage.

    Returns:
        Public image URL if successful.
        None if upload is unavailable or fails.
    """

    if not (
        SUPABASE_URL
        and SUPABASE_SERVICE_KEY
        and SUPABASE_STORAGE_BUCKET
    ):
        return None

    try:

        url = (
            f"{SUPABASE_URL}"
            f"/storage/v1/object/"
            f"{SUPABASE_STORAGE_BUCKET}"
            f"/{filename}"
        )

        headers = {
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": (
                f"Bearer {SUPABASE_SERVICE_KEY}"
            ),
            "Content-Type": content_type,
            "x-upsert": "true",
        }

        with httpx.Client(
            timeout=15.0
        ) as client:

            response = client.post(
                url,
                headers=headers,
                content=file_bytes,
            )

        if response.status_code in (
            200,
            201,
        ):

            return (
                f"{SUPABASE_URL}"
                f"/storage/v1/object/public/"
                f"{SUPABASE_STORAGE_BUCKET}"
                f"/{filename}"
            )

        print(
            "[Supabase Storage] "
            f"Upload returned "
            f"{response.status_code}: "
            f"{response.text}"
        )

    except Exception as e:

        print(
            f"[Supabase Storage] "
            f"Upload error: {e}"
        )

    return None


def resolve_image_url(
    image_ref: str
) -> str:
    """
    Resolve an image filename/path to an accessible URL.
    """

    if not image_ref:
        return ""

    if (
        image_ref.startswith("http://")
        or image_ref.startswith("https://")
        or image_ref.startswith("blob:")
    ):
        return image_ref

    if (
        SUPABASE_URL
        and SUPABASE_STORAGE_BUCKET
    ):
        return (
            f"{SUPABASE_URL}"
            f"/storage/v1/object/public/"
            f"{SUPABASE_STORAGE_BUCKET}"
            f"/{image_ref}"
        )

    return (
        f"/api/uploads/{image_ref}"
    )


# ============================================================================
# HEALTH / ROOT
# ============================================================================

@app.get(
    "/",
    tags=["Health"]
)
def root():

    return {
        "status": "healthy",
        "service": "imgx.ai API",
        "version": "2.0.0",
        "docs_url": "/docs",
        "health_url": "/api/health",
    }


@app.get(
    "/api/health",
    tags=["Health"]
)
def health_check():

    return {
        "status": "healthy",
        "service": "imgx.ai",
        "version": "2.0.0",
    }


# ============================================================================
# AUTHENTICATION
# ============================================================================

@app.post(
    "/api/auth/register",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    tags=["Authentication"],
)
def register_user(
    payload: UserRegister,
    db: Session = Depends(get_db),
):

    # Check existing user
    existing_user = (
        db.query(User)
        .filter(
            User.email == payload.email
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "An account with this "
                "email already exists"
            ),
        )

    # Hash password
    hashed_pwd = get_password_hash(
        payload.password
    )

    # Create user
    new_user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hashed_pwd,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "created_at": (
                new_user.created_at.isoformat()
            ),
        },
    }


@app.post(
    "/api/auth/login",
    response_model=TokenResponse,
    summary=(
        "Authenticate user and "
        "return JWT access token"
    ),
    tags=["Authentication"],
)
def login_user(
    payload: UserLogin,
    db: Session = Depends(get_db),
):

    # Find user
    user = (
        db.query(User)
        .filter(
            User.email == payload.email
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail="Invalid email or password",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # Verify password
    if not verify_password(
        payload.password,
        user.hashed_password,
    ):

        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail="Invalid email or password",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # Generate JWT
    token_payload = {
        "sub": str(user.id),
        "email": user.email,
    }

    access_token = create_access_token(
        token_payload
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(
            user
        ),
    )


@app.get(
    "/api/auth/me",
    response_model=UserResponse,
    summary="Get current authenticated user profile",
    tags=["Authentication"],
)
def get_me(
    current_user: User = Depends(
        get_current_user
    ),
):

    return UserResponse.model_validate(
        current_user
    )


# ============================================================================
# IMAGE CLASSIFICATION
# ============================================================================

@app.post(
    "/api/classify",
    response_model=ClassificationResponse,
    summary=(
        "Upload image and run "
        "general-purpose hierarchical classification"
    ),
    tags=["Classification"],
)
async def classify_image(
    file: UploadFile = File(...),
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    # ------------------------------------------------------------------------
    # 1. Validate file
    # ------------------------------------------------------------------------

    if not file or not file.filename:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "No file uploaded. "
                "Please upload a valid image."
            ),
        )

    # ------------------------------------------------------------------------
    # 2. Validate extension
    # ------------------------------------------------------------------------

    file_ext = os.path.splitext(
        file.filename
    )[1].lower()

    if file_ext not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Unsupported file format "
                f"'{file_ext}'. "
                "Allowed formats: "
                "JPG, JPEG, PNG, WEBP."
            ),
        )

    # ------------------------------------------------------------------------
    # 3. Read image
    # ------------------------------------------------------------------------

    image_bytes = await file.read()

    if len(image_bytes) == 0:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Uploaded file is empty."
            ),
        )

    # ------------------------------------------------------------------------
    # 4. File size validation
    # ------------------------------------------------------------------------

    if len(image_bytes) > MAX_FILE_SIZE_BYTES:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "File size exceeds maximum "
                f"allowed limit of "
                f"{MAX_FILE_SIZE_MB}MB."
            ),
        )

    # ------------------------------------------------------------------------
    # 5. Validate image with Pillow
    # ------------------------------------------------------------------------

    try:

        from PIL import Image
        import io

        img = Image.open(
            io.BytesIO(image_bytes)
        )

        img.verify()

        # Release temporary Pillow object
        del img

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Please upload a valid image."
            ),
        )

    # ------------------------------------------------------------------------
    # 6. Save uploaded image
    # ------------------------------------------------------------------------

    safe_filename = (
        f"{uuid.uuid4().hex}"
        f"{file_ext}"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        safe_filename,
    )

    try:

        with open(
            file_path,
            "wb"
        ) as output_file:

            output_file.write(
                image_bytes
            )

    except Exception as err:

        print(
            "[Storage Notice] "
            f"Local disk write notice: {err}"
        )

    # ------------------------------------------------------------------------
    # 7. MIME type
    # ------------------------------------------------------------------------

    ext_to_mime = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
    }

    content_type = ext_to_mime.get(
        file_ext,
        file.content_type
        or "image/jpeg",
    )

    # ------------------------------------------------------------------------
    # 8. Upload to Supabase Storage
    # ------------------------------------------------------------------------

    supabase_public_url = (
        upload_to_supabase_storage(
            image_bytes,
            safe_filename,
            content_type,
        )
    )

    image_url = (
        supabase_public_url
        or f"/api/uploads/{safe_filename}"
    )

    # ------------------------------------------------------------------------
    # 9. ML CLASSIFICATION
    #
    # IMPORTANT:
    # The classifier is loaded here, NOT during application startup.
    # ------------------------------------------------------------------------

    try:

        classifier = get_classifier()

        result = classifier.predict(
            image_bytes
        )

    except Exception as err:

        print(
            "[Classification Error] "
            f"{err}"
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Model inference failed. "
                "Please try again."
            ),
        )

    # ------------------------------------------------------------------------
    # 10. Save classification history
    # ------------------------------------------------------------------------

    history_record = ClassificationHistory(
        user_id=current_user.id,
        image_filename=safe_filename,
        prediction=result["prediction"],
        confidence=result["confidence"],
        category=result.get(
            "category",
            "General",
        ),
        subcategory=result.get(
            "subcategory",
            "General",
        ),
        specific=result.get(
            "specific",
            result["prediction"],
        ),
        latency=result.get(
            "latency",
            "12.0ms",
        ),
        top_predictions_json=json.dumps(
            result
        ),
    )

    db.add(history_record)
    db.commit()
    db.refresh(history_record)

    # ------------------------------------------------------------------------
    # 11. Response
    # ------------------------------------------------------------------------

    return ClassificationResponse(
        id=history_record.id,
        success=True,
        prediction=result["prediction"],
        confidence=result["confidence"],
        category=result["category"],
        subcategory=result["subcategory"],
        specific=result["specific"],
        classification=result["classification"],
        hierarchy=result["hierarchy"],
        other_detections=result.get(
            "other_detections",
            [],
        ),
        top_predictions=result[
            "top_predictions"
        ],
        alternatives=result[
            "alternatives"
        ],
        features=result["features"],
        latency=result["latency"],
        image_filename=safe_filename,
        image_url=image_url,
        is_unknown=result.get(
            "is_unknown",
            False,
        ),
        created_at=history_record.created_at,
    )


# ============================================================================
# CLASSIFICATION HISTORY
# ============================================================================

@app.get(
    "/api/history",
    response_model=List[HistoryItemResponse],
    summary=(
        "Get classification history "
        "for current user"
    ),
    tags=["History"],
)
def get_user_history(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    records = (
        db.query(ClassificationHistory)
        .filter(
            ClassificationHistory.user_id
            == current_user.id
        )
        .order_by(
            ClassificationHistory.created_at.desc()
        )
        .all()
    )

    response = []

    for record in records:

        top_alts = []
        parsed = {}

        if record.top_predictions_json:

            try:

                parsed = json.loads(
                    record.top_predictions_json
                )

                top_alts = parsed.get(
                    "alternatives",
                    [],
                )

            except Exception:
                pass

        display_date = (
            record.created_at.strftime(
                "%d %b %Y · %I:%M %p"
            )
        )

        category = (
            record.category
            or (
                parsed.get("category")
                if parsed
                else "General"
            )
        )

        subcategory = (
            record.subcategory
            or (
                parsed.get("subcategory")
                if parsed
                else "General"
            )
        )

        specific = (
            record.specific
            or (
                parsed.get("specific")
                if parsed
                else record.prediction
            )
        )

        response.append(
            HistoryItemResponse(
                id=record.id,
                image_filename=(
                    record.image_filename
                ),
                image_url=resolve_image_url(
                    record.image_filename
                ),
                prediction=record.prediction,
                confidence=(
                    record.confidence
                    if record.confidence > 1
                    else round(
                        record.confidence * 100,
                        1,
                    )
                ),
                category=category,
                subcategory=subcategory,
                specific=specific,
                classification=(
                    parsed.get(
                        "classification"
                    )
                    if parsed
                    else None
                ),
                hierarchy=(
                    parsed.get(
                        "hierarchy"
                    )
                    if parsed
                    else None
                ),
                other_detections=(
                    parsed.get(
                        "other_detections",
                        [],
                    )
                    if parsed
                    else []
                ),
                latency=(
                    record.latency
                    or "12.0ms"
                ),
                top_alternatives=top_alts,
                tensor_meta=(
                    "ResNet-50 • "
                    "Hierarchical Softmax • "
                    "224×224"
                ),
                created_at=record.created_at,
                display_date=display_date,
            )
        )

    return response


# ============================================================================
# CLEAR CLASSIFICATION HISTORY
# ============================================================================

@app.delete(
    "/api/history",
    summary=(
        "Clear classification history "
        "for current user"
    ),
    tags=["History"],
)
def clear_user_history(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    (
        db.query(ClassificationHistory)
        .filter(
            ClassificationHistory.user_id
            == current_user.id
        )
        .delete(
            synchronize_session=False
        )
    )

    db.commit()

    return {
        "message": (
            "Classification history "
            "cleared successfully"
        )
    }


# ============================================================================
# UPLOADED IMAGE SERVING
# ============================================================================

@app.get(
    "/api/uploads/{filename}",
    summary="Serve uploaded image file",
    tags=["Uploads"],
)
def get_uploaded_image(
    filename: str
):

    clean_name = os.path.basename(
        filename
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        clean_name,
    )

    # Local file
    if os.path.exists(file_path):

        return FileResponse(
            file_path
        )

    # Supabase Storage fallback
    if (
        SUPABASE_URL
        and SUPABASE_STORAGE_BUCKET
    ):

        return RedirectResponse(
            (
                f"{SUPABASE_URL}"
                f"/storage/v1/object/public/"
                f"{SUPABASE_STORAGE_BUCKET}"
                f"/{clean_name}"
            ),
            status_code=status.HTTP_307_TEMPORARY_REDIRECT,
        )

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Image not found",
    )


# ============================================================================
# LOCAL DEVELOPMENT
# ============================================================================

if __name__ == "__main__":

    import uvicorn

    port = int(
        os.getenv(
            "PORT",
            8000,
        )
    )

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
    )