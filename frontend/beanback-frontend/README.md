# ArtWalls

## Running the Project

### Backend

```bash
cd backend
npm install
npm start
```

Runs on: `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on: `http://localhost:5173`

---

## Technologies Used

### Frontend

* React
* TypeScript
* Vite
* Fetch API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

---

## Known Issues / Incomplete Parts

* The artwork update feature is not fully implemented on the frontend yet.
* Separating **My Wall** from the **Community Wall** currently relies on comparing `user.id` with each artwork's `ownerId`. Due to the current authentication/user state implementation, `user.id` can occasionally be `null` or unavailable, which prevents reliable filtering. Given the project deadline, this part was left for future improvement.
* Error handling and UI feedback could be improved in several places.
* Styling has been prioritized over implementing a few remaining optional features.
