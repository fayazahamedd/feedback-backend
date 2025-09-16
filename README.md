
---

## **Backend README (Node.js + Netlify Functions + MongoDB)**

```markdown
# Portfolio Feedback Backend

This is the **backend** of the Portfolio Feedback application, implemented using **Node.js, Mongoose, and Netlify Functions**.  
It provides API endpoints for CRUD operations on feedback data stored in MongoDB Atlas.

---

## 🔗 Live Demo
[Backend deployed on Netlify Functions](https://feedback-backend-node.netlify.app/.netlify/functions/feedback)

---

## 🛠 Technology Stack

- **Language:** JavaScript (ES6+)
- **Runtime:** Node.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Serverless Functions:** Netlify Functions
- **Local Development:** Express server
- **API Requests:** Axios (used by frontend)

---

## ⚙️ Features

- CRUD operations for feedback:
  - `GET` all feedback
  - `POST` new feedback
  - `PUT` update feedback by ID
  - `DELETE` remove feedback by ID
- Serverless deployment on Netlify
- Connects to MongoDB Atlas using environment variables
- Handles errors and returns proper HTTP status codes

---

## 🚀 Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/fayazahamedd/portfolio_feedback_mern.git
cd portfolio_feedback_mern/backend

2. Install dependencies
npm install

3. Configure environment variables

Create a .env file:

MONGODB_URI=mongodb+srv://<username>:<password>@feedback.l7fnqms.mongodb.net/?retryWrites=true&w=majority
PORT=5000

4. Start local development server
npm run dev


Server runs at: http://localhost:5000/api/feedback

📝 API Endpoints
Method	Endpoint	Description
GET	/api/feedback	Fetch all feedback
POST	/api/feedback	Add new feedback
PUT	/api/feedback/:id	Update feedback by ID
DELETE	/api/feedback/:id	Delete feedback by ID
📦 Deployment (Netlify Functions)

Functions folder: netlify/functions

Set MONGODB_URI in Netlify environment variables

Deploy backend functions via Netlify

Frontend should point to deployed function URL

💡 Best Practices

Use environment variables for database credentials

Prevent multiple connections to MongoDB in serverless environment

Validate incoming data using Mongoose schema

Handle errors gracefully with proper HTTP status codes

Avoid storing sensitive info directly in code

📂 Project Structure
backend/
├─ netlify/functions/
│  └─ feedback.js      # Serverless function for CRUD
├─ package.json
├─ .env                # MongoDB URI and config
└─ README.md
