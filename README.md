# HealHub: Digitizing Nepal's Health Ecosystem

HealHub is a modern, full-stack healthcare management platform designed to bridge the gap between patients and medical facilities in Nepal. The system provides features such as medical AI recognition, appointment scheduling, data-driven medicine reminders, and a secure communication channel between patients and healthcare providers.

## Project Objective
The main objective of this project is to develop a comprehensive system that improves healthcare accessibility in Nepal by providing patients with easy access to specialists, accurate medicine information, and automated treatment adherence tools through an efficient digital interface.

## Features
The system provides the following features:
* Multi-protocol user registration (Patient, Doctor, Clinic, Admin)
* Secure login and Role-Based Access Control (RBAC)
* AI-Powered Medicine Scanner (OCR text extraction)
* Intelligent Database Matching for 200,000+ medicines
* Real-time Appointment Booking (Clinic and Home Visits)
* Secure Digital Payment integration (Khalti Gateway)
* Automated Medication Reminders (Email and Push notifications)
* Patient Dashboard for managing history and appointments
* Real-time Messaging service via Socket.io
* Secure logout and session management system

## Technologies Used

### Frontend
* HTML
* CSS (Tailwind CSS)
* JavaScript
* React.js (v19)

### Backend
* Node.js (Express.js)

### Database
* MongoDB (Mongoose)

### Deployment
* Frontend: Netlify
* Backend: Render

## System Requirements

### Hardware
* Computer or smartphone
* Internet connection

### Software
* Web browser such as Google Chrome or Firefox
* Node.js (v18 or higher for local development)

## Installation and Setup
Steps to run the project locally.

1. Clone the repository
```bash
git clone https://github.com/Ayanshrestha/Healhub_FYP.git
```
2. Go to the project folder
```bash
cd HealHub
```
3. Install required dependencies
For Backend:
```bash
cd backend
npm install
```
For Frontend:
```bash
cd ../Frontend
npm install
```
4. Run the application
Run Backend:
```bash
npm run dev
```
Run Frontend:
```bash
npm run dev
```

## Live Project
Live URL of the deployed system:
* Frontend: [https://healhub-frontend.netlify.app](https://healhub-frontend.netlify.app)
* Backend API: [https://healhub-fyp.onrender.com](https://healhub-fyp.onrender.com)

## Project Structure
```text
HealHub/
│
├── backend/            # Express.js Server & Logic
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
├── Frontend/           # React.js Application
│   ├── src/
│   │   ├── features/
│   │   ├── services/
│   │   └── components/
└── README.md
```

## Screenshots
*Add screenshots of the system here.*
* Login page
* Patient Dashboard
* AI Medicine Scanner Results
* Specialist Booking Flow

## Future Improvements
Possible improvements for the system:
* Dedicated mobile application version (React Native)
* Improved user interface with more interactive data visualizations
* Additional security features (Two-Factor Authentication)
* More advanced analytics for clinics to track patient recovery trends

## Authors
* **Ayan Shrestha** - [BIT] - Itahari International College

## License
This project is created for educational purposes as part of a Final Year Project.
