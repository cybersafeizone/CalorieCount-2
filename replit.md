# Calorie Calculator Application

## Overview

This is a full-stack web application built with React frontend and Express backend that helps users calculate their daily calorie needs based on personal metrics and activity levels. The application uses the Mifflin-St Jeor equation to calculate Basal Metabolic Rate (BMR) and adjusts for activity levels to provide personalized calorie recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Management**: React Hook Form with Zod validation
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: Hot reloading with tsx
- **Build**: esbuild for production bundling
- **Storage**: In-memory storage with interface for future database integration

### Data Storage Solutions
- **Current**: In-memory storage using Map data structures
- **Planned**: PostgreSQL with Drizzle ORM (configured but not yet implemented)
- **Database Driver**: Neon serverless for PostgreSQL connectivity
- **Schema Management**: Drizzle Kit for migrations and schema management

### Authentication and Authorization
- **Status**: Not currently implemented
- **Prepared**: User schema exists with username/password fields
- **Session Management**: connect-pg-simple configured for PostgreSQL sessions

## Key Components

### Frontend Components
1. **Home Page** (`client/src/pages/home.tsx`): Main calorie calculator interface
2. **UI Components** (`client/src/components/ui/`): Complete shadcn/ui component library
3. **Calorie Calculator** (`client/src/lib/calorie-calculator.ts`): Core BMR and calorie calculation logic
4. **Form Validation**: Zod schemas for input validation
5. **Toast Notifications**: User feedback system for actions

### Backend Components
1. **Server Entry** (`server/index.ts`): Express application setup with middleware
2. **Route Registration** (`server/routes.ts`): API endpoint definitions (currently minimal)
3. **Storage Interface** (`server/storage.ts`): Abstracted storage layer with in-memory implementation
4. **Vite Integration** (`server/vite.ts`): Development server setup with HMR

### Shared Components
1. **Database Schema** (`shared/schema.ts`): Drizzle ORM schema definitions
2. **Type Definitions**: Shared TypeScript types between frontend and backend

## Data Flow

### Calorie Calculation Flow
1. User inputs personal metrics (age, weight, height, gender, activity level)
2. Form validation using Zod schemas
3. BMR calculation using Mifflin-St Jeor equation
4. Activity level multiplier applied to BMR
5. Results displayed with activity level descriptions

### Current Data Storage
- All data stored in memory using Map structures
- User data persistence planned for future database integration
- Storage interface abstracts implementation details

### API Architecture
- RESTful API design with `/api` prefix
- JSON request/response format
- Error handling with consistent status codes
- Request logging middleware for development

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, TanStack Query
- **UI Framework**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Forms**: React Hook Form, Hookform resolvers
- **Validation**: Zod, drizzle-zod
- **Backend**: Express, cors middleware
- **Database**: Drizzle ORM, Neon serverless driver

### Development Dependencies
- **Build Tools**: Vite, esbuild, TypeScript
- **Code Quality**: ESLint, Prettier (configured via Replit)
- **Development**: tsx for TypeScript execution, Replit-specific plugins

### UI Enhancement Libraries
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Utilities**: clsx, tailwind-merge
- **Carousel**: Embla Carousel React

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Module Replacement**: Full HMR support for React components
- **TypeScript**: Strict type checking with incremental compilation
- **Environment Variables**: DATABASE_URL for PostgreSQL connection

### Production Build
- **Frontend**: Vite build outputting to `dist/public`
- **Backend**: esbuild bundling to `dist/index.js`
- **Static Assets**: Served by Express in production
- **Process Management**: Single Node.js process serving both frontend and API

### Database Configuration
- **Migration Management**: Drizzle Kit for schema migrations
- **Connection**: PostgreSQL via Neon serverless
- **Environment**: DATABASE_URL required for production deployment
- **Schema Location**: `./migrations` for generated migrations

### Replit Integration
- **Development Banner**: Replit development mode detection
- **Runtime Error Overlay**: Enhanced error reporting in development
- **Cartographer Plugin**: Replit-specific development tools
- **File System Security**: Strict file access controls in production