VIETNOTE: FULL-STACK DECOUPLED APPLICATION
Author: Vo Cao Thanh Dat (Dave)

Timeline: 11/2025 – 12/2025

Live Demo: https://vietnote.vercel.app

Backend Repository: [Link to your Backend repo if separate]

Project Overview
Vietnote is a modern note-taking platform built on a decoupled architecture, separating the React frontend from the Laravel API. The project focuses on high performance, secure authentication flows, and the challenges of deploying multi-service systems in a cloud environment.

Technical Stack
Frontend

ReactJS, Vite

Styling: PrimeReact, Lucide, CSS Modules

State Management: React Hooks & Context API

Backend

Laravel 11 (RESTful API)

Authentication: Laravel Sanctum (Token-based)

Social Auth: OAuth 2.0 (Google & GitHub via Laravel Socialite)

Database & Infrastructure

Database: MySQL (Hosted on Aiven)

Deployment: Docker on Render (API), Vercel (Frontend)

Connectivity: Cross-Origin Resource Sharing (CORS) management between distributed services.

Engineering Highlights & Problem Solving
This project serves as a practical exploration of performance optimization and infrastructure management.

1. Performance & UI Optimization
Loading Optimization: Eliminated Flash of Unstyled Content (FOUC) during theme transitions by implementing a CSS preload blocking script.

API Concurrency: Utilized Promise.all to fetch multiple data sources simultaneously for the Admin Dashboard, reducing initial load time significantly.

Masonry Layout: Implemented dynamic grid systems for variable-height notes to ensure a smooth user experience.

2. Security & Modern Auth Flows
OAuth 2.0 Integration: Implemented secure login via Google and GitHub.

Multi-step OTP Flow: Developed a 3-step password reset process (Email verification -> OTP validation -> Password update) to improve security over traditional link-based resets.

Access Control: Custom Middleware implemented on the backend to enforce strict role-based access control (RBAC).

3. Infrastructure Challenges
Cloud Deployment Logs: Successfully navigated the complexities of containerizing a Laravel application with Docker and debugging deployment logs on Render.

Environment Discrepancies: Identified and documented SMTP port restrictions in the production environment (Render/Vercel) which affected the mailing system. Currently researching API-based mailing providers (SendGrid/Mailgun) as a resolution.

Future Roadmap
Backend Refactoring: Migrating the entire backend architecture to Java Spring Boot to leverage strong typing and enterprise-grade dependency injection.

Persistence Strategy: Implementing Google Cloud Storage (GCS) for file uploads to transition towards a fully stateless architecture, bypassing the limitations of ephemeral storage on PaaS providers.

VIETNOTE: ỨNG DỤNG FULL-STACK DECOUPLED
Tác giả: Võ Cao Thành Đạt (Dave)

Thời gian: 11/2025 – 12/2025

Live Demo: https://vietnote.vercel.app
