# CampusBid Backend

Backend API for CampusBid, a Freelance Bid Portal for Students built using Node.js, Express.js, MongoDB, and JWT Authentication.

## Features

- User registration and login
- JWT-based authentication
- Post freelance projects
- View all projects
- View single project with bids
- Place bids on projects
- Accept a bid
- User dashboard for posted projects and bids

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

## Folder Structure

```txt
backend/
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   ├── Project.js
│   └── Bid.js
├── routes/
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   ├── bidRoutes.js
│   └── dashboardRoutes.js
├── server.js
├── package.json
├── .gitignore
└── README.md