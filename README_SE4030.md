# 🏫 SE4030 – Secure Software Development
# Security Audit, Vulnerability Remediation & Identity Federation Project

> **Module:** SE4030 – Secure Software Development  
> **Target Application:** MERN School Management System (Educational Enterprise ERP)  
> **Group Size:** 4 Members  
> **Original Upstream Repository:** [https://github.com/Yogndrr/MERN-School-Management-System](https://github.com/Yogndrr/MERN-School-Management-System)  
> **Group Modified Repository:** [https://github.com/YenuliAmaratunga/SE4030-MERN-School-Management-System](https://github.com/YenuliAmaratunga/SE4030-MERN-School-Management-System)  

---

## 👥 1. Team Workload & Security Engineering Distribution

To satisfy the academic requirement of equal contribution (~25% workload per member), our team divided the security engineering lifecycle into four specialized domains. Each member owned two distinct OWASP Top 10 vulnerabilities or major architectural modules from static/dynamic discovery through code remediation, unit testing, and pull request integration:

| Team Member | Assigned Security Domain | Core Responsibilities & Deliverables | Git Branch & Pull Requests |
| :--- | :--- | :--- | :--- |
| **Member 1** | **Access Control & Input Protection Lead** | • **Vulnerability 1:** Missing Role Verification & Authorization Bypass (`CWE-285`)<br>• **Vulnerability 2:** Mass Assignment on Entity Writes & Registration (`CWE-915`) | Branch: `security-rbac-mass-assignment`<br>PR: [#1](https://github.com/YenuliAmaratunga/SE4030-MERN-School-Management-System/pull/1) |
| **Member 2** | **Data Privacy & Injection Defense Lead** | • **Vulnerability 3:** Broken Object Level Authorization (BOLA/IDOR) on Student Records (`CWE-639`)<br>• **Vulnerability 4:** NoSQL Query Operator Injection (`CWE-943`) | Branch: `fix/idor-nosql-injection`<br>PRs: [#4](https://github.com/YenuliAmaratunga/SE4030-MERN-School-Management-System/pull/4), [#7](https://github.com/YenuliAmaratunga/SE4030-MERN-School-Management-System/pull/7) |
| **Member 3** | **Content Security & Perimeter Hardening Lead** | • **Vulnerability 5:** Stored Cross-Site Scripting (XSS) in Notices & Complaints (`CWE-79`)<br>• **Vulnerability 6:** Missing Rate Limiting & Account Lockout Mechanism (`CWE-307`) | Branches: `fix/Stored-XSS`, `fix/authentication-rate-limiting`<br>PRs: [#2](https://github.com/YenuliAmaratunga/SE4030-MERN-School-Management-System/pull/2), [#3](https://github.com/YenuliAmaratunga/SE4030-MERN-School-Management-System/pull/3) |
| **Member 4** | **Session Architecture & Identity Federation Lead** | • **Vulnerability 7:** Insecure JWT Storage in LocalStorage & Session Hijacking (`CWE-384`, `CWE-922`)<br>• **New Feature:** Third-Party Authentication via Google Workspace OAuth 2.0 / OpenID Connect (PKCE) | Branch: `fix/oauth`<br>PR: [#6](https://github.com/YenuliAmaratunga/SE4030-MERN-School-Management-System/pull/6) |

---

## 📌 Table of Contents
1. [Team Workload & Security Engineering Distribution](#-1-team-workload--security-engineering-distribution)
2. [Executive Summary & System Architecture](#-2-executive-summary--system-architecture)
3. [The 7 Distinct Vulnerabilities Identified & Remediated](#-3-the-7-distinct-vulnerabilities-identified--remediated)
4. [Third-Party Identity Federation: Google OAuth 2.0 / OpenID Connect (PKCE)](#-4-third-party-identity-federation-google-oauth-20--openid-connect-pkce)
5. [Vulnerabilities Intentionally Not Fixed & Engineering Rationales](#-5-vulnerabilities-intentionally-not-fixed--engineering-rationales)
6. [Software Engineering Best Practices for Vulnerability Prevention](#-6-software-engineering-best-practices-for-vulnerability-prevention)
7. [Git Branching Strategy & Audit Trail](#-7-git-branching-strategy--audit-trail)
8. [Installation, Local Setup & Quickstart Guide](#-8-installation-local-setup--quickstart-guide)
9. [Security Verification & Testing Protocols](#-9-security-verification--testing-protocols)

---

## 🏛️ 2. Executive Summary & System Architecture

The **MERN School Management System** is a full-featured educational Enterprise Resource Planning (ERP) platform developed using MongoDB, Express.js, React.js, and Node.js. The platform coordinates multi-tier educational workflows across three distinct user roles:

* **School Administrator:** Manages school tenancy, registers faculty and students, creates academic classes and subjects, publishes institutional notices, and reviews complaints.
* **Teacher:** Assigned to specific academic classes; records daily student attendance, assigns marks, and submits term exam results.
* **Student:** Inspects confidential academic exam results, tracks personal attendance history, views school notices, and files feedback/complaints.

### Baseline Vulnerability Posture
A comprehensive security audit of the original upstream repository revealed that the application was developed without defense-in-depth security engineering principles. Authentication was implemented via client-side bearer tokens stored in browser `localStorage`, authorization checks relied on cosmetic UI routing in React (`frontend/src/App.js`), database endpoints accepted raw unvalidated JSON payloads directly into Mongoose queries, and access to student personal identifiable information (PII) and academic grades was unprotected against direct object reference tampering.

Our team refactored the application's security architecture across the entire stack, hardening API boundaries with runtime schema validation, context-aware attribute-based access control, AST operator sanitization, server-side HTML purification, rate limiting, and standardizing session management onto secure `HttpOnly` cookies paired with Google Workspace OpenID Connect PKCE authentication.

---

## 🛡️ 3. The 7 Distinct Vulnerabilities Identified & Remediated

Our team identified and successfully mitigated **7 distinct security vulnerabilities** spanning five OWASP Top 10 (2021) categories:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        7 DISTINCT REMEDIATED VULNERABILITIES                           │
├──────────────┬────────────────────────────┬──────────────┬─────────────┬───────────────┤
│ OWASP (2021) │ Vulnerability Description  │ CWE Standard │ Lead Member │ Status        │
├──────────────┼────────────────────────────┼──────────────┼─────────────┼───────────────┤
│ A01:2021     │ Missing Role Verification  │ CWE-285      │ Member 1    │ ✅ REMEDIATED  │
│ A01:2021     │ Mass Assignment in Writes  │ CWE-915      │ Member 1    │ ✅ REMEDIATED  │
│ A01:2021     │ BOLA / IDOR on Students    │ CWE-639      │ Member 2    │ ✅ REMEDIATED  │
│ A03:2021     │ NoSQL Operator Injection   │ CWE-943      │ Member 2    │ ✅ REMEDIATED  │
│ A03:2021     │ Stored Cross-Site Scripting│ CWE-79       │ Member 3    │ ✅ REMEDIATED  │
│ A07:2021     │ Lack of Rate Limiting      │ CWE-307      │ Member 3    │ ✅ REMEDIATED  │
│ A07:2021     │ Insecure Session / JWT     │ CWE-384/922  │ Member 4    │ ✅ REMEDIATED  │
└──────────────┴────────────────────────────┴──────────────┴─────────────┴───────────────┘
```

---

### 🛡️ Vulnerability 1: Missing Role Verification & Authorization Bypass on Protected Routes
* **OWASP Classification:** A01:2021 – Broken Access Control
* **CWE Identifier:** **CWE-285** (Improper Authorization)
* **Lead Engineer:** **Member 1**
* **Affected Files:** `backend/routes/route.js`, `backend/controllers/subject-controller.js`, `backend/controllers/notice-controller.js`
* **Vulnerability Description & Impact:**  
  In the baseline application, backend API endpoints failed to verify the caller's role. Route security was delegated exclusively to client-side navigation logic in React. An authenticated user possessing a valid low-privileged `Student` or `Teacher` JWT could issue raw HTTP requests to administrative mutation endpoints (e.g., `POST /SubjectCreate`, `POST /NoticeCreate`, `DELETE /Sclass/:id`), creating unauthorized subjects, classes, or issuing system-wide notices without administrative privileges.
* **Technical Remediation:**  
  We implemented reusable, layered role-based access control (RBAC) middleware in `backend/middleware/authMiddleware.js`:
  1. `authMiddleware`: Cryptographically validates the incoming JSON Web Token and attaches the authenticated user identity (`req.user`) to the request context.
  2. `authorizeRoles(...roles)`: Intercepts the request pipeline to verify whether `req.user.role` matches the permissible caller roles (`Admin`, `Teacher`, `Student`), returning `403 Forbidden` (`{ "message": "Access forbidden: Insufficient privileges" }`) for unauthorized callers.
  3. Enforced these guards across all sensitive administrative and faculty route definitions in `backend/routes/route.js`.

---

### 🛡️ Vulnerability 2: Mass Assignment on Entity Writes & Registration
* **OWASP Classification:** A01:2021 – Broken Access Control
* **CWE Identifier:** **CWE-915** (Improperly Controlled Modification of Dynamically-Determined Object Attributes)
* **Lead Engineer:** **Member 1**
* **Affected Files:** `backend/controllers/student_controller.js`, `backend/controllers/sclass-controller.js`, `backend/controllers/subject-controller.js`, `backend/controllers/notice-controller.js`
* **Vulnerability Description & Impact:**  
  Endpoints creating or updating database records accepted dynamic request payloads directly into Mongoose model constructors (e.g., `const student = new Student(req.body)`). Malicious callers could inject unauthorized schema attributes into payloads, such as tampering with the foreign key `school` identifier, binding a student to another tenant, or overriding role fields.
* **Technical Remediation:**  
  We eliminated dynamic object assignment across entity creation controllers:
  1. Implemented explicit field whitelisting across class, subject, notice, complaint, and student write handlers.
  2. Bound tenancy parameters (`school: req.user.schoolId`) strictly from the cryptographically verified JWT session context rather than accepting them from untrusted client input payloads.

---

### 🛡️ Vulnerability 3: Broken Object Level Authorization (BOLA / IDOR) on Student Academic Records
* **OWASP Classification:** A01:2021 – Broken Access Control
* **CWE Identifier:** **CWE-639** (Authorization Bypass Through User-Controlled Key) / **OWASP API1:2023**
* **Lead Engineer:** **Member 2**
* **Affected Files:** `backend/controllers/student_controller.js` (`getStudentDetail`, `updateStudent`, `updateExamResult`, `studentAttendance`, `removeStudentAttendanceBySubject`, `removeStudentAttendance`, `deleteStudent`)
* **Vulnerability Description & Impact:**  
  The application fetched, updated, and deleted student profiles solely based on the user-supplied `:id` URL parameter (`Student.findById(req.params.id)`). Any logged-in student could view any peer's confidential profile, GPA, and exam results simply by modifying the MongoDB ObjectId in `GET /Student/:id`. Furthermore, cross-tenant faculty or students could modify marks (`PUT /UpdateExamResult`), record/delete attendance logs, or execute student profile mutations (`PUT /Student/:id`, `DELETE /Student/:id`).
* **Technical Remediation:**  
  We implemented a multi-layered Attribute-Based Access Control (ABAC) engine:
  1. **Context-Aware Ownership Guard (`isAuthorizedForStudent`):**
     - **Student Self-Access:** A student may inspect only their own profile (`req.user.id === student._id.toString()`); mutation of grades or attendance is strictly forbidden.
     - **School Admin Isolation:** Administrators are strictly scoped to students registered under their exact school tenancy (`req.user.schoolId === student.school.toString()`).
     - **Class Teacher Isolation:** Enforces dual-condition matching: a teacher must belong to the same school tenant AND be assigned as the official instructor for the student's specific academic class (`teacher.school === student.school && teacher.teachSclass === student.sclassName`).
  2. **Identifier Enumeration Defense (CWE-200):**  
     Standardized all unauthorized access rejections and malformed query responses to return a generic `404 Not Found` with `{ "message": "No student found" }`, completely neutralizing side-channel ID harvesting.
  3. **Full Lifecycle Write-BOLA Hardening:**  
     Extended the ABAC engine across all single-student mutation endpoints (`getStudentDetail`, `updateStudent`, `updateExamResult`, `studentAttendance`, `removeStudentAttendanceBySubject`, `removeStudentAttendance`, `deleteStudent`).

---

### 🛡️ Vulnerability 4: NoSQL Query Operator Injection in Authentication & Lookups
* **OWASP Classification:** A03:2021 – Injection
* **CWE Identifier:** **CWE-943** (Improper Neutralization of Special Elements used in a Command / Query)
* **Lead Engineer:** **Member 2**
* **Affected Files:** `backend/index.js`, `backend/dto/loginDto.js`, `backend/controllers/admin-controller.js`, `backend/controllers/student_controller.js`, `backend/controllers/teacher-controller.js`
* **Vulnerability Description & Impact:**  
  The authentication handlers passed unvalidated JSON request bodies directly into Mongoose lookup filters (`Admin.findOne({ email: req.body.email })`, `Student.findOne({ rollNum: req.body.rollNum })`). By submitting JSON objects containing MongoDB query selectors (`{"email": {"$gt": ""}}`, `{"rollNum": {"$ne": null}}`), attackers could execute arbitrary operator injection, triggering server crashes (500 Internal Server Error) or bypassing credential checks on non-hashed lookup logic.
* **Technical Remediation:**  
  We implemented a two-tier defense model combining perimeter AST sanitization with strict runtime type contracts:
  1. **Perimeter AST Sanitization:** Integrated `express-mongo-sanitize` in `backend/index.js` to strip `$` and `.` operator prefixes recursively from `req.body`, `req.query`, and `req.params`.
  2. **Runtime Schema Contracts (Zod DTOs):** Built `backend/dto/loginDto.js` with strict schemas (`adminLoginSchema`, `teacherLoginSchema`, `studentLoginSchema`) validating payloads before reaching any database logic.
  3. **Mathematical Integer Pipeline for `rollNum`:** Enforced a dual validation-transformation pipeline verifying that `rollNum` is a **finite positive integer** ($\ge 1$). Inputs representing objects, floats (`1.5`), negative numbers (`-5`), zero (`0`), or non-numeric strings are rejected immediately with `400 Bad Request` and structured `VALIDATION_ERROR` details.

---

### 🛡️ Vulnerability 5: Stored Cross-Site Scripting (XSS) in Notices & Complaints Modules
* **OWASP Classification:** A03:2021 – Injection
* **CWE Identifier:** **CWE-79** (Improper Neutralization of Input During Web Page Generation)
* **Lead Engineer:** **Member 3**
* **Affected Files:** `backend/controllers/notice-controller.js`, `backend/controllers/complain-controller.js`, `backend/middleware/securityHeaders.js`, `backend/index.js`
* **Vulnerability Description & Impact:**  
  Notice creation (`POST /NoticeCreate`) and student complaint submission (`POST /ComplainCreate`) accepted arbitrary string inputs without HTML escaping or sanitization. When administrators, teachers, or students viewed the shared notice board or complaint logs, malicious JavaScript stored in notice titles or details (`<script>alert(document.cookie)</script>`, `<img src=x onerror=...>`) executed in the context of the victim's browser session.
* **Technical Remediation:**  
  1. **Server-Side Sanitization:** Integrated `dompurify` with `jsdom` in `backend/controllers/notice-controller.js` and `backend/controllers/complain-controller.js` to strip all malicious HTML tags, JavaScript event handlers, and executable payloads prior to database persistence.
  2. **Content Security Policy (CSP):** Implemented `backend/middleware/securityHeaders.js` using `helmet` to inject strict CSP headers, restricting script execution sources and disallowing unapproved inline scripts.

---

### 🛡️ Vulnerability 6: Lack of Authentication Rate Limiting & Account Lockout
* **OWASP Classification:** A07:2021 – Identification and Authentication Failures
* **CWE Identifier:** **CWE-307** (Improper Restriction of Excessive Authentication Attempts)
* **Lead Engineer:** **Member 3**
* **Affected Files:** `backend/routes/route.js`, `backend/index.js`
* **Vulnerability Description & Impact:**  
  Authentication endpoints (`/Adminlogin`, `/Studentlogin`, `/Teacherlogin`) accepted an unlimited number of login attempts without delay or throttling. Attackers could execute automated dictionary attacks and high-velocity brute-force password guessing against administrative and student accounts using automated tools like Burp Suite or Hydra.
* **Technical Remediation:**  
  1. Integrated `express-rate-limit` middleware on all authentication routes.
  2. Configured a strict rate limiting policy: maximum of **5 failed attempts per 15-minute window** per client IP.
  3. Excessive requests are throttled with `429 Too Many Requests`, accompanied by standardized headers (`Retry-After`, `RateLimit-Limit`, `RateLimit-Remaining`).

---

### 🛡️ Vulnerability 7: Insecure JWT Storage in LocalStorage & Session Hijacking
* **OWASP Classification:** A07:2021 – Identification and Authentication Failures
* **CWE Identifier:** **CWE-384** (Session Fixation) / **CWE-922** (Insecure Storage of Sensitive Information)
* **Lead Engineer:** **Member 4**
* **Affected Files:** `backend/controllers/auth-controller.js`, `backend/middleware/authMiddleware.js`, `frontend/src/redux/userRelated/userHandle.js`
* **Vulnerability Description & Impact:**  
  The original architecture stored unencrypted, long-lived JWT tokens inside client-side browser `localStorage`. Any client-side XSS vulnerability could immediately extract the JWT, granting an attacker full, persistent access to the victim's account. Additionally, tokens could not be revoked server-side upon user logout.
* **Technical Remediation:**  
  1. **HttpOnly Cookie Migration:** Migrated session tokens from `localStorage` to `HttpOnly`, `SameSite=Strict`, `Secure` cookies, rendering tokens inaccessible to client-side JavaScript (`document.cookie`).
  2. **Server-Side Token Revocation:** Implemented a token invalidation mechanism and a dedicated `/logout` endpoint that clears cookies and invalidates the active session on the backend.
  3. Configured CORS with `credentials: true` and exposed security headers to maintain seamless authentication across client and API server boundaries.

---

## 🔑 4. Third-Party Identity Federation: Google OAuth 2.0 / OpenID Connect (PKCE)

To fulfill the assignment requirement for third-party identity federation, our team implemented **Google Workspace for Education Single Sign-On (SSO)** using **OpenID Connect (OIDC)** and the **OAuth 2.0 Authorization Code Grant with Proof Key for Code Exchange (PKCE)**.

* **Lead Engineer:** **Member 4**
* **Identity Provider (IdP):** Google Identity Services
* **OIDC Scopes Requested:** `openid`, `profile`, `email`
* **Grant Type:** Authorization Code Grant with PKCE (RFC 7636)

```
┌──────────┐                 ┌──────────────┐                 ┌───────────────┐
│ Browser  │                 │ ERP Backend  │                 │ Google OAuth  │
└────┬─────┘                 └──────┬───────┘                 └───────┬───────┘
     │ 1. Click "Sign in w/ Google" │                                 │
     │─────────────────────────────>│ 2. Generate PKCE Verifier/      │
     │                              │    Challenge & State CSRF Token │
     │ 3. Redirect to Google Auth   │                                 │
     │<─────────────────────────────│                                 │
     │ 4. Authenticate & Grant Consent                                │
     │───────────────────────────────────────────────────────────────>│
     │ 5. Redirect w/ Auth Code + State                               │
     │<───────────────────────────────────────────────────────────────│
     │ 6. Exchange Code via Backend Callback                          │
     │─────────────────────────────>│                                 │
     │                              │ 7. Validate PKCE + State Token  │
     │                              │ 8. Exchange Code for ID Token   │
     │                              │────────────────────────────────>│
     │                              │ 9. Return Signed JWT ID Token   │
     │                              │<────────────────────────────────│
     │                              │ 10. Verify ID Token & Resolve   │
     │                              │     Institutional User Record   │
     │ 11. Issue HttpOnly Session   │                                 │
     │<─────────────────────────────│                                 │
```

### Architectural Implementation Details:
1. **Cryptographic PKCE Defense:** Generates high-entropy `code_verifier` and SHA-256 `code_challenge` pairs alongside cryptographic `state` parameters to thwart Authorization Code Interception and CSRF attacks.
2. **Server-Side Token Exchange:** The backend exchanges the validated authorization code directly with Google's token endpoint (`https://oauth2.googleapis.com/token`) using `google-auth-library`.
3. **Institutional Account Linking:** Validates the Google ID Token's cryptographic signature, extracts the user's verified institutional email, and matches it with existing `Admin`, `Teacher`, or `Student` database profiles.
4. **Unified Session Issuance:** Upon successful verification, the backend issues an internal `HttpOnly`, `SameSite=Strict` session cookie, ensuring consistent session management across both traditional and federated authentication paths.

---

## ⚖️ 5. Vulnerabilities Intentionally Not Fixed & Engineering Rationales

In accordance with assignment guidelines, our team documented potential security improvements that were evaluated but intentionally deferred, along with the technical rationales:

1. **Anti-CSRF Synchronizer Tokens on Stateless Read Operations:**  
   * **Rationale:** State-changing API endpoints are protected by `SameSite=Strict` cookie enforcement paired with custom JSON `Content-Type` header checks that prevent standard browser cross-origin form submissions. Introducing a stateful synchronizer token architecture (e.g., Double Submit Cookie) was deferred because the headless React Single Page Application (SPA) architecture already enforces pre-flight CORS verification (`credentials: true`).
2. **Application-Level Envelope Encryption (Field-Level Encryption at Rest):**  
   * **Rationale:** While full field-level encryption for student names and grades protects data against cold database dumping, it eliminates MongoDB's ability to perform regex pattern matching, collation, and index-based sorting on student roll numbers and names. Because transparent database-level encryption (TDE) is standard in enterprise production environments, field-level application encryption was deferred to preserve critical ERP reporting capabilities.
3. **Transitive UI Library Peer Dependency Warnings:**  
   * **Rationale:** Running `npm audit` on the frontend identifies legacy peer dependency warnings within older Material-UI (`@mui/material`) sub-packages. Upgrading to major new UI frameworks would introduce breaking visual regressions across legacy Material tables and calendar pickers. Because these warnings reside purely in client-side bundling tooling rather than runtime server sinks, they were preserved to maintain system UI stability.

---

## 🔄 6. Software Engineering Best Practices for Vulnerability Prevention

The vulnerabilities present in the original codebase stemmed from rapid prototyping without secure Software Development Life Cycle (S-SDLC) practices. We recommend the following engineering controls to prevent these flaws during initial construction:

1. **Shift-Left Security & CI/CD DevSecOps Integration:**  
   Integrate Static Application Security Testing (SAST) tools (such as **Semgrep** and **SonarQube**) and software composition analysis (`npm audit`) directly into GitHub Actions pull request workflows. Automated gates must block merges when tainted input sinks or unescaped HTML assignments are detected.
2. **Threat Modeling & Architectural Review (STRIDE / DREAD):**  
   Conduct threat modeling during sprint planning before writing code. Identifying multi-tenant authorization boundaries early would have revealed the need for contextual ABAC ownership checks before exposing direct ObjectIds in URL parameters.
3. **Strict Runtime Schema Validation at Boundaries:**  
   Adopt the principle of "Parse, Don't Validate" by defining strict DTO contracts (e.g., with Zod or Joi) at all network entry points. Rejecting unexpected fields by default eliminates mass assignment and NoSQL injection before payloads reach business logic.
4. **Least Privilege & Secure Defaults:**  
   Configure database users with least privilege, enforce `HttpOnly` cookie session storage out of the box, and adopt parameterized ORM/ODM query builders that prohibit raw operator execution by default.
5. **Mandatory Peer Code Reviews & Branch Protection:**  
   Enforce branch protection rules on `main` and `dev` requiring at least two approving peer reviews and passing automated security checks prior to code integration.

---

## 🌿 7. Git Branching Strategy & Audit Trail

Our team implemented a professional Git branching workflow ensuring full accountability, traceability, and individual contribution evidence:

```
main (Production / Stable Baseline)
  │
  └── dev (Active Group Integration Branch)
        ├── security-rbac-mass-assignment (PR #1 - Member 1)
        ├── fix/Stored-XSS                (PR #2 - Member 3)
        ├── fix/authentication-rate-limit (PR #3 - Member 3)
        ├── fix/idor-nosql-injection      (PR #4, #7 - Member 2)
        └── fix/oauth                     (PR #6 - Member 4)
```

### Git Commit & Pull Request Audit Log:
* **Pull Request #1 (Member 1):** `security-rbac-mass-assignment`
  * `b633db7`: Require a signed JWT for authenticated API access
  * `e4bf65a`: Enforce role checks on protected API routes (`authorizeRoles`)
  * `d9531b2`: Whitelist fields on class, notice, complaint, and subject writes
* **Pull Request #2 & #3 (Member 3):** `fix/Stored-XSS` & `fix/authentication-rate-limiting`
  * `6dca541`: Enhanced security and sanitization features (`dompurify`)
  * `23647f1`: Implement authentication rate limiting and lockout mechanism
  * `841fb6e`: Implement stored XSS fixes and enhance login security measures
* **Pull Request #4 & #7 (Member 2):** `fix/idor-nosql-injection`
  * `af730f8`: Install and configure `express-mongo-sanitize` middleware
  * `824581c`: Enforce runtime schema contracts on authentication controllers (Zod DTOs)
  * `291fe39`: Implement context-aware ABAC guard on student record retrieval
  * `31d53a4`: Neutralize student identifier enumeration side-channel (`404 Not Found`)
  * `94a3ee6`: Resolve cross-tenant BOLA and enforce finite positive integer schema contracts
  * `791e1c4`: Enforce ABAC guard on student attendance removal and deletion endpoints
* **Pull Request #6 (Member 4):** `fix/oauth`
  * `2e634d0`: Move login sessions from `localStorage` bearer tokens to `httpOnly` cookies
  * `4f222a2`: Add server-side session revocation and Google OpenID Connect login
  * `b810f6f`: Send Google setup errors back to login page and preserve error messaging

---

## 🚀 8. Installation, Local Setup & Quickstart Guide

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher
* **MongoDB:** Local MongoDB community instance running on `localhost:27017` (or MongoDB Atlas URI)

---

### Step 1: Clone the Repository & Checkout `dev`
```bash
git clone https://github.com/YenuliAmaratunga/SE4030-MERN-School-Management-System.git
cd SE4030-MERN-School-Management-System
git checkout dev
```

---

### Step 2: Backend Configuration & Startup
1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Configure your environment variables. Create a `.env` file in `backend/.env`:
   ```ini
   PORT=5000
   MONGO_URL=mongodb://127.0.0.1:27017/school_management
   CLIENT_URL=http://localhost:3000
   JWT_SECRET=se4030_super_secure_jwt_secret_key_2026
   JWT_REFRESH_SECRET=se4030_super_secure_refresh_secret_key_2026
   GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   ```
3. Seed test users (Admin, Class 10-A, Alice Smith, Bob Jones):
   ```bash
   node seed.js
   ```
4. Start the backend development server:
   ```bash
   npm start
   ```
   *The server will start on `http://localhost:5000` with MongoDB connected.*

---

### Step 3: Frontend Configuration & Startup
1. Open a new terminal, navigate to the frontend directory, and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```
2. Ensure `frontend/.env` is configured:
   ```ini
   REACT_APP_BASE_URL=http://localhost:5000
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *The application will launch automatically in your browser at `http://localhost:3000`.*

---

### 🔑 Test Account Credentials (Generated by `seed.js`)
| Role | Portal / Endpoint | Identity / Username | Password | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **School Admin** | `/Adminlogin` | `admin@test.com` | `admin123` | Administrator for Springfield Academy |
| **Student A** | `/Studentlogin` | `Alice Smith` (Roll: `1`) | `student123` | Class 10-A (Owner of Student Record A) |
| **Student B** | `/Studentlogin` | `Bob Jones` (Roll: `2`) | `student123` | Class 10-A (Owner of Student Record B) |

---

## 🧪 9. Security Verification & Testing Protocols

Our team conducted dual-spectrum testing combining Static Application Security Testing (**SAST**) and Dynamic Application Security Testing (**DAST**):

### 1. Static Analysis (SAST)
* **Semgrep:** Configured custom Semgrep taint-tracking rules verifying that user input from `req.body` and `req.params` cannot reach Mongoose query sinks (`.find()`, `.findOne()`) without prior sanitization or schema parsing.
* **Dependency Check:** Executed `npm audit` to detect known CVEs in third-party libraries.

### 2. Dynamic Analysis (DAST) & Postman Verification
We executed automated test suites in Postman and OWASP ZAP to confirm vulnerability remediation:

| Test Case | Target Endpoint | Attack Payload / Action | Expected Result (Post-Fix) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Role Verification** | `POST /SubjectCreate` | Call endpoint with `Student` JWT | `403 Forbidden` (`Insufficient privileges`) | ✅ PASSED |
| **Mass Assignment** | `POST /StudentReg` | Inject `{"role": "Admin", "school": "evil"}` | Injected fields stripped; tenant bound to token | ✅ PASSED |
| **BOLA / IDOR Read** | `GET /Student/:id` | Student A queries Student B's ID | `404 Not Found` (`No student found`) | ✅ PASSED |
| **BOLA Exam Tamper** | `PUT /UpdateExamResult` | Cross-student grade update attempt | `404 Not Found` (`No student found`) | ✅ PASSED |
| **NoSQL Operator** | `POST /Adminlogin` | `{"email": {"$gt": ""}, "password": "x"}` | `400 Bad Request` (`VALIDATION_ERROR`) | ✅ PASSED |
| **NoSQL Int Bypass** | `POST /Studentlogin` | `{"rollNum": {"$ne": null}, ...}` | `400 Bad Request` (Zod finite integer rejected) | ✅ PASSED |
| **Stored XSS** | `POST /NoticeCreate` | `<script>alert('xss')</script>` in details | HTML sanitized; scripts stripped by DOMPurify | ✅ PASSED |
| **Rate Limiting** | `POST /Adminlogin` | 6 failed logins in rapid succession | `429 Too Many Requests` (15-min lockout) | ✅ PASSED |
| **HttpOnly Cookies** | `POST /Adminlogin` | Inspect `document.cookie` in browser | Cookie inaccessible via JS (`HttpOnly; Secure`) | ✅ PASSED |
| **OAuth 2.0 PKCE** | `/api/auth/google` | Google SSO login flow | ID token validated; session cookie established | ✅ PASSED |

---

> **Academic Declaration:**  
> This security audit, architecture refactoring, and vulnerability remediation report was collaboratively designed and implemented for **SE4030 – Secure Software Development**. All code modifications, commit histories, pull requests, and documentation are original works of the four team members.
