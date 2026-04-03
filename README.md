Classic Car Dealership Web Application
Project Description

This project is a fully functional server-side rendered web application built using Node.js, Express, EJS, and PostgreSQL. It simulates a professional classic car dealership website where users can browse vehicles, interact with content, and manage their own accounts, while employees and administrators manage operations through role-based dashboards.

The application demonstrates core backend development concepts including authentication, authorization, database relationships, MVC architecture, and multi-stage workflows.

Live Links\[Add Render Link Here\]

GitHub Repository: (https://github.com/elorajm/cse340finalproject)

Live Deployment (Render): (https://cse340finalproject.onrender.com/)

YouTube Walkthrough: https://youtu.be/fnWrlbsn5rc
Technology Stack

Backend: Node.js, Express.js

Frontend Rendering: EJS (server-side rendering)

Database: PostgreSQL

Authentication: express-session with bcrypt

Validation: express-validator

Architecture: MVC (Models, Views, Controllers)

Deployment: Render

User Roles
Standard User

Register, login, logout

View inventory and vehicle details

Submit service requests and track status

Leave, edit, and delete reviews

Save vehicles to wishlist

View personal dashboard (reviews, service requests, promotions, wishlist)

Employee

Access employee dashboard

Manage service requests (update status and add notes)

View and manage contact messages

Moderate reviews (delete inappropriate content)

Owner (Admin)

Full system access

All employee capabilities

Manage vehicles (add, edit, delete)

Manage categories

Manage users and roles

Send promotions and discounts to users

View system-wide analytics and activity

Features
Public (No Login Required)

Home page with hero banner and rotating featured vehicle

Featured vehicles section

About section and call-to-action links

Inventory page with filtering and sorting

Individual vehicle detail pages

Reviews page displaying all customer reviews

Contact form with messages saved to the database

Authenticated User Features
User Dashboard

View service request history and statuses

Manage personal reviews (edit and delete)

View promotions and offers (with unread indicator)

Manage wishlist of saved vehicles

Service Requests

Submit service requests (vehicle and description)

Track status: Submitted, In Progress, Completed or Cancelled

Wishlist

Save and remove vehicles

View saved vehicles in dashboard

Reviews

Submit reviews with rating and comment

Edit and delete own reviews

Employee Features

Employee dashboard with system stats

Manage all service requests

Update request status and add notes

View and update contact messages

Moderate all user reviews

Owner (Admin) Features

Owner dashboard with system statistics

Full user management (view and change roles)

Vehicle management (add, edit, delete)

Category management

Promotions system with discount codes and expiration dates

View customer wishlist activity

Full access to all employee features

Multi-Stage Workflow System

The application includes a complete service request workflow:

User submits a request

Status progresses from Submitted to In Progress to Completed or Cancelled

Employees manage and update requests

Users track progress through their dashboard

Security Features

Password hashing using bcrypt

Session-based authentication

Role-based authorization (user, employee, owner)

Input validation on all forms

SQL injection prevention using parameterized queries

Flash messages for user feedback

Database Schema

The database includes multiple related tables:

users

vehicles

categories

reviews

service_requests

contact_messages

promotions

wishlist

vehicle_images

Include your ERD image here (exported from pgAdmin).

Test Account Credentials

Use the following accounts to test different roles. All accounts use the same password:

Password: 1234Test

Owner: eloraathias@gmail.com     

Employee: elorajacobson@gmail.com     

User: eloramathias@gmail.com    

Known Limitations

Vehicle image handling is based on file naming conventions rather than uploads

No payment or checkout system is included

UI styling can be further refined for production-level polish

Final Notes

This project demonstrates a complete backend-driven web application with real-world functionality including authentication, workflows, role-based access, and dynamic content management. It reflects a strong understanding of backend development principles and scalable application design.