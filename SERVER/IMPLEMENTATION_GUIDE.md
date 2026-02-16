# LMS Backend Implementation Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Technology Stack](#technology-stack)
5. [Getting Started](#getting-started)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Development Workflow](#development-workflow)
9. [Utilities & Helpers](#utilities--helpers)
10. [Best Practices](#best-practices)

---

## Project Overview

This is the backend server for the **College LMS Platform** - a comprehensive Learning Management System designed for educational institutions. The platform supports:

- **User Management**: Students, faculty, and administrators
- **Academic Structure**: Colleges, departments, and batches
- **Coding Platform**: Problems, modules, submissions, and test cases
- **Assessment System**: Tests and test attempts
- **Community Features**: Blogs, comments, and voting
- **External Integrations**: Hackathons and open-source issues tracking
- **Gamification**: Coins, streaks, and store items

---

## Architecture

### Layered Architecture

```
┌─────────────────────────────────────┐
│         Client (Frontend)           │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Express Server (server.ts)     │
│  - CORS, Helmet, Morgan, Winston    │
│  - Global Error Handler             │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         Routes Layer                │
│  - /api/admin/*                     │
│  - /api/client/*                    │
│  - /api/auth/*                      │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Controllers Layer              │
│  - Request validation               │
│  - Response formatting              │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│       Services Layer                │
│  - Business logic                   │
│  - Database operations              │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Prisma ORM + PostgreSQL        │
└─────────────────────────────────────┘
```

---

## Project Structure

```
SERVER/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── src/
│   ├── config/
│   │   ├── db.ts              # Prisma client instance
│   │   ├── dbSeeder.ts        # Database seeding functions
│   │   ├── index.ts           # Config exports
│   │   └── logger.ts          # Winston logger configuration
│   ├── constants/
│   │   ├── appConstants.ts    # Application constants
│   │   └── permission.ts      # Permission definitions
│   ├── modules/               # Module-based organization
│   │   ├── admin/
│   │   │   └── adminRouter.ts # Admin router
│   │   ├── client/
│   │   │   └── clientRouter.ts # Client router
│   │   └── common/
│   │       └── auth/
│   │           ├── authController.ts  # Auth request handlers
│   │           ├── authService.ts     # Auth business logic
│   │           ├── authRouter.ts      # Auth routes
│   │           └── authValidator.ts   # Auth validation
│   ├── utils/
│   │   ├── bcryptUtil.ts      # Password hashing utilities
│   │   ├── errorMiddleware.ts # Error handling & async wrapper
│   │   ├── jwtUtil.ts         # JWT token utilities
│   │   ├── responseUtil.ts    # Response formatting utilities
│   │   └── index.ts           # Utils exports
│   ├── validator/
│   │   └── index.ts           # Express-validator schemas
│   └── app.ts                 # Express app router setup
├── server.ts                  # Server entry point
├── package.json
├── tsconfig.json
└── .env                       # Environment variables
```

---

## Technology Stack

### Core Technologies
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma

### Key Dependencies
- **Security**: `helmet`, `cors`, `bcryptjs`, `jsonwebtoken`
- **Logging**: `winston`, `morgan`
- **Validation**: `express-validator`
- **Development**: `nodemon`, `concurrently`, `tsx`

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment variables**
   
   Create a \`.env\` file in the root directory:
   \`\`\`env
   DATABASE_URL="postgresql://user:password@localhost:5432/lms_db"
   PORT=3000
   CLIENT_ORIGIN="http://localhost:5173"
   JWT_SECRET="your-secret-key"
   JWT_EXPIRES_IN="7d"
   \`\`\`

3. **Generate Prisma Client**
   \`\`\`bash
   npm run prisma:generate
   \`\`\`

4. **Run database migrations**
   \`\`\`bash
   npm run prisma:migrate
   \`\`\`

5. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

### Available Scripts

| Command | Description |
|---------|-------------|
| \`npm run dev\` | Start development server with hot reload |
| \`npm run build\` | Compile TypeScript to JavaScript |
| \`npm start\` | Run production server |
| \`npm run watch\` | Watch TypeScript files for changes |
| \`npm run prisma:generate\` | Generate Prisma Client |
| \`npm run prisma:migrate\` | Run database migrations |
| \`npm run prisma:studio\` | Open Prisma Studio (database GUI) |
| \`npm run prisma:push\` | Push schema changes to database |

---

## Database Schema

### Core Entities

#### Users & Authentication
- **users**: User accounts with roles and permissions
- **roles**: User role definitions (ADMIN, STUDENT, etc.)
- **permissions**: Granular permission definitions
- **role_permissions**: Role-permission mappings
- **login_logs**: Login attempt tracking
- **action_logs**: User action audit trail

#### Academic Structure
- **colleges**: Educational institutions
- **departments**: Academic departments
- **batches**: Student batch/cohort years
- **student_profiles**: Extended student information
- **student_platform_profiles**: External platform usernames

#### Learning Management
- **modules**: Hierarchical content organization
- **problems**: Coding problems/exercises
- **testcases**: Problem test cases
- **submissions**: Student code submissions
- **programming_language**: Supported languages

#### Assessment
- **tests**: Scheduled assessments
- **test_problems**: Test-problem associations
- **test_attempts**: Student test attempts

#### Community & Engagement
- **blogs**: User blog posts
- **comments**: Blog comments
- **tags**: Content tags
- **blog_tags_mapping**: Blog-tag associations
- **vote_user_mapping**: Blog voting system

#### External Integrations
- **hackathons**: Hackathon opportunities
- **opensource_issues**: Open-source contribution tracking
- **user_hackathon_participation**: User hackathon participation
- **user_contributions**: User open-source contributions
- **api_cache**: External API response caching
- **platform_sync_status**: External platform sync tracking

#### Gamification
- **store_items**: Virtual store items
- **user_purchases**: User purchase history
- **user_preferences**: User preference settings
- **user_bookmarks**: Bookmarked content
- **placements**: Placement tracking
- **daily_challenges**: Daily coding challenges

---

## API Endpoints

### Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

### Authentication Routes (\`/api/auth\`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | \`/auth/login\` | User login | No |
| GET | \`/auth/health\` | Health check | No |

**Login Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Login Response:**
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "STUDENT"
    }
  }
}
\`\`\`

### Admin Routes (\`/api/admin\`)

Currently available:
- \`GET /admin/health\` - Health check

**Planned endpoints** (based on available services):
- User Management: \`/admin/users\`
- Department Management: \`/admin/departments\`
- College Management: \`/admin/colleges\`
- Batch Management: \`/admin/batches\`

### Client Routes (\`/api/client\`)

Currently available:
- \`GET /client/health\` - Health check

**Planned endpoints** (based on available services):
- Submission Management: \`/client/submissions\`
- User Submissions: \`/client/users/:user_id/submissions\`
- Problem Submissions: \`/client/problems/:problem_id/submissions\`

---

## Development Workflow

### Adding a New Feature

Follow this step-by-step process using the module-based structure:

#### 1. **Define the Service Layer**

Create business logic in `src/modules/[admin|client]/[feature]/[feature]Service.ts`:

\`\`\`typescript
import prisma from "../../../config/db";
import { AppError } from "../../../utils/errorMiddleware";

export const createItem = async (data: CreateItemInput) => {
  // Validation
  const existing = await prisma.items.findUnique({
    where: { id: data.id }
  });
  
  if (existing) {
    throw new AppError("Item already exists", 400);
  }

  // Create
  const item = await prisma.items.create({
    data,
    include: {
      // Include related data
    }
  });

  return item;
};
\`\`\`

#### 2. **Create the Controller**

Create request handlers in `src/modules/[admin|client]/[feature]/[feature]Controller.ts`:

\`\`\`typescript
import { Request, Response } from "express";
import * as featureService from "./featureService";
import { asyncHandler } from "../../../utils/errorMiddleware";
import { sendSuccess } from "../../../utils/responseUtil";

export const createItemController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    const item = await featureService.createItem(data);
    sendSuccess(res, 201, "Item created successfully", item);
  }
);
\`\`\`

#### 3. **Define Routes**

Create routes in `src/modules/[admin|client]/[feature]/[feature]Router.ts`:

\`\`\`typescript
import express from "express";
import * as featureController from "./featureController";

const router = express.Router();

router.post("/items", featureController.createItemController);
router.get("/items", featureController.getAllItemsController);
router.get("/items/:id", featureController.getItemByIdController);
router.put("/items/:id", featureController.updateItemController);
router.delete("/items/:id", featureController.deleteItemController);

export default router;
\`\`\`

#### 4. **Register Routes**

Update the main router in `src/modules/admin/adminRouter.ts` or `src/modules/client/clientRouter.ts`:

\`\`\`typescript
import express from "express";
import featureRouter from "./feature/featureRouter";

const router = express.Router();

router.use("/feature", featureRouter);

export default router;
\`\`\`

#### 5. **Add Validation (Optional)**

Add validators in the same module directory `src/modules/[admin|client]/[feature]/[feature]Validator.ts`:

\`\`\`typescript
import { body } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const createItemValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  // Add more validations
];

export function validator(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}
\`\`\`

#### 6. **Test the Endpoint**

Use tools like Postman or curl:

\`\`\`bash
curl -X POST http://localhost:3000/api/admin/items \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Test Item"}'
\`\`\`

---

## Utilities & Helpers

### Error Handling

**AppError Class**: Custom error class for operational errors

\`\`\`typescript
import { AppError } from "../utils/errorMiddleware";

throw new AppError("Resource not found", 404);
\`\`\`

**asyncHandler**: Wrapper for async route handlers

\`\`\`typescript
import { asyncHandler } from "../utils/errorMiddleware";

export const myController = asyncHandler(async (req, res) => {
  // Your async code - errors are automatically caught
});
\`\`\`

### Response Formatting

**sendSuccess**: Standardized success response

\`\`\`typescript
import { sendSuccess } from "../utils/responseUtil";

sendSuccess(res, 200, "Operation successful", data);
// Response: { success: true, message: "...", data: {...} }
\`\`\`

**sendError**: Standardized error response

\`\`\`typescript
import { sendError } from "../utils/responseUtil";

sendError(res, 400, "Validation failed", errors);
// Response: { success: false, message: "...", errors: {...} }
\`\`\`

### Authentication

**Password Hashing**:
\`\`\`typescript
import { hashPassword, comparePassword } from "../utils/bcryptUtil";

const hashed = await hashPassword({ password: "plain" });
const isMatch = await comparePassword({ password: "plain", hash: hashed });
\`\`\`

**JWT Tokens**:
\`\`\`typescript
import { generateToken, verifyToken } from "../utils/jwtUtil";

const token = generateToken({ userId: 1, role: "ADMIN" });
const decoded = verifyToken({ token });
\`\`\`

### Logging

\`\`\`typescript
import { logger } from "./config/index";

logger.info("Information message");
logger.error("Error message", { error });
logger.warn("Warning message");
\`\`\`

---

## Best Practices

### 1. **Error Handling**
- Always use \`asyncHandler\` for async route handlers
- Throw \`AppError\` for operational errors
- Let unexpected errors bubble up to global error handler

### 2. **Database Operations**
- Use Prisma's type-safe queries
- Always select only needed fields
- Use transactions for multi-step operations
- Handle unique constraint violations

### 3. **Security**
- Never expose passwords in responses
- Validate all user inputs
- Use parameterized queries (Prisma does this automatically)
- Implement proper authentication/authorization

### 4. **Code Organization**
- Keep controllers thin - delegate to services
- Keep services focused on business logic
- Use TypeScript interfaces for type safety
- Follow the existing folder structure

### 5. **API Design**
- Use RESTful conventions
- Return consistent response formats
- Use appropriate HTTP status codes
- Version your APIs if needed

### 6. **Testing**
- Write unit tests for services
- Write integration tests for endpoints
- Test error scenarios
- Use Prisma's test utilities

### 7. **Performance**
- Use database indexes appropriately
- Implement pagination for large datasets
- Cache frequently accessed data
- Use \`select\` to limit returned fields

---

## Database Seeding

The application includes automatic seeding on server start:

### Current Seeds

1. **Permissions**: System permissions from \`src/constants/permission.ts\`
2. **Roles**: ADMIN and STUDENT roles
3. **Credentials**: Default admin and user accounts
4. **Colleges**: Sample colleges
5. **Departments**: Academic departments
6. **Batches**: Student batch years

### Seeding Functions

Located in \`src/config/dbSeeder.ts\`:
- \`seedPermissions()\`
- \`seedCredentials()\`
- \`seedColleges()\`
- \`seedDepartments()\`
- \`seedBatches()\`

### Default Credentials

Check \`src/constants/appConstants.ts\` for default login credentials.

---

## Next Steps

### Immediate Priorities

1. **Implement Admin Routes**
   - User CRUD operations
   - Department/College/Batch management
   - Problem and module management

2. **Implement Client Routes**
   - Submission endpoints
   - Problem browsing
   - User profile management

3. **Add Authentication Middleware**
   - JWT verification middleware
   - Role-based access control
   - Permission checking

4. **Testing**
   - Set up Jest and Supertest
   - Write unit tests for services
   - Write integration tests for APIs

5. **Documentation**
   - API documentation (Swagger/OpenAPI)
   - Code comments
   - Deployment guide

---

## Support & Resources

- **Prisma Documentation**: https://www.prisma.io/docs
- **Express.js Guide**: https://expressjs.com/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

**Last Updated**: February 16, 2026
