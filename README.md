# ConnectX

A real-time chat application with one-to-one and group conversations, built with the MERN stack and Socket.IO.

**Live Demo:** https://connect-x-ruddy.vercel.app/

> Hosted on free plans, so the first load may take up to a minute.

## Features

* User registration and login with JWT authentication
* Password hashing using bcryptjs
* One-to-one and group chats
* Create, rename, add/remove members, and leave groups
* Real-time messaging and typing indicators using Socket.IO
* Unread message notifications
* Search users by name or email
* Light and dark theme
* Responsive design for desktop and mobile

## Tech Stack

| Layer          | Technology                            |
| -------------- | ------------------------------------- |
| Frontend       | React, Vite, React Router, Axios, CSS |
| Backend        | Node.js, Express.js, Socket.IO        |
| Database       | MongoDB, Mongoose                     |
| Authentication | JWT, bcryptjs                         |
| Deployment     | Vercel, Render                        |

## Project Structure

```text
ConnectX/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        ├── Context/
        ├── Pages/
        └── config/
```

## Environment Variables

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

For production:

```env
NODE_ENV=production
CLIENT_URL=https://connect-x-ruddy.vercel.app
```

> Never commit your `.env` file or expose your database credentials or JWT secret.

## Run Locally

### Backend

```bash
cd backend
npm install
npm run server
```

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Overview

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/api/user`             | Register user               |
| POST   | `/api/user/login`       | User login                  |
| GET    | `/api/user?search=`     | Search users                |
| POST   | `/api/chat`             | Create/open one-to-one chat |
| GET    | `/api/chat`             | Get user's chats            |
| POST   | `/api/chat/group`       | Create group chat           |
| PUT    | `/api/chat/rename`      | Rename group                |
| PUT    | `/api/chat/groupadd`    | Add group member            |
| PUT    | `/api/chat/groupremove` | Remove group member         |
| GET    | `/api/message/:chatId`  | Get chat messages           |
| POST   | `/api/message`          | Send message                |

## Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

## License

This project is licensed under the [MIT License](LICENSE).