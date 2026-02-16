# LMS Server

This is the backend for the College LMS Platform.

## Directory Structure
- **src/config**: Database and other configurations.
- **src/modules**: Module-based organization separating admin, client, and common functionality.
  - **src/modules/admin**: Admin-specific routers and logic.
  - **src/modules/client**: Client-specific routers and logic.
  - **src/modules/common/auth**: Authentication logic (controllers, services, validators, routes).
- **src/utils**: Utility functions like logging and authentication.
- **prisma**: Database schema.

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file with the following:
    refer to the whatsApp chat

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
