# LMS Server

This is the backend for the College LMS Platform.

## Directory Structure
- **src/config**: Database and other configurations.
- **src/controllers**: Request handlers, separated by `admin` and `client`.
- **src/services**: Business logic, separated by `admin` and `client`.
- **src/routes**: API routes, separated by `admin` and `client`.
- **src/utils**: Utility functions like logging and authentication.
- **prisma**: Database schema.

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file with the following:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/lms_db"
    PORT=3000
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Build**
    ```bash
    npm run build
    ```

## API Endpoints
- `/api/v1/admin/*` - Admin routes
- `/api/v1/client/*` - Client routes
