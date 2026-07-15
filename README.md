
Grand Horizon Hotel - Frontend
Welcome to the Grand Horizon Hotel frontend application – a modern, full-featured hotel management platform built with React and Tailwind CSS.

This application provides a seamless experience for guests, staff, and admins to manage hotel operations, from browsing and booking rooms to handling reservations and administrative oversight.


Project Repository: https://github.com/ShawnAjamala/Hotel_Frontend

Live Demo: https://hotel-frontend-dun.vercel.app/


Table of Contents
Features

Live Demo

Tech Stack

Project Structure

Getting Started

Responsive Design

Backend API

Contributing

License

Author

Features
Guest Features
Browse available rooms with images and details

Filter rooms by type (single, double, suite, family)

Search rooms by check-in and check-out dates

View real-time room availability

Browse restaurant tables and reserve by date and time

View conference rooms with capacity and features

Browse event venues filtered by event type

Book any service with integrated M-Pesa payment

View all bookings in one place

Cancel or delete completed bookings

Update profile and change password

Staff Features
Dashboard with resource overview

Add and manage rooms

Add and manage restaurant tables

Add and manage conference rooms

Add and manage event venues

View all bookings across all services

Filter bookings by type and status

Check guests in and out

Delete completed bookings

Admin Features
Full user management system

View all users with role filtering

Search users by name or email

Approve or reject staff registration requests

Revoke staff access when needed

View all bookings across all services

Delete completed bookings

Live Demo
Visit the live application: Grand Horizon Hotel

Tech Stack
Frontend
React 18.3.1 - UI library

Vite - Build tool and development server

Tailwind CSS 4.0 - Utility-first CSS framework

React Router DOM 6.28 - Client-side routing

Lucide React - Icon library

Axios - HTTP client for API requests

Backend
Django 4.x - Python web framework

Django REST Framework - API development

JWT Authentication - Secure user authentication

M-Pesa Integration - Payment processing

PostgreSQL - Production database

Deployment
Vercel - Frontend hosting

Render - Backend hosting

Installation
Clone the repository

bash
git clone https://github.com/ShawnAjamala/Hotel_Frontend.git
cd Hotel_Frontend
Install dependencies

bash
npm install
Environment Variables
Create a .env file in the root directory:

env
VITE_API_URL=https://your-backend-api-url.com
Running the App
Start the development server:

bash
npm run dev
The application will be available at http://localhost:5173

Building for Production
bash
npm run build
The build output will be in the dist directory.

Responsive Design
The application is fully responsive and works seamlessly across all devices:

Desktop: Full navigation with all links visible

Tablet: Collapsed navigation with hamburger menu

Mobile: Optimized layout with touch-friendly interactions

The responsive design ensures that guests, staff, and admins can access all features from any device.

Backend API
This frontend connects to a Django REST Framework backend. The API provides endpoints for:

User authentication and authorization

Room, table, conference, and venue management

Booking creation and management

M-Pesa payment processing

Staff approval workflows

User administration

The backend repository is available at: Hotel Backend

Contributing
Contributions are welcome! Please follow these steps:

Fork the repository

Create a feature branch

Make your changes

Submit a pull request

License
This project is licensed under the MIT License.

Author
Shawn Ajamala

Project Repository: https://github.com/ShawnAjamala/Hotel_Frontend

Live Demo: https://hotel-frontend-dun.vercel.app/

Acknowledgments
React and Vite communities for the excellent tools

Tailwind CSS for the utility-first CSS framework

All contributors and testers who helped improve this application

Built with  using React, Vite, and Tailwind CSS

