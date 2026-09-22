# RESQConnect — Emergency & Community Help Platform

> **Software Architecture & Design Document (SADD) derived project README**  
> Version: 1.0  
> Team: **INNOVEX**  
> Department of Computer Science and Engineering, IIIT Kottayam

**Team Members:** Shaik Shaheeq (Team Leader), Shaik Humair, Harshithan, ChandrakanthReddy, Arya Vardhan

> **Source note:** The uploaded SADD cover names the project **RESQConnnect**, while the body of the document consistently describes the system as **HelpBridge v1.0**. This README preserves both names rather than silently changing the source terminology.

---

## 1. Overview

RESQConnect / HelpBridge is a web-based platform designed to connect people who need assistance with nearby, verified help providers in a secure and efficient way.

The platform supports both **emergency SOS requests** and **non-emergency help requests**. It provides authentication, request management, manager-based emergency verification, nearby provider assignment, real-time communication, live location sharing, secure payments, notifications, dashboards, and administrative monitoring.

The architecture is designed around modularity, maintainability, scalability, security, performance, reliability, and extensibility.

## Final Runbook

### Start locally

1. Create `backend/.env` from the database settings required by your local PostgreSQL instance. Keep database, SMTP, JWT, and Razorpay secrets out of source control.
2. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to enable real checkout. The API starts without them, but payment creation returns a configuration error.
3. Start the API:

```powershell
cd backend
npm install
npm run dev
```

4. Start the web app in a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

### Verification commands

```powershell
cd backend
npm run test:smoke

cd ..\frontend
npm run lint
npm run build
```

### Completion checklist

- Completed seeker requests link directly to payment.
- Razorpay orders are created only for the owning seeker after completion and signatures are verified before marking payment successful.
- Seeker and provider coordinates are stored in PostgreSQL; provider coordinates update while active help is open.
- Managers see nearby verified providers ordered by calculated distance and can assign one request.
- Request locations open in Google Maps.
- Authentication and payment endpoints are rate-limited, API origins are restricted, and request/password inputs are validated.
- The API health smoke test, frontend lint, and production build are the final pre-demo checks.

### Core idea

```text
Help Seeker
    │
    ▼
Web Application
    │
    ├── Authentication
    ├── Request Management
    ├── Emergency Verification
    ├── Provider Management
    ├── Real-Time Chat
    ├── Location & Tracking
    ├── Payments
    └── Notifications
    │
    ▼
PostgreSQL + External Services
```

---

## 2. Purpose

The SADD defines the technical design used to translate system requirements into an implementable architecture. It covers:

- Overall software architecture
- Module decomposition and interaction
- Database design
- Interface design
- Object-oriented design
- Security mechanisms
- Error handling
- Deployment strategy
- Traceability between requirements and design
- Assumptions, constraints, and future enhancements

The document is intended for developers, architects, UI/UX designers, database engineers, testers, project guides, review committees, and future maintainers.

---

## 3. Scope

The current system provides:

- User registration and login
- Password reset
- JWT-based authentication
- Role-based authorization
- Help Seeker, Help Provider, Manager, and Admin roles
- Emergency SOS requests
- Non-emergency help requests
- Manager verification of emergency requests
- Nearby provider discovery and assignment
- Provider availability management
- Real-time chat
- Live location sharing and tracking
- Distance calculation
- Secure payment processing
- Payment history and receipts
- Push and email notifications
- User profile management
- Administrative monitoring and reports

### Current version does not include

- Native mobile applications
- Advanced analytics
- AI-based recommendations
- Cloud-native microservices

These are treated as future expansion areas.

---

## 4. Major Features

### Authentication & Account Management

- User registration
- User login/logout
- Forgot password
- Password reset
- JWT authentication
- Role-based authorization
- Secure password hashing using bcrypt
- Profile updates
- Verification document upload
- Location updates

### Emergency & Help Requests

Two request paths are supported:

**Emergency**

1. Help Seeker creates an SOS request.
2. Request enters manager verification.
3. Manager verifies authenticity.
4. Manager approves, rejects, or escalates the request.
5. Approved request is assigned to a suitable nearby provider.
6. Provider accepts or rejects it.
7. Assistance, tracking, communication, completion, and payment follow.

**Non-Emergency**

- Request creation
- Request editing
- Request cancellation
- Provider selection
- Tracking
- Request history

### Provider Management

- View nearby requests
- Accept or reject requests
- Update availability
- Share location
- Complete assistance
- View service history
- Manage provider service/skill information

### Communication

- Real-time one-to-one chat
- Message storage
- Message timestamps
- Optional attachments
- Chat notifications

### Location & Tracking

- Current location sharing
- Nearby request discovery
- Provider tracking
- Distance calculation
- Navigation support
- Live provider location during active assistance

### Payments

- Payment initiation
- Payment verification
- Payment history
- Payment status
- Payment receipt generation
- Refund processing planned for a future version

### Notifications

- SOS alerts
- Request status updates
- Chat notifications
- Payment notifications
- Email notifications
- Push notifications

### Administration

- Manage users
- Manage managers
- Manage help providers
- Manage service categories
- Monitor requests
- View reports
- View analytics
- Manage system settings
- Handle administrative operations and complaints

---

## 5. User Roles

| Role              | Main Responsibilities                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Help Seeker**   | Create requests, track requests, share location, communicate with provider, make payments, rate/review provider      |
| **Help Provider** | View suitable requests, accept/reject requests, update availability, share location, communicate, provide assistance |
| **Manager**       | Verify emergency requests, approve/reject requests, assign suitable nearby providers, monitor active requests        |
| **Admin**         | Manage users/providers, service categories, reports, monitoring, system settings, and administrative operations      |

---

## 6. Architecture

### Architectural Style

The system follows a **Three-Tier MVC (Model-View-Controller) architecture with RESTful APIs**.

The architectural goals are:

1. **Scalability** — support more users, requests, and real-time chat sessions.
2. **Maintainability** — keep major features modular and independently maintainable.
3. **Security** — integrate authentication, authorization, password protection, secure communication, and secure payment processing.
4. **Performance** — use REST APIs, efficient database access, Socket.IO, and optimized frontend rendering.
5. **Reliability** — maintain reliable request processing, communication, and data storage.
6. **Extensibility** — support future mobile apps, analytics, AI services, and cloud expansion.

### High-Level Architecture

```text
+----------------------+
|     Web Browser      |
+----------+-----------+
           |
           v
+----------------------+
| Next.js / React UI   |
+----------+-----------+
           |
       REST / Socket.IO
           |
           v
+----------------------------------------+
|          Express.js Backend            |
|----------------------------------------|
| Authentication | Request Management    |
| Emergency Verification                 |
| Provider Management | Chat             |
| Location & Tracking | Payments         |
| Notifications | Admin                 |
+------------------+---------------------+
                   |
                   v
            +-------------+
            | PostgreSQL  |
            +-------------+
```

External services are integrated independently so that individual services can be replaced or upgraded without major changes to the core system.

---

## 7. Design Principles

The architecture follows these principles:

### Modularity

Each major feature is implemented as an independent module.

### High Cohesion

Each module has one clearly defined responsibility.

### Low Coupling

Modules communicate through REST APIs and service interfaces instead of directly accessing one another.

### Reusability

Shared utilities such as validation, authentication middleware, models, and API services can be reused.

### Separation of Concerns

Presentation, business logic, and data access responsibilities remain separated.

### Security by Design

Authentication, authorization, validation, encryption, and secure communication are considered from the beginning.

### Extensibility

New features such as AI recommendations and mobile support can be introduced without major architectural changes.

---

## 8. Technology Stack

| Layer                   | Technology                        | Role                                               |
| ----------------------- | --------------------------------- | -------------------------------------------------- |
| Frontend                | Next.js                           | React-based web UI and server-side rendering       |
| UI                      | React                             | Component-based reusable interface                 |
| Styling                 | Tailwind CSS                      | Responsive UI development                          |
| Backend Runtime         | Node.js                           | JavaScript runtime                                 |
| Server Framework        | Express.js                        | REST API and backend services                      |
| Database                | PostgreSQL                        | Relational storage and ACID-compliant transactions |
| ORM                     | Prisma ORM (or Sequelize/TypeORM) | Database access, migrations, and type-safe queries |
| Authentication          | JWT + bcrypt                      | Authentication and password security               |
| Real-Time               | Socket.IO / WebSocket             | Chat and instant notifications                     |
| Payments                | Razorpay                          | Secure payment processing                          |
| Cloud Storage           | Cloudinary                        | Images, documents, and uploaded files              |
| Notifications           | Firebase Cloud Messaging          | Push notifications                                 |
| Validation              | Zod                               | Schema-based input validation                      |
| API Testing             | Postman                           | REST API testing                                   |
| Version Control         | Git & GitHub                      | Source control and collaboration                   |
| Frontend Deployment     | Vercel                            | Frontend hosting                                   |
| Backend / DB Deployment | Render / Railway                  | Backend and PostgreSQL hosting                     |

The SADD also mentions **Google Maps API**, **SMTP/Nodemailer**, and **Neon/PostgreSQL hosting** as possible supporting services.

---

## 9. External Integrations

| Service                            | Purpose                                                                           |
| ---------------------------------- | --------------------------------------------------------------------------------- |
| **PostgreSQL**                     | Users, help requests, payments, chat history, notifications, and application data |
| **Razorpay**                       | Online payment processing                                                         |
| **Firebase Cloud Messaging (FCM)** | Push notifications                                                                |
| **Cloudinary**                     | Profile images, identity documents, and request-related uploads                   |
| **Google Maps API**                | Maps, nearby locations, distance calculation, navigation support                  |
| **SMTP / Nodemailer**              | Email verification and password-reset communication                               |

---

## 10. System Data Flow

The high-level flow is:

1. User opens the application in a browser.
2. User registers or logs in.
3. Frontend communicates with the backend through REST APIs.
4. Backend validates input and executes business logic.
5. PostgreSQL stores and retrieves application data.
6. A new help request triggers notifications to relevant nearby providers.
7. Providers can accept requests and communicate with the requester through Socket.IO.
8. Users can share live locations when necessary.
9. Completed services can be paid for through Razorpay.
10. Database state is updated and confirmation notifications are sent.

---

## 11. Module Architecture

### 11.1 Authentication Module

**Responsibilities**

- Registration
- Login
- Logout
- Password reset
- JWT generation and verification
- Role-based authorization

**Key classes**

- `AuthController`
- `AuthService`
- `AuthRepository`
- `AuthenticationService`
- `PasswordReset`

### 11.2 User Management Module

**Responsibilities**

- Profile management
- Profile updates
- Document upload
- User information management

**Key classes**

- `UserController`
- `UserService`
- `UserRepository`
- `ProfileManager`

### 11.3 SOS / Request Management Module

**Responsibilities**

- Create emergency requests
- Create non-emergency requests
- Update requests
- Cancel requests
- Track request status
- Maintain request history

**Key classes**

- `SOSController`
- `SOSService`
- `SOSRepository`
- `SOSRequest`

### 11.4 Emergency Verification Module

**Responsibilities**

- Review emergency SOS requests
- Verify authenticity
- Approve or reject requests
- Escalate critical emergencies
- Maintain verification logs
- Forward approved requests to nearby providers

**Key classes**

- `VerificationController`
- `VerificationService`
- `Manager`

### 11.5 Provider Management Module

**Responsibilities**

- View nearby requests
- Accept/reject requests
- Update availability
- Complete service
- View service history
- Manage skills/services

**Key classes**

- `ProviderController`
- `ProviderService`
- `HelpProvider`
- `ProviderService`

### 11.6 Real-Time Communication Module

**Responsibilities**

- Real-time messaging
- Message storage
- Message retrieval
- Optional attachments
- Chat notifications

**Key classes**

- `ChatController`
- `ChatService`
- `Chat`
- `Message`
- `Attachment`

### 11.7 Location & Tracking Module

**Responsibilities**

- Obtain current location
- Share GPS coordinates
- Calculate distance
- Find nearby providers
- Track provider location
- Support navigation

**Key classes**

- `LocationService`
- `Tracking`

### 11.8 Payment Module

**Responsibilities**

- Initiate payment
- Verify payment
- Store transaction information
- Maintain payment history
- Generate receipts
- Support future refund processing

**Key class**

- `PaymentController`
- `Payment`

### 11.9 Notification Module

**Responsibilities**

- SOS alerts
- Request status updates
- Chat notifications
- Payment notifications
- Email alerts
- Push notifications

**Key class**

- `NotificationService`
- `Notification`

### 11.10 Admin Module

**Responsibilities**

- User management
- Manager/provider management
- Reports
- Monitoring
- Analytics
- Service categories
- System settings

**Key class**

- `AdminController`
- `Admin`

---

## 12. Package Structure

The system is conceptually organized into packages:

```text
HelpBridge
├── Auth
│   └── Provider
├── User
│   └── Chat
├── SOS
│   └── Payment
├── Manager
│   └── Notification
├── Location
├── Data Access
└── PostgreSQL
```

The package organization separates business responsibilities and improves independent development, testing, and maintenance.

---

## 13. Object-Oriented Design

The system applies:

- **Abstraction**
- **Encapsulation**
- **Inheritance**
- **Polymorphism**

### Core Classes

- `User`
- `HelpSeeker`
- `HelpProvider`
- `Manager`
- `Admin`
- `AuthenticationService`
- `PasswordReset`
- `ProfileManager`
- `SOSRequest`
- `LocationService`
- `ProviderService`
- `ServiceCategory`
- `Chat`
- `Message`
- `Attachment`
- `Tracking`
- `Payment`
- `Notification`
- `RatingReview`

### Central Business Entity

`SOSRequest` is the central entity connecting:

```text
Help Seeker
     │
     ▼
 SOS Request
  │       │
  ▼       ▼
Manager  Provider
  │       │
  └──┬────┘
     ▼
 Chat / Tracking / Notification
     │
     ▼
 Payment / Rating & Review
```

---

## 14. Database Design

The system uses **PostgreSQL** as its relational database.

PostgreSQL was selected for:

- ACID-compliant transactions
- Strong data integrity
- Relational modeling
- Efficient SQL querying
- Relationships through primary and foreign keys
- Reliable transaction management

### Core Entities

#### User

Stores:

- User ID
- Name
- Email
- Phone
- Password
- Occupation
- Blood group
- Location
- Role
- Availability
- Verification information

Supported roles:

- Help Seeker
- Provider
- Manager
- Admin

#### SOS_Request

Stores:

- Request ID
- Help Seeker ID
- Provider ID
- Manager ID
- Request type
- Emergency category
- Description
- Location
- Status

Request types:

- Emergency
- Non-Emergency

Example statuses:

- Pending
- Approved
- Assigned
- Completed

#### Chat

Stores:

- Chat ID
- Request ID
- Sender ID
- Receiver ID
- Message
- Timestamp

#### Payment

Stores:

- Payment ID
- Request ID
- Amount
- Payment method
- Payment status

Payment methods include:

- UPI
- Card
- Net Banking

Payment states include:

- Pending
- Success
- Failed

#### Notification

Stores:

- Notification ID
- User ID
- Title
- Message
- Read/Unread status

### Foreign-Key Relationships

```text
SOS_Request.user_id      → User.user_id
SOS_Request.provider_id  → User.user_id
SOS_Request.manager_id   → User.user_id

Chat.request_id          → SOS_Request.request_id
Chat.sender_id           → User.user_id
Chat.receiver_id         → User.user_id

Payment.request_id       → SOS_Request.request_id

Notification.user_id    → User.user_id
```

### Validation / Constraints

- Email addresses must be unique.
- Passwords must be stored securely.
- User roles must use the permitted role values.
- Request type must be Emergency or Non-Emergency.
- Payment amount must be greater than zero.
- Payment status must be Pending, Success, or Failed.
- Notification status must be Read or Unread.

---

## 15. Interface Design

### Main Screens

1. Landing / Home
2. Login
3. Registration
4. User Dashboard
5. SOS Request
6. Manager Verification Dashboard
7. Provider Dashboard
8. Chat
9. Payment
10. Notifications
11. Profile Management
12. Admin Dashboard

### Communication Interfaces

| Protocol              | Purpose                            |
| --------------------- | ---------------------------------- |
| HTTP                  | Web communication                  |
| HTTPS                 | Secure client-server communication |
| REST API              | Frontend/backend data exchange     |
| JSON                  | Request/response data format       |
| TCP/IP                | Network communication              |
| WebSocket / Socket.IO | Real-time chat and notifications   |
| SMTP                  | Email delivery                     |

### UI Principles

- Consistent layouts, colors, typography, and icons
- Simple navigation
- Clear labels and validation messages
- High-contrast and readable design
- Keyboard and screen-reader support where applicable
- Responsive desktop/tablet/mobile layouts
- Masked password fields
- Role-aware access to sensitive information

---

## 16. Security Design

Security is built into the architecture because the platform handles identity, emergency requests, location, communication, and payments.

### Security Requirements

- Authentication
- Role-based authorization
- Confidentiality
- Integrity
- Availability
- Privacy
- Secure HTTPS communication
- Account recovery protection
- Secure payment processing
- Manager verification of emergency requests

### Authentication Flow

```text
Registration
   ↓
Input Validation
   ↓
Password Hashing
   ↓
Account Storage
   ↓
Login
   ↓
Credential Verification
   ↓
JWT / Authenticated Session
   ↓
Role-specific Dashboard
```

### Security Controls

- bcrypt password hashing
- JWT authentication
- Role-based access control
- HTTPS/TLS
- Environment variables for secrets
- Database authentication
- Least-privilege database access
- Foreign-key constraints
- Backend validation even when frontend validation exists
- Parameterized queries / ORM protection against SQL injection
- Sanitization against malicious input
- Restricted access to location and payment data

### Sensitive Data

Access to the following should be restricted to authorized users/services:

- Passwords
- Personal information
- Location information
- Payment transaction information
- Chat messages

Card information should not be stored directly in the application database; only necessary transaction information such as transaction ID, amount, and payment status should be retained.

---

## 17. Validation

The system validates and sanitizes user-controlled data on the backend.

Validation includes:

- Email format
- Phone format and length
- Password strength requirements
- Allowed user roles
- Emergency / Non-Emergency request types
- Emergency categories
- Latitude and longitude ranges
- Positive payment amounts
- File type and file size
- Description length
- Chat content
- Database IDs
- Malformed or unexpected API requests

---

## 18. Error Handling

The error-handling strategy covers frontend, backend, database, and third-party service failures.

### Main Principles

- Validate before processing.
- Use centralized backend exception handling.
- Return user-friendly error messages.
- Never expose credentials, SQL queries, server paths, or internal implementation details.
- Record important operational errors in logs.
- Never log passwords, tokens, or payment credentials.
- Use database transactions for multi-step operations.
- Retry recoverable external-service failures.
- Preserve SOS request state during failures.
- Allow retrying failed payments.
- Notify managers when emergency processing cannot continue automatically.

### HTTP Responses

| Code  | Meaning               |
| ----- | --------------------- |
| `400` | Bad Request           |
| `401` | Unauthorized          |
| `403` | Forbidden             |
| `404` | Not Found             |
| `409` | Conflict              |
| `422` | Validation Error      |
| `500` | Internal Server Error |
| `503` | Service Unavailable   |

Emergency-related failures receive high priority; if a provider cannot be assigned immediately, the request should remain in an appropriate pending state and the manager should be notified.

---

## 19. Request Lifecycle

### Emergency Request

```text
Created
  ↓
Manager Verification
  ├── Rejected
  ├── Escalated
  └── Approved
         ↓
   Provider Selection
         ↓
      Assigned
         ↓
    Provider Accepts
         ↓
 Assistance / Tracking
         ↓
      Completed
         ↓
       Payment
         ↓
   Rating & Review
```

### Non-Emergency Request

```text
Created
  ↓
Provider Discovery
  ↓
Assignment / Acceptance
  ↓
Assistance
  ↓
Completion
  ↓
Payment
  ↓
Rating & Review
```

The state design also supports cancellation and rejection paths.

---

## 20. Traceability

The SADD maps requirements to implementation modules, classes, sequence diagrams, and test cases.

### Requirement Coverage Summary

| ID Range    | Example Requirement                                     | Primary Design Area              |
| ----------- | ------------------------------------------------------- | -------------------------------- |
| FR-01–FR-05 | Registration, login, password reset, profile management | Authentication & User Management |
| FR-06–FR-07 | Emergency and non-emergency requests                    | SOS / Request Management         |
| FR-08       | Share current location                                  | Location & Tracking              |
| FR-09–FR-10 | Manager verification and approval/rejection             | Emergency Verification           |
| FR-11–FR-12 | Find and assign nearest suitable provider               | Provider Assignment / Location   |
| FR-13–FR-14 | Provider response and availability                      | Provider Management              |
| FR-15       | Live location tracking                                  | Location & Tracking              |
| FR-16       | Chat                                                    | Chat Module                      |
| FR-17       | Notifications                                           | Notification Module              |
| FR-18       | Complete help request                                   | SOS / Request Management         |
| FR-19–FR-20 | Payment and payment status                              | Payment Module                   |
| FR-21       | Rate and review provider                                | Rating & Review                  |
| FR-22–FR-23 | Admin user/category management                          | Administration                   |
| FR-24       | View request status                                     | SOS / Request Management         |

The document associates these requirements with sequence diagrams and test cases such as `TC-01` through `TC-24`.

---

## 21. Development, Testing & Deployment

The deployment model uses three stages:

### Development

Developers can run:

- Next.js / React frontend
- Node.js + Express backend
- PostgreSQL database

Development tools include:

- Visual Studio Code
- Git
- GitHub
- Postman
- `.env` environment configuration

### Testing

Testing areas include:

- Functional testing
- API testing
- Database testing
- Authentication and authorization
- SOS request processing
- Manager verification
- Provider assignment
- Payment processing
- Chat and notifications
- Responsive UI

### Production

The production architecture separates:

```text
Frontend
   ↓
Backend / API
   ↓
PostgreSQL
   ↓
External Services
```

The SADD identifies Vercel as a frontend deployment option and Render/Railway as backend/PostgreSQL deployment options. Neon is also identified as a possible PostgreSQL hosting option.

---

## 22. Installation / Setup Requirements

The SADD specifies the following setup process:

1. Install Node.js and npm.
2. Install PostgreSQL.
3. Create the HelpBridge database.
4. Install Git.
5. Clone the project repository.
6. Install frontend dependencies.
7. Install backend dependencies.
8. Configure `.env` environment variables.
9. Configure PostgreSQL connection details.
10. Configure JWT secrets.
11. Configure external API keys such as Maps and payment services.
12. Start the backend server.
13. Start the frontend development server.
14. Verify the database connection.
15. Test authentication, SOS requests, provider assignment, chat, notifications, and payments.

### Required software

| Category        | Requirement             |
| --------------- | ----------------------- |
| OS              | Windows / Linux         |
| Frontend        | Next.js / React         |
| Backend         | Node.js + Express.js    |
| Language        | JavaScript / TypeScript |
| Database        | PostgreSQL              |
| Authentication  | JWT                     |
| Real-Time       | WebSocket / Socket.IO   |
| API             | REST API                |
| API Testing     | Postman                 |
| Version Control | Git / GitHub            |
| IDE             | Visual Studio Code      |
| Browser         | Chrome / Edge / Firefox |

> The SADD does not provide exact repository URLs, environment-variable names, database migration commands, or project-specific start scripts. Those should be added from the implementation repository rather than invented here.

---

## 23. Hardware Requirements

### Client / User Device

| Requirement | Minimum                             |
| ----------- | ----------------------------------- |
| Processor   | Dual-Core                           |
| RAM         | 2 GB or above                       |
| Storage     | 1 GB free                           |
| Display     | 1280 × 720 or above                 |
| Network     | Stable Internet                     |
| Location    | GPS-enabled device where applicable |

### Server

| Requirement | Minimum                            |
| ----------- | ---------------------------------- |
| CPU         | 2 vCPUs                            |
| RAM         | 4 GB                               |
| Storage     | 20 GB SSD                          |
| Network     | Stable high-speed Internet         |
| Backup      | Additional database backup storage |

Server capacity can be increased based on traffic and database requirements.

---

## 24. Project Structure — Conceptual

A suitable conceptual organization derived from the module architecture is:

```text
project/
├── frontend/
│   ├── authentication
│   ├── user
│   ├── dashboards
│   ├── sos
│   ├── provider
│   ├── chat
│   ├── payments
│   ├── notifications
│   └── admin
│
├── backend/
│   ├── authentication
│   ├── users
│   ├── sos
│   ├── verification
│   ├── providers
│   ├── chat
│   ├── location
│   ├── payments
│   ├── notifications
│   └── admin
│
├── data-access/
├── database/
└── configuration/
```

This is a **conceptual mapping from the SADD**, not a claim about the repository's exact folder names.

---

## 25. Architectural Trade-offs

The modular design introduces slightly more communication overhead than a single monolithic implementation.

The document accepts this trade-off because modularization provides:

- Easier maintenance
- Better scalability
- Better testing
- Independent module updates
- Clearer separation of responsibilities
- Easier future extension

---

## 26. Assumptions

The design assumes:

1. Users have valid mobile numbers and email addresses.
2. Users provide accurate personal information.
3. Help Seekers provide accurate request details.
4. Providers provide genuine skills, availability, and location information.
5. Managers are authorized to verify emergency requests.
6. Managers verify emergency authenticity before provider assignment.
7. Device location services can provide usable GPS/location data.
8. Providers keep availability and location updated.
9. Users have a stable Internet connection for real-time functionality.
10. A supported secure payment gateway is available.
11. Maps, email, notifications, and payment services are available when needed.
12. PostgreSQL is correctly configured and accessible.
13. Users follow platform rules and do not misuse SOS functionality.

---

## 27. Constraints & Limitations

The initial version is affected by:

- Dependence on Internet connectivity
- GPS accuracy limitations
- Third-party API availability
- Payment gateway limitations
- Location privacy requirements
- Manual emergency verification delays
- Provider availability limitations
- Network delays affecting chat, notifications, tracking, and updates
- Available server/database/network resources
- Security requirements for sensitive information
- Scalability limits at very high simultaneous usage
- Web-first scope without native mobile applications

---

## 28. Future Enhancements

The SADD identifies the following future directions:

1. **Android and iOS mobile applications**
2. **AI-based provider matching** using distance, occupation, availability, experience, and request priority
3. **AI + IoT emergency detection** for automatic accident/emergency identification
4. **Voice-based SOS**
5. **Advanced live tracking** with improved accuracy and estimated arrival time
6. **Multi-language support**
7. **Advanced analytics dashboards**
8. **Automated / AI-assisted emergency verification**
9. **Enhanced provider verification and background checks**
10. **Integration with hospitals, ambulance services, police, fire departments, and other authorized emergency organizations**

---

## 29. References / Design Standards

The architecture document references:

- Software Requirements Specification (SRS) for HelpBridge v1.1
- IEEE 1016 — Software Design Description
- IEEE 29148 — Systems and Software Requirements Specification
- OpenAPI Specification 3.1
- HTML Living Standard (WHATWG)
- CSS Specifications (W3C)
- ECMAScript Language Specification
- React Documentation
- Node.js Documentation
- Express.js Documentation
- PostgreSQL Documentation
- Socket.IO Documentation
- Firebase Documentation
- Razorpay API Documentation
- Cloudinary Documentation

---

## 30. Project Snapshot

| Area                | Design                                        |
| ------------------- | --------------------------------------------- |
| Project             | RESQConnect / HelpBridge                      |
| Version             | 1.0                                           |
| Type                | Web-based emergency & community help platform |
| Architecture        | Three-Tier MVC + REST                         |
| Frontend            | Next.js + React + Tailwind CSS                |
| Backend             | Node.js + Express.js                          |
| Database            | PostgreSQL                                    |
| Authentication      | JWT + bcrypt                                  |
| Real-Time           | Socket.IO / WebSocket                         |
| Payments            | Razorpay                                      |
| Notifications       | Firebase Cloud Messaging                      |
| Maps / Location     | Google Maps API                               |
| File Storage        | Cloudinary                                    |
| Email               | SMTP / Nodemailer                             |
| Validation          | Zod                                           |
| API Testing         | Postman                                       |
| Version Control     | Git / GitHub                                  |
| Frontend Deployment | Vercel                                        |
| Backend Deployment  | Render / Railway                              |
| Primary Roles       | Help Seeker, Provider, Manager, Admin         |

---

## 31. Team

**Team INNOVEX**

- Shaik Shaheeq — Team Leader
- Shaik Humair
- Harshithan
- ChandrakanthReddy
- Arya Vardhan

**Department of Computer Science and Engineering**  
**IIIT Kottayam**

---

## 32. Conclusion

RESQConnect / HelpBridge is designed as a secure, modular, role-aware web platform for connecting people in need with nearby verified assistance providers.

Its architecture separates presentation, business logic, data access, and external integrations. The design supports emergency verification, provider assignment, real-time communication, location tracking, payment processing, notifications, administrative monitoring, and future expansion into mobile, AI, analytics, and broader emergency-service integrations.

The current architecture intentionally favors **modularity, maintainability, security, and extensibility**, providing a foundation that can evolve without requiring a major redesign.
