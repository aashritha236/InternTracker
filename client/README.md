# InternTracker

InternTracker is a full-stack web application that helps students track internship applications, monitor progress, and analyze their application performance through a clean dashboard.

It is designed not just as an application tracker, but as a simple decision-support tool for internship seekers.

---

## Live Demo

Frontend: [https://intern-tracker-rosy.vercel.app/]

Backend: [https://interntracker-backend-wm0l.onrender.com]

---

## Problem Statement

Students apply to multiple internships across different platforms, but usually track them manually in notes, spreadsheets, or chats. This makes it difficult to know:

- How many applications were submitted
- Which companies responded
- How many interviews were received
- Which applications were rejected
- Whether the application strategy is working

InternTracker solves this by bringing application tracking, profile management, and analytics into one simple web app.

---

## Features

### User Authentication
- Register and login functionality
- User-specific data separation
- Each user can view only their own applications and profile

### Internship Tracking
- Add internship applications
- Track company, role, platform, status, and notes
- Update application status
- Delete applications
- Search and filter applications

### Dashboard Analytics
- Total applications
- Applied count
- Interview count
- Rejected count
- Offer count
- Success rate
- Rejection rate
- Recent applications

### Visual Insights
- Pie chart for application status distribution
- Bar chart for status-wise application count
- Smart insights based on user application data

### Profile Management
- Store and update user details
- User-specific profile data saved in MongoDB

---
## Future Improvements

- Secure authentication using JWT and bcrypt
- Browser extension to quickly save internship opportunities directly from job platforms
- AI-based suggestions to improve application success rate
- Email reminders for follow-ups and deadlines
- Export application data as CSV or PDF

---
## Tech Stack

### Frontend
- React
- Vite
- CSS
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB Native Driver
- CORS
- dotenv

### Database
- MongoDB Atlas

### Deployment
- Frontend: Vercel
- Backend: Render

---

## Project Structure

```bash
interntracker/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── .env
│
├── server.js
├── package.json
├── .env
└── README.md
