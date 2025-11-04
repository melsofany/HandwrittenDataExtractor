# Overview

This is an Arabic handwriting recognition application that processes handwritten documents and extracts structured data (names and national IDs) using Google's Gemini AI. The application allows users to upload images of handwritten Arabic documents, processes them in batch, and exports the extracted data to Google Sheets or Excel format.

The application is built as a full-stack web application with a React frontend and Express backend, designed specifically for right-to-left (RTL) Arabic text processing.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: shadcn/ui components based on Radix UI primitives with Material Design 3 principles

**Styling**: Tailwind CSS with custom RTL (Right-to-Left) configuration for Arabic language support
- Custom theme with neutral color palette
- RTL layout system throughout the application
- Arabic-optimized typography using Cairo and IBM Plex Sans Arabic fonts
- Responsive design with mobile-first approach

**State Management**: 
- React hooks for local component state
- TanStack Query (React Query) for server state management
- Multi-stage application flow: upload → preview → processing → results → sheet-created

**Routing**: Wouter for lightweight client-side routing

**Key Design Decisions**:
- RTL layout is enforced at the HTML level (`dir="rtl"`)
- Component library follows Material Design 3 patterns for consistency
- Toast notifications for user feedback
- File upload supports drag-and-drop and file selection (up to 40 images)
- Batch processing with real-time status updates

## Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**API Design**: RESTful endpoints with JSON responses
- `/api/process-image` - Single image processing with multipart/form-data
- `/api/create-sheet` - Google Sheets creation

**File Upload Handling**: Multer middleware
- 10MB file size limit per image
- JPEG and PNG image format validation
- In-memory storage (buffer-based)

**Data Processing Flow**:
1. Image upload and validation
2. Base64 encoding of image data
3. Gemini AI processing for text extraction
4. Structured data validation using Zod schemas
5. Response with extracted records

**Storage**: In-memory storage implementation (`MemStorage` class)
- Stores extracted records temporarily during session
- Map-based data structure for fast lookups
- No persistent database (stateless processing)

**Key Design Decisions**:
- Stateless processing - each request is independent
- No database persistence - data exists only during processing flow
- Error handling with try-catch blocks and appropriate HTTP status codes
- Request logging with duration tracking for API endpoints

## Data Models

**ExtractedRecord Schema**:
- `id`: Unique identifier (string)
- `name`: Full Arabic name (string)
- `nationalId`: 14-digit national ID number (string)
- `sourceImageId`: Optional reference to source image (string)

**Request/Response Schemas**:
- All schemas defined using Zod for runtime validation
- Type inference for TypeScript type safety
- Shared schema definitions between client and server

## External Dependencies

**AI/ML Services**:
- **Google Gemini AI** (`@google/generative-ai`): Primary service for handwriting recognition
  - Model: gemini-1.5-flash
  - Processes base64-encoded images with Arabic text prompts
  - Extracts structured JSON data from handwritten Arabic documents
  - Requires `GEMINI_API_KEY` environment variable

**Google Services Integration**:
- **Google Sheets API** (`googleapis`): Creates and populates spreadsheets with extracted data
  - OAuth2 authentication through Replit Connectors
  - Requires connection setup via `REPLIT_CONNECTORS_HOSTNAME`
  - Token management with automatic refresh
  - **Important**: Client must never be cached due to token expiration

**Database** (Configured but not currently used):
- **Neon Serverless Postgres** (`@neondatabase/serverless`): PostgreSQL database adapter
- **Drizzle ORM** (`drizzle-kit`): TypeScript ORM for database schema management
  - Schema defined in `shared/schema.ts`
  - Migrations output to `./migrations`
  - Requires `DATABASE_URL` environment variable
  - Note: Database infrastructure is configured but the application currently uses in-memory storage only

**File Upload**:
- **Multer**: Multipart form data handling for image uploads

**UI Component Libraries**:
- **Radix UI**: Headless UI primitives for accessibility
- **shadcn/ui**: Pre-built component system
- **Lucide React**: Icon library

**Development Tools**:
- **Replit-specific plugins**: Runtime error overlay, cartographer, dev banner (development only)

**Environment Variables Required**:
- `GEMINI_API_KEY`: Google Gemini API authentication
- `DATABASE_URL`: PostgreSQL connection string (if database is used)
- `REPLIT_CONNECTORS_HOSTNAME`: Replit connectors service endpoint
- `REPL_IDENTITY` or `WEB_REPL_RENEWAL`: Authentication tokens for Replit services
- `NODE_ENV`: Environment mode (development/production)