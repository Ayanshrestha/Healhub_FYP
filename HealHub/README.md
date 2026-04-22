# HealHub: Digitizing Nepal's Health Ecosystem

**HealHub** is a modern, full-stack healthcare management platform designed to bridge the gap between patients and medical facilities in Nepal. Built with a focus on ease of use, security, and AI-driven insights, HealHub streamlines everything from medicine recognition to automated appointment management.

---

## Live Deployments

- **Frontend (Netlify)**: [https://healhub-frontend.netlify.app](https://healhub-frontend.netlify.app)
- **Backend API (Render)**: [https://healhub-fyp.onrender.com](https://healhub-fyp.onrender.com)

---

## Key Features

### 1. **Modular Authentication & RBAC**
- Secure portals for **Patients**, **Doctors**, **Clinics**, and **Admins**.
- Multi-step clinic verification logic to ensure facility legitimacy.
- Stateless session management using **JWT** and secure password hashing via **Bcrypt**.

### 2. **AI Medicine Scanner**
- **Computer Vision**: Utilizes `Tesseract.js` for text extraction from medicine labels.
- **Intelligent Database Matching**: Fuzzy search logic to identify medicines from a library of 200,000+ records.
- **Instant Insights**: Retrieves therapeutic applications, side effects, and dosage warnings dynamically.

### 3. **Smart Appointment Engine**
- **Real-time Scheduling**: Prevents double-bookings with live availability tracking.
- **Flexible Care**: Supports both **In-Clinic** and **Home Visits** with automated travel surcharge calculation.
- **Khalti Integration**: Instant digital payment processing for secure booking confirmation.

### 4. **Automated Patient Care**
- **Medication Reminders**: Custom schedules with automated email and browser alerts (integrated with **Brevo**).
- **Electronic History**: Secure archive of patient medication adherence and clinical interactions.
- **Real-time Messaging**: Instant, secure communication channel between patients and providers via `Socket.io`.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js (v19), Vite, Tailwind CSS, Lucide Icons, Framer Motion |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose) |
| **Real-time** | Socket.io |
| **OCR / AI** | Tesseract.js |
| **Integrations** | Khalti Payment API, Brevo Email API |
| **Storage** | Cloudinary, Multer (Multipart Data) |

---

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB account (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Ayanshrestha/Healhub_FYP.git
cd HealHub
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` folder and add your credentials:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
BREVO_API_KEY=your_key
KHALTI_SECRET_KEY=your_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```
- **Start the Server:**
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
```
- Create a `.env` file in the `Frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
- **Start the Application:**
```bash
npm run dev
```

---

## Project Structure

```text
HealHub/
├── backend/            # Express.js Server
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Mongoose Schemas
│   │   ├── routes/      # API Endpoints
│   │   ├── services/    # Business Logic
│   │   └── workers/     # Background Jobs (Cron)
├── Frontend/           # React.js Application
│   ├── src/
│   │   ├── features/    # Module-based components
│   │   ├── services/    # API & Utility functions
│   │   └── layouts/     # Reusable UI structures
```

---

## License
This project is part of the Final Year Project (FYP) for the BSc (Hons) Computing program.

---
*Developed for a healthier Nepal.*
