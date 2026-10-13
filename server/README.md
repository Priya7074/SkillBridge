# SkillBridge Backend API Server

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Copy `.env` file
- Update `MONGODB_URI` with your MongoDB connection string
  - For local MongoDB: `mongodb://localhost:27017/skillbridge`
  - For MongoDB Atlas: `mongodb+srv://<username>:<password>@cluster.mongodb.net/skillbridge`

## Running the Server

```bash
npm start
```

The server will start on port 5000 (or the port specified in `.env`).

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

### Skills
- `GET /api/skills` - Get all skills (optional query: `?userId=<id>`)
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Internships
- `GET /api/internships` - Get all internships (optional filters: `?location=<loc>&workMode=<mode>&skill=<skill>`)
- `GET /api/internships/:id` - Get internship by ID
- `POST /api/internships` - Create new internship
- `PUT /api/internships/:id` - Update internship
- `DELETE /api/internships/:id` - Delete internship

### Applications
- `GET /api/applications` - Get all applications (optional query: `?studentId=<id>&internshipId=<id>`)
- `GET /api/applications/:id` - Get application by ID
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application

### Saved Internships
- `GET /api/saved-internships?studentId=<id>` - Get saved internships for a student
- `POST /api/saved-internships` - Save an internship
- `DELETE /api/saved-internships/:id` - Remove saved internship

## Project Structure

```
server/
├── config/
│   └── db.js           # MongoDB connection
├── controllers/
│   ├── userController.js
│   ├── skillController.js
│   ├── internshipController.js
│   ├── applicationController.js
│   └── savedInternshipController.js
├── models/
│   ├── User.js
│   ├── Skill.js
│   ├── Internship.js
│   ├── Application.js
│   └── SavedInternship.js
├── routes/
│   ├── userRoutes.js
│   ├── skillRoutes.js
│   ├── internshipRoutes.js
│   ├── applicationRoutes.js
│   └── savedInternshipRoutes.js
├── middleware/
│   └── errorHandler.js
├── .env                 # Environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js            # Main server file
```

## MongoDB Setup

### Local MongoDB
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Verify connection: `mongodb://localhost:27017`

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string from Atlas dashboard
4. Update `.env` with your connection string

## Features Implemented

- ✅ RESTful API design
- ✅ MongoDB models with proper schemas
- ✅ CORS enabled
- ✅ Error handling middleware
- ✅ Input validation
- ✅ Proper HTTP status codes
- ✅ Environment variable configuration
- ✅ Request logging
- ✅ Population of related documents
- ✅ Duplicate prevention (saved internships)
