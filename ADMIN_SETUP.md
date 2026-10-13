# Admin Dashboard Setup Guide

## Overview
The SkillBridge Admin Dashboard provides secure role-based access control for managing students, internships, and applications.

## Security Features
- **Role-based access control**: Only users with `role: 'admin'` can access admin pages and APIs
- **Backend verification**: Role is verified on every admin-only endpoint from the JWT token
- **No frontend trust**: The backend never trusts role claims from the frontend
- **Separate admin routes**: Admin pages are under `/admin/*` and protected by `AdminRoute` component

## How to Create an Admin User

### Step 1: Register a New User
1. Open the SkillBridge application at `http://localhost:5173`
2. Click "Sign In" and then "Sign Up"
3. Register a new account with your desired admin credentials
4. The user will be created with `role: 'student'` by default

### Step 2: Promote the User to Admin
**Method 1: Using the promote-admin script (Recommended)**

```bash
cd server
npm run promote-admin <user-email>
```

Example:
```bash
npm run promote-admin admin@example.com
```

**Method 2: Manual database update**

```bash
cd server
node
```

Then in the Node REPL:
```javascript
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbridge');
const user = await User.findOne({ email: 'admin@example.com' });
user.role = 'admin';
await user.save();
console.log('User promoted to admin');
process.exit();
```

### Step 3: Login as Admin
1. Log out if you're currently logged in
2. Log in with the admin credentials
3. Navigate to `/admin/dashboard` to access the admin dashboard

## Admin Routes

### Frontend Routes (Protected by AdminRoute)
- `/admin/dashboard` - Admin Dashboard with statistics
- `/admin/students` - Student Management
- `/admin/internships` - Internship Management
- `/admin/applications` - Application Management

### Backend API Routes (Protected by admin middleware)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/students` - Get all students (with search, pagination)
- `GET /api/admin/students/:id` - Get student details
- `PUT /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Delete student
- `GET /api/admin/applications` - Get all applications (with status filter, pagination)
- `PUT /api/admin/applications/:id/status` - Update application status
- `GET /api/admin/applications/trends` - Get application trends

## Security Notes

### What Students Cannot Do
- Access admin pages (redirected to dashboard)
- Call admin APIs (403 Forbidden)
- View other students' applications
- Modify other students' data
- Delete internship listings

### What Admins Can Do
- View all student accounts
- Update student information
- Delete student accounts (except other admins)
- View all applications
- Update application status
- Create, edit, and delete internships
- View platform statistics

### Important Security Considerations
1. **Never hardcode admin credentials**: Always use the promote-admin script or manual database update
2. **Role is from database**: The role is stored in MongoDB and verified from JWT token on every request
3. **No frontend role manipulation**: Changing `role` in localStorage or React state has no effect on backend authorization
4. **Protected middleware**: All admin endpoints use the `admin` middleware from `server/middleware/auth.js`

## Testing the Admin Dashboard

### Test 1: Student Access Denied
1. Register a new user (student role by default)
2. Try to access `http://localhost:5173/admin/dashboard`
3. Expected: Redirected to `/dashboard`

### Test 2: Admin Access Granted
1. Promote a user to admin using the promote-admin script
2. Login as the admin user
3. Navigate to `/admin/dashboard`
4. Expected: Admin dashboard loads with statistics

### Test 3: Admin API Security
1. As a student, try to call `GET /api/admin/dashboard` with your token
2. Expected: 403 Forbidden response

### Test 4: Admin Functionality
1. As an admin, test each admin page:
   - Dashboard: Verify statistics load correctly
   - Student Management: Search, view, edit, delete students
   - Internship Management: Create, edit, delete internships
   - Application Management: View applications, update status

## Files Modified for Admin Dashboard

### Backend
- `server/models/User.js` - Added `role` field with enum ['student', 'admin']
- `server/middleware/auth.js` - Added `admin` middleware for role verification
- `server/controllers/adminController.js` - New controller for admin operations
- `server/routes/adminRoutes.js` - New routes for admin APIs
- `server/server.js` - Added admin routes
- `server/controllers/authController.js` - Include role in user responses
- `server/package.json` - Added promote-admin script
- `server/promote-admin.js` - New script to promote users to admin

### Frontend
- `src/context/AuthContext.jsx` - Added `isAdmin()` helper
- `src/components/AdminRoute.jsx` - New component to protect admin routes
- `src/components/Sidebar.jsx` - Added admin menu items (visible only to admins)
- `src/pages/admin/AdminDashboard.jsx` - Admin dashboard page
- `src/pages/admin/StudentManagement.jsx` - Student management page
- `src/pages/admin/InternshipManagement.jsx` - Internship management page
- `src/pages/admin/ApplicationsManagement.jsx` - Application management page
- `src/services/api.js` - Added adminAPI functions
- `src/App.jsx` - Added admin routes with AdminRoute protection
