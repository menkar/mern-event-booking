# Swap Events Hub Client

A full-stack **MERN** event booking platform for discovering events, managing reservations, and administering bookings with role-based access for users and admins.

## Features

- User registration, login, and OTP-based account verification
- Browse and search events by category
- Secure event booking with OTP confirmation
- User dashboard for booking management
- Admin dashboard for events and booking confirmation
- Responsive UI built with React and Tailwind CSS

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React, Vite, Tailwind CSS, React Router, Axios |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Auth** | JWT, bcrypt, OTP email verification |

## Project Structure

```
mern-event-booking/
├── client/          # React frontend (Vite)
├── server/          # Express API & MongoDB models
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- MongoDB (local or Atlas)
- npm

### 1. Clone the repository

```bash
git clone <repository-url>
cd mern-event-booking
```

### 2. Backend setup

```bash
cd server
npm install
copy .env.example .env
```

Update `server/.env` with your own values (see `.env.example` for required variables). **Do not commit `.env` to version control.**

```bash
npm run seed    # optional: load sample data
npm run dev     # http://localhost:5000
```

### 3. Frontend setup

```bash
cd client
npm install
npm run dev     # http://localhost:5173
```

## Available Scripts

### Server (`/server`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with nodemon |
| `npm start` | Start API in production mode |
| `npm run seed` | Seed database with sample data |

### Client (`/client`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## API Overview

Base URL: `http://localhost:5000/api/v1`

| Route | Description |
|-------|-------------|
| `/auth` | Register, login, verify OTP |
| `/events` | Event listing and management |
| `/bookings` | Booking creation and management |

## Author

**Swapnil Menkar**  
Mob: 8149005578  
LinkedIn: [swapnil-menkar-7051852b](https://www.linkedin.com/in/swapnil-menkar-7051852b/)

## License

ISC
