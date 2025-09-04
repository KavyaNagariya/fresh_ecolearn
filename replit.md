# EcoLearn - Gamified Environmental Education Platform

## Overview

EcoLearn is a comprehensive educational platform designed to transform environmental education through gamification. The application combines interactive lessons, real-world challenges, and competitive elements to motivate students to adopt eco-friendly habits. Built as a Smart India Hackathon 2025 submission, it serves multiple stakeholders including students, teachers, schools, and communities with tailored experiences for each user group.

The platform features a React-based frontend with modern UI components, an Express.js backend API, and PostgreSQL database integration. It implements a comprehensive contact system for user engagement and feedback collection.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query** for server state management, caching, and data synchronization
- **Shadcn/ui** component library built on Radix UI primitives for accessible, customizable UI components
- **Tailwind CSS** for utility-first styling with CSS custom properties for theming
- **React Hook Form** with Zod validation for type-safe form handling

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints
- **Modular route registration** pattern with centralized server setup
- **In-memory storage implementation** with interface-based design for easy database migration
- **Comprehensive error handling** with structured error responses
- **Request/response logging middleware** for API monitoring

### Database Design
- **Drizzle ORM** for type-safe database operations and schema management
- **PostgreSQL** as the primary database (configured but using in-memory storage currently)
- **Schema-first approach** with Zod validation schemas derived from database tables
- **Separate users and contacts tables** with proper foreign key relationships and timestamps

### Styling and Design System
- **Custom CSS variables** for consistent theming across light/dark modes
- **Responsive design patterns** with mobile-first approach
- **Component composition** using Radix UI primitives for accessibility compliance
- **Gradient-based color schemes** for visual appeal and brand consistency

### Development and Build Process
- **TypeScript configuration** with path mapping for clean imports
- **ESM modules** throughout the application for modern JavaScript support
- **Separate build processes** for client and server with optimized production builds
- **Development tooling** including Replit integration and error overlay

## External Dependencies

### Database and ORM
- **@neondatabase/serverless** - Serverless PostgreSQL database driver
- **drizzle-orm** - Type-safe SQL query builder and ORM
- **drizzle-kit** - Database migration and schema management tools

### UI and Styling
- **@radix-ui/* components** - Headless, accessible UI primitives for modals, dropdowns, forms, etc.
- **tailwindcss** - Utility-first CSS framework for rapid UI development
- **class-variance-authority** - Component variant management for consistent styling
- **lucide-react** - Modern icon library with React components

### Frontend State Management
- **@tanstack/react-query** - Server state management, caching, and background updates
- **react-hook-form** - Performant form library with minimal re-renders
- **@hookform/resolvers** - Form validation resolvers for various schema libraries

### Backend Infrastructure
- **express** - Web application framework for Node.js
- **connect-pg-simple** - PostgreSQL session store (configured but not actively used)

### Development Tools
- **vite** - Fast build tool and development server with hot module replacement
- **typescript** - Static type checking for enhanced developer experience
- **zod** - Runtime type validation and schema definition