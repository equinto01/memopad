# MemoPad - MERN Stack CRUD Application

A full-stack note-taking application built with the MERN stack (MongoDB, Express, React, Node.js) to demonstrate CRUD operations and modern web development practices.

## 🎯 Project Purpose

This project was created for **personal use** to explore and understand how the MERN stack works in practice. It demonstrates:
- Full CRUD (Create, Read, Update, Delete) operations
- Frontend and backend communication
- Database integration with MongoDB
- RESTful API design
- Modern React development practices

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Tailwind CSS, DaisyUI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Rate Limiting**: Upstash Redis

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Git

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd memopad
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

### 3. MongoDB Configuration

You have two options for MongoDB:

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new cluster (free tier is sufficient)
3. Click on "Connect" → "Connect your application"
4. Copy the connection string (it will look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
5. Replace `<username>` and `<password>` with your database user credentials
6. Add your database name to the connection string (replace `/` with `/memopad` or your desired database name)

#### Option B: Local MongoDB Installation

1. Install MongoDB Community Edition from [MongoDB Downloads](https://www.mongodb.com/try/download/community)
2. Start your MongoDB service:
   - **Windows**: MongoDB should start as a service automatically
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
3. Your connection string will be: `mongodb://localhost:27017/memopad`

### 4. Environment Variables Setup

Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env
```

Add the following environment variables to the `.env` file:

```env
# MongoDB Connection String
MONGO_URI=your_mongodb_connection_string_here

# Server Port (optional, defaults to 5001)
PORT=5001

# Upstash Redis for Rate Limiting (optional)
# Get these from https://upstash.com/
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Node Environment
NODE_ENV=development
```

**Important Notes:**
- Replace `your_mongodb_connection_string_here` with your actual MongoDB connection string from Step 3
- If using MongoDB Atlas, ensure your IP address is whitelisted in the Network Access section
- For Upstash Redis, sign up at [Upstash](https://upstash.com/) and create a Redis database to get the URL and token (optional but recommended for rate limiting)

### 5. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

### 6. Running the Application

#### Start the Backend Server

From the `backend` directory:

```bash
npm run dev
```

The backend server will run on `http://localhost:5001` (or the port specified in your `.env` file).

#### Start the Frontend Development Server

From the `frontend` directory (in a new terminal):

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`.

### 7. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001/api/notes

## 📁 Project Structure

```
memopad/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js          # MongoDB connection
│   │   │   └── upstash.js     # Redis rate limiting
│   │   ├── controllers/
│   │   │   └── notesController.js
│   │   ├── middleware/
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   └── Note.js        # Note schema
│   │   ├── routes/
│   │   │   └── notesRoutes.js
│   │   └── server.js
│   ├── .env                   # Environment variables (create this)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🔧 Configuration Files to Modify

### Backend Configuration

**File: `backend/src/config/db.js`**
- This file handles the MongoDB connection
- No changes needed if `MONGO_URI` is set in `.env`

**File: `backend/.env`** (Create this file)
- `MONGO_URI`: Your MongoDB connection string
- `PORT`: Server port (default: 5001)

### Frontend Configuration

**File: `frontend/src/lib/axios.js`**
- Already configured to use `http://localhost:5001/api` in development
- Automatically uses `/api` in production (no changes needed)

## 🗄️ Database Schema

The Note model uses the following schema:

```javascript
{
  title: String (required),
  content: String (required),
  createdAt: Date (automatically set),
  updatedAt: Date (automatically updated)
}
```

## 📝 API Endpoints

- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get a single note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## 🚨 Troubleshooting

### MongoDB Connection Issues

1. **"MongoServerError: Authentication failed"**
   - Check your username and password in the connection string
   - Ensure your MongoDB user has proper permissions

2. **"MongooseServerSelectionError"**
   - Verify your IP address is whitelisted in MongoDB Atlas (Network Access)
   - Check if MongoDB service is running (for local installations)
   - Verify the connection string is correct

3. **"Cannot connect to database"**
   - Ensure MongoDB Atlas cluster is running (click "Resume" if paused)
   - Check firewall settings
   - Verify network connectivity

### Port Already in Use

If you get a "port already in use" error:
- Change the `PORT` in `backend/.env`
- Or kill the process using that port

### Frontend Can't Connect to Backend

- Ensure the backend server is running
- Check that the port matches in `frontend/src/lib/axios.js`
- Verify CORS is properly configured (already set for `localhost:5173`)

## 🎨 Customization

### Changing the Database Name

In your MongoDB connection string, replace the database name:
```
mongodb+srv://user:pass@cluster.mongodb.net/YOUR_DB_NAME
```

### Changing the Port

Update `PORT` in `backend/.env` and ensure frontend axios config matches.

## 📚 Learning Resources

This project demonstrates:
- **MongoDB**: Document-based database operations
- **Express**: RESTful API creation
- **React**: Component-based UI development
- **Node.js**: Server-side JavaScript
- **CRUD Operations**: Full Create, Read, Update, Delete functionality

## 📄 License

This project is for personal learning purposes.

## 🤝 Contributing

This is a personal learning project. Feel free to fork and modify for your own learning!

---

**Happy Coding!** 🎉


