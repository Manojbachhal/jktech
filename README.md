# 📦 NestJS Monolithic App – Auth, Documents, Ingestion (Python)

A full-featured, production-grade monolithic NestJS backend that includes:

- ✅ JWT Authentication (Register/Login)
- 📄 Document Management (Upload, Download, List)
- 🔁 Ingestion Trigger to Python backend using Axios
- ⚙️ Modular structure with reusable services
- 📄 Swagger API Documentation

---

## 📁 Folder Structure

```
src/
├── auth/                  # Register/Login & AuthService
├── users/                 # User entity
├── documents/             # Upload, Download APIs
├── ingestion/             # Trigger ingestion to Python service
├── common/
│   ├── axios/             # backend.client.ts (Axios pre-configured)
│   └── decorators/        # roles.decorator.ts (Role meta data for Role Guard)
│   └── entities/          # base.dto.ts (Base Entity Dto)
│   |                      # base.entity.ts (Base Entity)
│   └── filters/           # http-exception.filter.ts (Globle exception handler)
│   └── guards/            # roles.guard.ts (Role Guard)
│   └── interceptors/      # file.interceptor.ts (File interceptor for handling file upload)
│   └── utils/             # generic-response.ts. (Generic response for client site)
                           # reponse-wrapper.ts. (Generic response wrapper)
```

---

## 🧩 Key Packages Used

| Package            | Purpose                               |
| ------------------ | ------------------------------------- |
| `@nestjs/passport` | Integrates Passport.js with NestJS    |
| `passport-jwt`     | Handles JWT-based authentication      |
| `@nestjs/typeorm`  | ORM integration for NestJS            |
| `axios`            | Makes HTTP requests to Python service |
| `@nestjs/swagger`  | Auto-generates Swagger API docs       |
| `class-validator`  | Validates DTOs (input schemas)        |

## 🚀 Setup & Run

### 1. Install Dependencies

```bash
git clone <repo-url>
```

```bash
cd myapp
```

```bash
npm install
```

## 2. Environment Configuration

Create a file named .env.dev for development as per env.example file

### 3. Start the Application

```bash
npm run start:dev
```

App runs on: `http://localhost:3000`

---

## 🔐 Auth APIs

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "email@example.com",
  "password": "123456"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "email@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "status": 1,
  "message": "Login successful",
  "data": {
    "access_token": "Token"
  }
}
```

---

## 📄 Document API Examples

> Requires Authorization: `Bearer <JWT>`

- `GET /api/auth/documents`
- `POST /api/auth/documents/upload`
- `GET /api/auth/documents/download/:id`

---

## 🔁 Ingestion API (Triggers Python Backend)

```http
POST /api/auth/ingestion/trigger
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "documentId": "abc123"
}
```

> Axios instance located at:

```
src/common/axios/backend.client.ts
```

```ts
import axios from "axios";

const pythonBackend = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 5000,
});

export default pythonBackend;
```

---

## 📄 Swagger Documentation

Access Swagger UI at:

```
http://localhost:3000/api/auth/swagger
```

Provides full API documentation using `@nestjs/swagger`.

---

## 🧱 Deployment Ready

- All modules are separated
- Axios instance is reusable and centralized
- Can be containerized using Docker
- Ready to be split into microservices

---

## 👨‍💻 Author

**Manoj Kumar**
