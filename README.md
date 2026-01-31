# QOTD Backend - Question of the Day

A robust, deterministic backend system for a **Question of the Day (QOTD)** platform similar to LeetCode. All users see the same coding question each day, submit answers, and receive instant evaluation feedback.

**Live Server:**  ="https://techlearn-qotd-backend-azup.onrender.com"
GET QUESTION OF THE DAY="https://techlearn-qotd-backend-azup.onrender.com/api/qotd"
 

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Data Models](#data-models)
- [API Endpoints](#api-endpoints)
- [Setup & Installation](#setup--installation)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)
- [Best Practices & Design Decisions](#best-practices--design-decisions)

---

## 🚀 Features

✅ **Deterministic QOTD Selection** - Uses a global pointer instead of dates/randomness  
✅ **User Submissions & Evaluation** - Real-time answer evaluation with Correct/Incorrect feedback  
✅ **Persistent State Management** - Server restarts don't affect the active question  
✅ **MongoDB Integration** - Scalable data persistence with Mongoose ODM  
✅ **RESTful API Design** - Clean, well-documented endpoints  
✅ **Health Check Endpoint** - Easy monitoring and diagnostics  
✅ **Seed Data Support** - Pre-populate questions for development  

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js (v14+) |
| **Framework** | Express.js |
| **Database** | MongoDB |
| **ODM** | Mongoose |
| **Environment** | dotenv |
| **Package Manager** | npm |

---

## 🧠 System Architecture

### Why This Design?

Instead of using dates or random selection, this system uses a **global state pointer**:

```
┌─────────────────────────────────────────┐
│      QOTDState Collection                │
│  {                                       │
│    _id: "qotd_state",                   │
│    currentQuestionNumber: 1             │
│  }                                       │
└─────────────────────────────────────────┘
         ↓ Points to ↓
┌─────────────────────────────────────────┐
│    Question Collection                   │
│  Multiple questions with               │
│  questionNumber: 1, 2, 3, ...          │
└─────────────────────────────────────────┘
         ↑ All users see ↑
┌─────────────────────────────────────────┐
│      Submission Collection               │
│  Track all user submissions             │
└─────────────────────────────────────────┘
```

**Advantages:**
- ✅ Consistency across all users
- ✅ No accidental question changes
- ✅ Restart-safe (state persists in DB)
- ✅ Easy extensibility (admin API, cron jobs)
- ✅ Mirrors real-world production systems

---

## 📦 Data Models

### Question Model

Represents a coding problem.

```javascript
{
  _id: ObjectId,
  questionNumber: Number,          // Unique identifier (1, 2, 3, ...)
  title: String,                   // e.g., "Reverse a String"
  difficulty: String,              // "Easy", "Medium", "Hard"
  problemStatement: String,        // Problem description
  examples: [
    {
      input: String,
      output: String,
      explanation: String
    }
  ],
  constraints: [String],           // Problem constraints
  expectedOutput: String,          // Expected output for evaluation
  hints: [String],                 // Optional hints
  createdAt: Date,
  updatedAt: Date
}
```

**Example:**
```json
{
  "questionNumber": 1,
  "title": "Reverse a String",
  "difficulty": "Easy",
  "problemStatement": "Given a string, reverse it and return the result.",
  "examples": [
    {
      "input": "hello",
      "output": "olleh",
      "explanation": "The string is reversed character by character."
    }
  ],
  "constraints": [
    "String length: 1 to 1000",
    "Contains only ASCII characters"
  ],
  "expectedOutput": "olleh"
}
```

### QOTDState Model

Tracks the current question of the day globally.

```javascript
{
  _id: "qotd_state",               // Fixed identifier
  currentQuestionNumber: Number,   // Points to current question
  lastUpdatedAt: Date,
  updatedBy: String                // Admin who made the change
}
```

**Example:**
```json
{
  "_id": "qotd_state",
  "currentQuestionNumber": 1,
  "lastUpdatedAt": "2024-02-01T08:00:00Z",
  "updatedBy": "admin@techlearn.com"
}
```

### Submission Model

Records user submissions and evaluation results.

```javascript
{
  _id: ObjectId,
  userId: String,                  // User identifier
  questionNumber: Number,          // Which question was attempted
  submittedAnswer: String,         // User's solution
  result: String,                  // "Correct" or "Incorrect"
  timeTaken: Number,               // Time in seconds
  submittedAt: Date,               // When submitted
  language: String                 // (Optional) Programming language used
}
```

**Example:**
```json
{
  "userId": "student_1",
  "questionNumber": 1,
  "submittedAnswer": "olleh",
  "result": "Correct",
  "timeTaken": 45,
  "submittedAt": "2024-02-01T09:15:30Z"
}
```

---

## 🔗 API Endpoints

### 1️⃣ Health Check

**GET** `/`

Check if server is running.

**Response:**
```
QOTD Backend Running
```

---

### 2️⃣ Get Question of the Day

**GET** `/api/qotd`

Fetch the current question that all users should solve today.

**Response:** `200 OK`
```json
{
  "questionNumber": 1,
  "title": "Reverse a String",
  "difficulty": "Easy",
  "problemStatement": "Given a string, reverse it and return the result.",
  "examples": [
    {
      "input": "hello",
      "output": "olleh",
      "explanation": "Characters are reversed in order."
    }
  ],
  "constraints": [
    "Length: 1 to 1000",
    "ASCII characters only"
  ]
}
```

**Error Response:** `500 Internal Server Error`
```json
{
  "error": "Failed to fetch question"
}
```

---

### 3️⃣ Submit Answer

**POST** `/api/submit`

Submit an answer to the current question and get evaluation.

**Request Body:**
```json
{
  "userId": "student_1",
  "answer": "olleh",
  "timeTaken": 45
}
```

**Response:** `201 Created`
```json
{
  "submissionId": "507f1f77bcf86cd799439011",
  "userId": "student_1",
  "result": "Correct",
  "questionNumber": 1,
  "timeTaken": 45,
  "submittedAt": "2024-02-01T09:15:30Z"
}
```

**Error Response:** `400 Bad Request`
```json
{
  "error": "Missing required fields: userId, answer, timeTaken"
}
```

---

### 4️⃣ Get User Submissions (Optional)

**GET** `/api/submissions/:userId`

Fetch all submissions by a specific user.

**Response:** `200 OK`
```json
{
  "userId": "student_1",
  "submissions": [
    {
      "questionNumber": 1,
      "result": "Correct",
      "timeTaken": 45,
      "submittedAt": "2024-02-01T09:15:30Z"
    }
  ]
}
```

---

## ⚙️ Setup & Installation

### Prerequisites

- **Node.js** v14 or higher
- **MongoDB** (local or cloud)
- **npm** or **yarn**

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/qotd-backend.git
cd qotd-backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

Create a `.env` file in the project root:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/qotd_db
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/qotd_db?retryWrites=true&w=majority
```

### Step 4: Seed Initial Data

Populate the database with sample questions:

```bash
node src/seed/seedQuestion.js
```

**Output:**
```
✅ Database connected
✅ Sample questions inserted
✅ QOTDState initialized with currentQuestionNumber: 1
```

### Step 5: Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

**Expected Output:**
```
Server running on http://localhost:3000
Connected to MongoDB at mongodb://localhost:27017/qotd_db
```

### Step 6: Test the API

```bash
# Health check
curl http://localhost:3000/

# Fetch QOTD
curl http://localhost:3000/api/qotd

# Submit answer
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{"userId": "test_user", "answer": "olleh", "timeTaken": 30}'
```

---

## 📁 Project Structure

```
backend/
├── package.json               # Dependencies & scripts
├── server.js                  # Entry point
├── .env                       # Environment variables (git-ignored)
├── README.md                  # This file
│
├── src/
│   ├── app.js                 # Express app configuration
│   │
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   │
│   ├── models/
│   │   ├── Question.js        # Question schema
│   │   ├── QOTDState.js       # Global state schema
│   │   └── Submission.js      # Submission schema
│   │
│   ├── controllers/
│   │   ├── qotd.controller.js      # QOTD logic
│   │   └── submission.controller.js # Submission logic
│   │
│   ├── services/
│   │   └── evaluation.service.js   # Answer evaluation logic
│   │
│   ├── routes/
│   │   ├── qotd.routes.js          # QOTD endpoints
│   │   └── submission.routes.js    # Submission endpoints
│   │
│   └── seed/
│       └── seedQuestion.js    # Seed sample data
```

---

## 🔮 Future Improvements & Enhancements

With more time, I would implement:

### 🏆 High Priority

1. **Authentication & Authorization**
   - JWT-based user authentication
   - Role-based access control (user, admin, moderator)
   - User profiles and analytics

2. **Advanced Evaluation**
   - Sandboxed code execution (Docker/Kubernetes)
   - Support multiple programming languages (Python, Java, C++, JavaScript)
   - Test case validation against user code

3. **Leaderboard & Analytics**
   - Real-time leaderboard (by speed, accuracy, streak)
   - User statistics (questions solved, success rate, time trends)
   - Daily insights and performance dashboard

4. **Admin Controls**
   - Admin panel to create/edit questions
   - Manual QOTD rotation endpoints
   - Analytics and user management

### 📊 Medium Priority

5. **Cron Jobs & Automation**
   - Automatic daily question rotation
   - Scheduled maintenance tasks
   - Notification system for new questions

6. **Caching & Performance**
   - Redis caching for frequently accessed questions
   - Query optimization and indexing
   - Rate limiting to prevent abuse

7. **Testing**
   - Unit tests for services and controllers
   - Integration tests for API endpoints
   - End-to-end test suite

8. **Documentation**
   - Swagger/OpenAPI documentation
   - API request/response examples
   - Developer guidelines

 

9. **Social Features**
   - Discussion/comments on questions
   - User profiles and badges
   - Solution sharing and community voting

10. **DevOps & Deployment**
    - Docker containerization
    - CI/CD pipeline (GitHub Actions)
    - Automated deployment to cloud (Heroku, AWS, GCP)
    - Monitoring & logging (Winston, Sentry)

11. **Additional Features**
    - Difficulty filtering
    - Tag-based question categorization
    - Follow/favorite questions
    - Hints system with penalties

---

 
