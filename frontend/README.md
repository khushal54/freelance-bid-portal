# CampusBid Frontend

## Overview

This is the frontend for **CampusBid**, a Freelance Bid Portal for Students built using React and Vite.

Currently, the basic frontend structure has been completed and integrated with the backend APIs.

## Features Implemented

* React + Vite setup
* React Router DOM routing
* User Registration page
* User Login page
* Home page with project listing
* Project Details page
* Post Project page
* Dashboard page
* Protected Routes
* Navbar Component
* Project Card Component
* Bid Card Component
* Axios API integration
* JWT Token handling using Local Storage

## Folder Structure

```txt
src
├── components
│   ├── Navbar.jsx
│   ├── ProjectCard.jsx
│   ├── BidCard.jsx
│   └── ProtectedRoute.jsx
│
├── pages
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── PostProject.jsx
│   ├── ProjectDetails.jsx
│   └── Dashboard.jsx
│
├── services
│   └── api.js
│
├── App.jsx
├── main.jsx
└── App.css
```

## Tech Stack

* React.js
* Vite
* React Router DOM
* Axios
* CSS

## Environment Variable

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

## Run Project

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## Current Status

Basic frontend implementation completed.

Backend integration and deployment are in progress.

## Author

Khushal Bhaskarni
