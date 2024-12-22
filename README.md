# Webgeon - Attendance Management System

## Overview
Webgeon-Final is a full-stack application designed for efficient attendance management. It features user authentication, a user-friendly dashboard, and tools for tracking attendance. The project consists of a backend powered by Node.js and a frontend built with modern web technologies.

## Features

### Core Features
- **User Authentication**: Secure login and registration using username and password.
- **Attendance Management**:
  - Mark attendance for the current day ("Present" or "Absent").
  - View attendance history with detailed records.
- **Admin Panel (Optional)**:
  - View all users' attendance records.

### Additional Features
- Restrict marking attendance to the current day.
- Attendance statistics showing user participation over time.
- Notifications to remind users to mark their attendance.

## Project Structure

### Backend
The backend is implemented in Node.js and manages the API and data storage.
- **Files**:
  - `index.js`: Main entry point defining RESTful API endpoints.
  - `attendance.json`: Stores attendance records in JSON format.
  - `users.json`: Stores user information for authentication.
- **Endpoints**:
  - `POST /login`: Authenticate users.
  - `POST /attendance`: Mark attendance for the day.
  - `GET /attendance`: Retrieve attendance records for the logged-in user.
  - `GET /attendance/:id`: Retrieve attendance records for a specific user (admin).

### Frontend
The frontend provides a user-friendly interface for interaction.
- **Files and Directories**:
  - `public/`: Contains static assets like the main HTML file.
  - `src/`: Core React or JavaScript application files.
  - `package.json`: Lists dependencies and scripts for building/running the frontend.

## Installation and Setup

### Prerequisites
- Node.js and npm installed on your machine.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/username/webgeon.git
   cd webgeon
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. Run the application:
   - Start the backend:
     ```bash
     cd ../backend
     node index.js
     ```
   - Start the frontend:
     ```bash
     cd ../frontend
     npm start
     ```

5. Access the application at `http://localhost:3000` (default frontend port).

## Hosting
The application can be hosted on Render.


