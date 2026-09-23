# IMGX.AI — General-Purpose Hierarchical Image Classification Platform

<div align="center">

![IMGX.AI Banner](https://img.shields.io/badge/IMGX.AI-Hierarchical%20Vision%20Platform-7C3AED?style=for-the-badge&logo=pytorch&logoColor=white)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.2.2-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![ResNet-50](https://img.shields.io/badge/Model-ResNet--50-blue?style=flat-square)](https://arxiv.org/abs/1512.03385)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite/PostgreSQL](https://img.shields.io/badge/Database-SQLite%20%7C%20Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)

**Teaching Machines to See**: A deep-learning web platform that turns raw pixels into hierarchical, calibrated predictions across thousands of real-world objects, animals, vehicles, plants, and human categories.

[Features](#-key-features) • [System Architecture](#-system-architecture) • [Tech Stack](#-technology-stack) • [Getting Started](#-getting-started) • [Environment Variables](#-configuration--environment-variables) • [API Reference](#-api-reference)

---

</div>

## 📌 Overview

**IMGX.AI** is a full-stack, production-ready computer vision application powered by deep residual convolutional neural networks (**ResNet-50**). Instead of limiting classification to a single domain, IMGX.AI implements a **cascading 3-level hierarchical taxonomy** with probabilistic confidence calibration, multi-object co-occurrence detection, and low-confidence rejection to deliver transparent predictions with low latency.

The system pairs a high-performance **FastAPI + PyTorch** backend with a modern, glassmorphic **React 18 + Tailwind CSS** frontend featuring dark/light mode, webcam image capture, interactive visual analytics, and persistent user classification history.

---

## ✨ Key Features

### 🧠 Deep Vision & Hierarchical Classification
- **ResNet-50 Deep Residual Backbone**: Pretrained on ImageNet-1K with Apple Silicon Metal Performance Shaders (`mps`) hardware acceleration and automatic CPU fallback.
- **Cascading 3-Level Taxonomy**:
  - **Level 1: Category** (`Animal`, `Bird`, `Human`, `Plant`, `Object`, `Vehicle`, `Food`, `Building`, `Nature`, `Unknown`)
  - **Level 2: Subcategory** (`Dog`, `Cat`, `Furniture`, `Electronics`, `Appliance`, `Clothing`, `Car`, `Adult`, `Child`, etc.)
  - **Level 3: Specific Class / Breed / Type** (`Golden Retriever`, `Persian Cat`, `Electric Fan`, `Office Chair`, `Pizza`, etc.)
- **Calibrated Probabilistic Confidence**:
  - Category confidence computed by aggregating class probabilities: $P(\text{Category } C) = \sum_{i \in C} P(i)$.
  - Conditional subcategory confidence: $P(\text{Subcategory } S \mid C) = \frac{\sum_{j \in S} P(j)}{\sum_{i \in C} P(i)}$.
- **Multi-Object Co-Occurrence Detection**: Scans secondary probability peaks across distinct taxonomy clusters to detect co-occurring objects (e.g., Dog + Tennis Ball).
- **Anti-Hallucination & Uncertainty Rejection**:
  - Global low-confidence images ($P_{\text{specific}} < 0.12$ & $P_{\text{category}} < 0.45$) trigger an honest `Unknown` status.
  - Partial hierarchy confidence returns confirmed broad categories without guessing specific breeds or sub-types.
- **Zero Cold-Start Inference**: PyTorch model weights and GPU/MPS kernels are pre-warmed during application lifespan startup.

### 💻 Modern Web Application
- **Interactive Image Ingestion**:
  - Drag-and-drop file upload with preview.
  - Built-in live webcam capture modal.
  - Preloaded sample image gallery for instant test queries.
- **Detailed Prediction Explorer**:
  - Hierarchical breadcrumbs with confidence meters.
  - Secondary co-occurring detections list.
  - Top alternative predictions with probability bars.
  - Technical latency telemetry & raw JSON payload viewer.
- **Classification History**:
  - Full history timeline saved to database with image thumbnails.
  - Search, category filtering, and sorting by confidence or timestamp.
  - Modal inspection and one-click history clearing.
- **User Authentication & Personalization**:
  - Secure JWT-based authentication (Bearer token).
  - Encrypted passwords using `bcrypt` and `passlib`.
  - Light and Dark mode toggle with persistent state.

---

## 🏗️ System Architecture

```
                      ┌──────────────────────────────────────┐
                      │        IMGX.AI React Frontend        │
                      │  (Vite + Tailwind CSS + Lucide Icons)│
                      └──────────────────┬───────────────────┘
                                         │
                               REST API  │  multipart/form-data
                               JWT Auth  │  (Images ≤ 15MB)
                                         ▼
                      ┌──────────────────────────────────────┐
                      │          FastAPI Web Server          │
                      │   (Lifespan Pre-warming, CORS, Auth) │
                      └──────────────────┬───────────────────┘
                                         │
                  ┌──────────────────────┴──────────────────────┐
                  ▼                                             ▼
     ┌────────────────────────┐                    ┌────────────────────────┐
     │  SQLAlchemy ORM Layer  │                    │   Pillow & PyTorch     │
     │  (SQLite / PostgreSQL) │                    │   Image Preprocessing  │
     │ • Users                │                    │ (RGB, 224x224, Z-score)│
     │ • ClassificationHistory│                    └────────────┬───────────┘
     └────────────────────────┘                                 │
                                                                ▼
                                                   ┌────────────────────────┐
                                                   │ ResNet-50 Forward Pass │
                                                   │ (1,000-class Softmax)  │
                                                   └────────────┬───────────┘
                                                                │
                                                                ▼
                                                   ┌────────────────────────┐
                                                   │   Hierarchical Engine  │
                                                   │ • Level 1: Category    │
                                                   │ • Level 2: Subcategory │
                                                   │ • Level 3: Class/Breed │
                                                   │ • Multi-Object Scan    │
                                                   │ • Low-Confidence Gate  │
                                                   └────────────────────────┘
```

---

## 🛠️ Technology Stack

### Backend
| Technology | Description |
|---|---|
| **Python 3.10+ / 3.11** | Core backend language |
| **FastAPI** | High-performance asynchronous REST API framework |
| **Uvicorn** | ASGI server implementation |
| **PyTorch 2.2.2** | Deep learning inference framework (MPS / CPU) |
| **Torchvision 0.17.2** | ResNet-50 architecture and pretrained ImageNet weights |
| **Pillow (PIL)** | Image buffer validation, spatial normalization, and conversion |
| **SQLAlchemy 2.0** | SQL ORM for database persistence |
| **PostgreSQL / SQLite** | Database support (Supabase in production, SQLite for local dev) |
| **python-jose & passlib** | JWT authentication and bcrypt password hashing |
| **Pydantic v2** | Data validation and schema enforcement |

### Frontend
| Technology | Description |
|---|---|
| **React 18.3** | Component-based UI library |
| **Vite 5.4** | Fast next-generation frontend build tool |
| **Tailwind CSS 3.4** | Utility-first CSS framework with dark mode support |
| **React Router DOM 6** | Declarative client-side routing and protected routes |
| **Lucide React** | Modern iconography set |

---

## 📁 Repository Structure

```
Imgx.AI/
├── backend/
│   ├── .env                       # Backend environment configuration
│   ├── auth.py                    # JWT token generation & password hashing
│   ├── classifier.py              # PyTorch ResNet-50 singleton & inference engine
│   ├── database.py                # SQLAlchemy engine and session dependency
│   ├── dependencies.py            # Authentication dependency injection (get_current_user)
│   ├── domain_analyzers.py        # Atmospheric, celestial, and human vision analyzers
│   ├── human_detector.py          # Specialized human presence analyzer
│   ├── main.py                    # FastAPI application, routes, and lifespan setup
│   ├── models.py                  # SQLAlchemy models (User, ClassificationHistory)
│   ├── requirements.txt           # Python package dependencies
│   ├── schemas.py                 # Pydantic request/response models
│   ├── taxonomy.py                # 1,000-class ImageNet hierarchical taxonomy mapping
│   ├── tests/                     # Pytest automated test suites
│   │   ├── test_api.py            # API authentication and classification tests
│   │   └── test_hierarchy_engine.py # Taxonomy and probability tests
│   └── uploads/                   # Local storage directory for uploaded images
├── src/
│   ├── App.jsx                    # Route configuration & context wrappers
│   ├── components/                # Reusable UI components
│   │   ├── AuthenticatedLayout.jsx# Navigation wrapper for authenticated pages
│   │   ├── FinalCTA.jsx           # Landing page CTA section
│   │   ├── Footer.jsx             # Site footer
│   │   ├── HeroVisual.jsx         # Animated hero graphics
│   │   ├── Navbar.jsx             # Navigation bar with theme toggle & user menu
│   │   ├── NavigationCards.jsx    # Home dashboard feature cards
│   │   ├── PipelineSection.jsx    # Vision pipeline explainer section
│   │   ├── ProcessStrip.jsx       # Step-by-step classification strip
│   │   ├── ProtectedRoute.jsx     # Auth guard route wrapper
│   │   └── PublicOnlyRoute.jsx    # Guest-only route wrapper
│   ├── context/                   # React Context providers (AuthContext, ThemeContext)
│   ├── pages/                     # Application pages
│   │   ├── AboutPage.jsx          # Architecture & project information
│   │   ├── ClassifyPage.jsx       # Interactive classifier & camera capture
│   │   ├── HistoryPage.jsx        # User classification history & filters
│   │   ├── HomePage.jsx           # Authenticated user dashboard
│   │   ├── HowItWorksPage.jsx     # Deep learning concept walkthrough
│   │   ├── LoginPage.jsx          # Sign-in page
│   │   ├── PublicLandingPage.jsx  # Unauthenticated marketing page
│   │   ├── RegisterPage.jsx       # Sign-up page
│   │   └── ResultPage.jsx         # Classification result inspection
│   └── services/
│       └── api.js                 # Frontend API client and token manager
├── index.html                     # HTML root template
├── package.json                   # Node.js dependencies and scripts
├── tailwind.config.js             # Tailwind CSS design tokens & themes
└── vite.config.js                 # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **Python**: `3.10` to `3.12`
- **Pip** & **Virtualenv**

---

### 1. Clone the Repository

```bash
git clone https://github.com/jeevilucky143143-create/Imgx-AI.git
cd Imgx-AI
```

---

### 2. Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # On macOS / Linux:
   python3 -m venv venv
   source venv/bin/activate

   # On Windows:
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. Configure backend environment:
   Ensure `backend/.env` exists (or create one using the template below):
   ```ini
   DATABASE_URL=sqlite:///./imgx_ai.db
   SECRET_KEY=your_super_secret_jwt_key_here_change_in_production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   FRONTEND_URL=http://localhost:5173
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE_MB=15
   ```

5. Start the FastAPI backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend API will start at: **`http://localhost:8000`**
   Interactive API docs (Swagger): **`http://localhost:8000/docs`**

---

### 3. Frontend Setup

1. Open a new terminal window and navigate to the project root:
   ```bash
   cd Imgx-AI
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Configure frontend environment:
   Ensure `.env` exists in the project root:
   ```ini
   VITE_API_URL=http://localhost:8000
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at: **`http://localhost:5173`**

---

## ⚙️ Configuration & Environment Variables

### Root Configuration (`.env`)
| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API service | `http://localhost:8000` |

### Backend Configuration (`backend/.env`)
| Variable | Description | Example / Default |
|---|---|---|
| `DATABASE_URL` | Database connection string (SQLite or PostgreSQL) | `sqlite:///./imgx_ai.db` |
| `SECRET_KEY` | Secret key used for signing JWT access tokens | `your_secret_32_char_key` |
| `ALGORITHM` | JWT signing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time in minutes | `1440` (24 hours) |
| `FRONTEND_URL` | Allowed origin for CORS headers | `http://localhost:5173` |
| `UPLOAD_DIR` | Local disk directory for file storage | `./uploads` |
| `MAX_FILE_SIZE_MB` | Maximum allowed image payload size | `15` |
| `SUPABASE_URL` | *(Optional)* Supabase project URL for cloud storage | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | *(Optional)* Supabase service role key | `eyJ...` |
| `SUPABASE_STORAGE_BUCKET`| *(Optional)* Supabase storage bucket name | `imgx-images` |

---

## 📡 API Reference

Interactive OpenAPI documentation is automatically served at `http://localhost:8000/docs`.

### Authentication Endpoints

#### `POST /api/auth/register`
Register a new user account.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "StrongPassword123"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "created_at": "2026-09-23T21:00:00Z"
    }
  }
  ```

#### `POST /api/auth/login`
Authenticate credentials and receive a JWT access token.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "StrongPassword123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
  ```

#### `GET /api/auth/me`
Retrieve profile of the currently logged-in user.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

---

### Image Classification Endpoint

#### `POST /api/classify`
Upload an image file (`.jpg`, `.jpeg`, `.png`, `.webp` $\le$ 15MB) for hierarchical inference.
- **Headers**: `Authorization: Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Body**: `file: [binary image]`
- **Response**: `200 OK`
  ```json
  {
    "id": 12,
    "success": true,
    "prediction": "Golden Retriever",
    "confidence": 0.965,
    "category": "Animal",
    "subcategory": "Dog",
    "specific": "Golden Retriever",
    "classification": {
      "category": { "name": "Animal", "confidence": 0.991 },
      "subcategory": { "name": "Dog", "confidence": 0.982 },
      "specific": { "name": "Golden Retriever", "confidence": 0.965 }
    },
    "hierarchy": {
      "level1": "Animal",
      "level2": "Dog",
      "level3": "Golden Retriever"
    },
    "other_detections": [
      {
        "category": "Object",
        "subcategory": "Sports Equipment",
        "specific": "Tennis Ball",
        "confidence": 0.145
      }
    ],
    "top_predictions": [
      { "label": "Golden Retriever", "confidence": 0.965 },
      { "label": "Labrador Retriever", "confidence": 0.021 }
    ],
    "alternatives": [
      { "label": "Labrador Retriever", "confidence": 0.021 }
    ],
    "features": [
      "Level 1: Animal",
      "Level 2: Dog",
      "Level 3: Golden Retriever",
      "Calibrated Hierarchical Softmax",
      "Multi-Scale Feature Latents"
    ],
    "latency": "14.2ms",
    "image_filename": "8f3e2b1a-....jpg",
    "image_url": "/api/uploads/8f3e2b1a-....jpg",
    "is_unknown": false,
    "created_at": "2026-09-23T21:15:00Z"
  }
  ```

---

### History Endpoints

#### `GET /api/history`
Fetch the classification history for the authenticated user.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of historical classification items.

#### `DELETE /api/history`
Clear all saved classification history for the authenticated user.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{"message": "Classification history cleared successfully"}`

---

## 🧪 Testing

The backend includes a comprehensive `pytest` suite testing API endpoints, database operations, and taxonomy inference.

```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

Tests verify:
- User registration and duplicate rejection.
- Login authentication, password verification, and JWT creation.
- Protected route security and 401 unauthorized handling.
- Image classification pipeline and taxonomy mapping integrity.
- Classification history retrieval and deletion.

---

## 🚢 Deployment

### Frontend (e.g., Vercel / Netlify)
1. Set the build command to `npm run build` and output directory to `dist`.
2. Configure the environment variable:
   `VITE_API_URL=https://your-backend-api.onrender.com`
3. A `vercel.json` rewrite configuration is included for client-side routing.

### Backend (e.g., Render / Fly.io / AWS)
1. Use Python 3.11 with CPU-only wheels for PyTorch on resource-constrained tiers (specified in `backend/requirements.txt`).
2. Set startup command:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
3. Configure environment variables (`DATABASE_URL`, `SECRET_KEY`, `FRONTEND_URL`, `SUPABASE_*`).

---

## 📄 License

This project is licensed under the MIT License.
