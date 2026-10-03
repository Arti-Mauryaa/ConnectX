# ConnectX

A real-time chat application with one-to-one and group conversations, built with the MERN stack and Socket.IO.

**Live demo:** _add your Vercel link here_

## Features

- Sign up / log in with JWT authentication and hashed passwords
- One-to-one chats and group chats (create, rename, add or remove members, leave)
- Real-time messaging and typing indicator using Socket.IO
- Unread message notifications
- Search users by name or email
- Light and dark theme
- Responsive layout for desktop and mobile

## Tech stack

| Layer    | Technology                                   |
| -------- | -------------------------------------------- |
| Frontend | React, Vite, React Router, Axios, plain CSS  |
| Backend  | Node.js, Express, Socket.IO                  |
| Database | MongoDB with Mongoose                        |
| Auth     | JSON Web Tokens, bcryptjs                    |
| Hosting  | Vercel (frontend), Render (backend)          |

## Project structure

```
ConnectX/
├── backend/
│   ├── config/         database connection, token generation
│   ├── controllers/    user, chat and message logic
│   ├── middleware/     auth and error handling
│   ├── models/         Mongoose schemas
│   ├── routes/         REST API routes
│   └── server.js       Express app and Socket.IO events
└── frontend/
    └── src/
        ├── components/ chat list, conversation, modals, UI pieces
        ├── Context/    global chat and user state
        ├── Pages/      login and chat pages
        └── config.js   backend URL
```

## Run locally

You need Node.js 18+ and a MongoDB database (local or MongoDB Atlas).

**1. Backend**

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
PORT=5000
```

```bash
npm run server
```

**2. Frontend** (in a second terminal)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## API overview

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| POST   | `/api/user`             | Register                     |
| POST   | `/api/user/login`       | Log in                       |
| GET    | `/api/user?search=`     | Search users                 |
| POST   | `/api/chat`             | Open or create a 1:1 chat    |
| GET    | `/api/chat`             | List my chats                |
| POST   | `/api/chat/group`       | Create a group               |
| PUT    | `/api/chat/rename`      | Rename a group               |
| PUT    | `/api/chat/groupadd`    | Add a member                 |
| PUT    | `/api/chat/groupremove` | Remove a member              |
| GET    | `/api/message/:chatId`  | Get messages of a chat       |
| POST   | `/api/message`          | Send a message               |
