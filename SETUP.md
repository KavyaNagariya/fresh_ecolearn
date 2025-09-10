# EcoLearn Project Setup Guide

## For Team Members / Collaborators

When you clone this project, follow these steps to connect to the shared database:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd project_ecolearn
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
# Copy the example environment file
cp .env.example .env
```

### 4. Configure Database Connection
Open the `.env` file and make sure it contains:
```
DATABASE_URL=postgresql://neondb_owner:npg_98LZvfqiecKO@ep-tiny-dream-a1p0bazy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
USE_DATABASE=true
```

### 5. Start the Development Server
```bash
npm run dev
```

### 6. Verify Database Connection
When you start the server, you should see:
```
🗄️ Using PostgreSQL database storage
📍 Connected to: ep-tiny-dream-a1p0bazy-pooler.ap-southeast-1.aws.neon.tech
🌍 Database Host: ep-tiny-dream-a1p0bazy-pooler.ap-southeast-1.aws.neon.tech
```

If you see `⚠️ WARNING: Using in-memory storage`, it means the database is not properly configured.

## Troubleshooting

### Problem: Data not syncing between team members
**Cause**: Different database configurations
**Solution**: Make sure both team members are using the same DATABASE_URL in their `.env` file.

### Problem: "Using in-memory storage" message
**Cause**: Missing or incorrect `.env` file
**Solution**: 
1. Check if `.env` file exists
2. Verify DATABASE_URL is correct
3. Ensure USE_DATABASE=true
4. The system will show helpful instructions when this happens

### Problem: Database connection errors
**Cause**: Network issues or incorrect connection string
**Solution**: 
1. Check internet connection
2. Verify the NeonDB connection string is still valid
3. Try accessing NeonDB dashboard to confirm database is active

## Understanding the Console Messages

### ✅ Correct Setup (Shared Database):
```
🗄️ Using PostgreSQL database storage
📍 Connected to: ep-tiny-dream-a1p0bazy-pooler.ap-southeast-1.aws.neon.tech
```

### ❌ Incorrect Setup (Local Storage):
```
⚠️ WARNING: Using in-memory storage (data will be lost on restart)
🔧 To use shared database:
   1. Copy .env.example to .env
   2. Update DATABASE_URL with the correct NeonDB connection string
   3. Set USE_DATABASE=true
   4. Restart the server with npm run dev
```

## Shared Database Architecture

This project uses NeonDB (cloud PostgreSQL) as the shared database:
- **Firebase**: Handles user authentication
- **NeonDB**: Stores all application data (profiles, badges, progress, etc.)
- **Local Storage**: Caches user data temporarily

All team members connect to the same NeonDB instance, ensuring data synchronization across different development environments.

## Why This Approach?

1. **Real Collaboration**: Multiple developers can work with the same data
2. **Consistent Testing**: Everyone tests with the same dataset
3. **No Data Loss**: Cloud database persists data between sessions
4. **Easy Onboarding**: New team members get access to existing data immediately

## Security Note

The `.env` file is gitignored for security reasons. Each team member needs to create their own `.env` file with the shared database credentials.