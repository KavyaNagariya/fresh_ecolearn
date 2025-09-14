# 🌱 EcoLearn - Gamified Environmental Education Platform
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

EcoLearn is a comprehensive educational platform designed to transform environmental education through gamification. Built as a Smart India Hackathon 2025 submission, it combines interactive lessons, real-world challenges, and competitive elements to motivate students to adopt eco-friendly habits.

## 🎯 Overview

EcoLearn serves multiple stakeholders including students, teachers, schools, and communities with tailored experiences for each user group. The platform features a modern React-based frontend, Express.js backend API, and PostgreSQL database integration with a comprehensive contact system for user engagement and feedback collection.

## ✨ Key Features

### 🎓 Interactive Learning System
- **5 Educational Modules**: Climate Change, Water Conservation, Waste Management, Energy Efficiency, and Biodiversity
- **Gamified Quizzes**: Multiple-choice questions with instant feedback and scoring
- **Progress Tracking**: Real-time progress monitoring across all modules
- **Achievement System**: Digital badges and eco-points for completed activities

### 📸 Photo-Based Challenges
- **Weekly Challenges**: Real-world environmental actions students can capture and share
- **Admin Review System**: Photo submissions reviewed by administrators
- **Resubmission Logic**: Students can resubmit after rejection but not after approval
- **Points & Rewards**: Earn eco-points for approved challenge submissions

### 🏆 Gamification Elements
- **Eco-Points System**: Earn points for lessons, quizzes, and challenges
- **Digital Badges**: Unlock achievement badges for various accomplishments
- **Leaderboards**: School-based and global rankings
- **Level Progression**: Level up system based on accumulated eco-points

### 👥 Multi-Stakeholder Support
- **Students**: Interactive learning dashboard with progress tracking
- **Teachers**: Analytics dashboard for monitoring student progress
- **Schools**: Institution-level leaderboards and impact tracking
- **Communities**: Global impact visualization and collaboration

### 🔐 Authentication & Security
- **Firebase Authentication**: Secure user registration and login
- **Admin Panel**: Separate admin authentication system
- **Role-Based Access**: Different permissions for students, teachers, and admins
- **Profile Management**: Comprehensive user profile setup and management

## 🏗️ System Architecture

```mermaid
graph TD
    A[User] -->|Authenticates| B[Firebase Auth]
    B --> C[React Frontend]
    C -->|API Calls| D[Express.js Backend]
    D -->|Database Queries| E[PostgreSQL]

    subgraph Frontend
        C --> G[Landing Page]
        C --> H[Dashboard]
        C --> I[Learning Modules]
        C --> J[Photo Challenges]
        C --> K[Profile Management]
    end

    subgraph Backend
        D --> L[Authentication Routes]
        D --> M[Learning Module APIs]
        D --> N[Challenge Management]
        D --> O[Admin Panel APIs]
        D --> P[Contact System]
    end

    subgraph Database
        E --> Q[Users Table]
        E --> R[Student Profiles]
        E --> S[Lessons & Quizzes]
        E --> T[Challenges & Submissions]
        E --> U[Badges & Achievements]
    end
```

## 🔄 User Flow Diagram

```mermaid
flowchart TD
    START([User Visits Platform]) --> AUTH{Authenticated?}
    AUTH -->|No| LOGIN[Login/Register]
    AUTH -->|Yes| DASH[Dashboard]
    LOGIN --> PROFILE[Complete Profile]
    PROFILE --> DASH

    DASH --> MODULES[Learning Modules]
    DASH --> CHALLENGES[Photo Challenges]
    DASH --> LEADERBOARD[Leaderboards]

    MODULES --> QUIZ[Take Quiz]
    QUIZ --> PASS{Score >= 30?}
    PASS -->|Yes| UNLOCK[Unlock Next Module]
    PASS -->|No| RETRY[Retry Quiz]
    RETRY --> QUIZ
    UNLOCK --> BADGE[Earn Badge]

    CHALLENGES --> SUBMIT[Submit Photo]
    SUBMIT --> REVIEW[Admin Review]
    REVIEW --> APPROVE{Approved?}
    APPROVE -->|Yes| POINTS[Earn Points]
    APPROVE -->|No| RESUBMIT[Can Resubmit]
    RESUBMIT --> SUBMIT
    POINTS --> BADGE

    BADGE --> DASH
```

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant FB as Firebase Auth
    participant B as Backend
    participant DB as Database

    U->>F: Enter Credentials
    F->>FB: Authentication Request
    FB-->>F: Firebase Token
    F->>B: API Request with Token
    B->>FB: Verify Token
    FB-->>B: Token Valid
    B->>DB: Query User Data
    DB-->>B: User Profile
    B-->>F: User Data Response
    F-->>U: Login Success
```

## 📊 Data Flow Architecture

```mermaid
graph LR
    subgraph "Client Side"
        A[React Components] --> B[TanStack Query]
        B --> C[API Client]
    end

    subgraph "Server Side"
        C -->|HTTP Requests| D[Express Routes]
        D --> E[Middleware]
        E --> F[Controllers]
        F --> G[Drizzle ORM]
        G --> H[PostgreSQL]
    end

    subgraph "External Services"
        F --> I[Firebase Auth]
        F --> J[Cloudinary API]
    end

    H --> G
    G --> F
    F --> D
    D --> C
```

## 🗄️ Database Schema

```mermaid
erDiagram
    users {
        string id PK
        string email
        timestamp created_at
    }

    student_profiles {
        string id PK
        string user_id FK
        string name
        string school
        string grade
        int eco_points
        int level
    }

    user_lesson_progress {
        string id PK
        string user_id FK
        string lesson_id
        boolean completed
        timestamp completed_at
    }

    user_quiz_results {
        string id PK
        string user_id FK
        string quiz_id
        int score
        timestamp taken_at
    }

    challenges {
        string id PK
        string title
        string description
        string category
        int points
        boolean active
    }

    user_challenge_submissions {
        string id PK
        string user_id FK
        string challenge_id FK
        string image_url
        string caption
        string status
        timestamp submitted_at
    }

    badges {
        string id PK
        string name
        string description
        string icon_url
        string criteria
    }

    user_badges {
        string id PK
        string user_id FK
        string badge_id FK
        timestamp earned_at
    }

    admin_users {
        string id PK
        string username
        string password_hash
        timestamp created_at
    }

    contacts {
        string id PK
        string name
        string email
        string message
        timestamp submitted_at
    }

    users ||--|| student_profiles : "has"
    users ||--o{ user_lesson_progress : "completes"
    users ||--o{ user_quiz_results : "takes"
    users ||--o{ user_challenge_submissions : "submits"
    users ||--o{ user_badges : "earns"
    challenges ||--o{ user_challenge_submissions : "receives"
    badges ||--o{ user_badges : "awarded_as"
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or use the provided NeonDB connection)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd project_ecolearn
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example environment file
cp .env.example .env
```

4. **Configure database connection**  
Open the `.env` file and add:
```env
DATABASE_URL=postgresql://neondb_owner:npg_98LZvfqiecKO@ep-tiny-dream-a1p0bazy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
USE_DATABASE=true
```

5. **Start the development server**
```bash
npm run dev
```

6. **Verify database connection**  
You should see:
```
🗄️ Using PostgreSQL database storage
📍 Connected to: ep-tiny-dream-a1p0bazy-pooler.ap-southeast-1.aws.neon.tech
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🎮 Challenge System

### Challenge Types
- **Photo-based challenges** requiring real-world environmental actions
- **Weekly rotating challenges** to maintain engagement
- **Category-based challenges** (Climate Change, Water Conservation, etc.)
- **Point-based rewards** for approved submissions

### Submission Workflow
1. **Student submits photo** with caption
2. **Admin reviews submission** in dedicated admin panel
3. **Approval/Rejection** with feedback
4. **Points awarded** for approved submissions
5. **Resubmission allowed** only after rejection

## 👨‍💼 Admin Features

### Admin Panel Access
- **Separate authentication** system for administrators
- **Dedicated admin login** at `/admin/login`
- **Role-based permissions** for different admin levels

### Admin Capabilities
- **Review photo submissions** with approve/reject functionality
- **Provide feedback** to students on submissions
- **Monitor system activity** and user engagement
- **Manage challenges** and educational content

### Default Admin Credentials
```
Username: admin
Password: admin123

Username: ecolearn_admin
Password: ecolearn2024
```

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL=your_postgresql_connection_string
USE_DATABASE=true

# Firebase (for authentication)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication with Email/Password
3. Add your domain to authorized domains
4. Update environment variables with your Firebase config

### Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Update environment variables
4. Configure upload presets for challenge photos

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Setup
- Ensure all environment variables are configured
- Set up production database
- Configure Firebase for production domain
- Set up Cloudinary for production uploads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Information

**Event**: Smart India Hackathon 2025  
**Category**: Environmental Education  
**Focus**: Gamified learning for sustainable development

## 📞 Support

For support and questions:  
- Create an issue in the repository  
- Contact the development team  
- Check the [SETUP.md](SETUP.md) file for detailed setup instructions

## 🙏 Acknowledgments

- Smart India Hackathon 2025 organizers  
- Open source community for the amazing tools and libraries  
- Environmental education experts for content guidance  
- Beta testers and early adopters

---
**Made with ❤️ for a sustainable future**
