# E-gram: A Digital Gram Panchayat Solution

This project aims to digitize and streamline the delivery of citizen services in a Gram Panchayat. It provides a web-based platform for users to apply for services, track their applications, and for the Gram Panchayat administration to manage these services and applications efficiently.

## Technologies Used

*   **Frontend:** HTML, CSS, JavaScript
*   **Backend:** Firebase (Authentication, Firestore Database)

## Modules

The application is divided into the following modules:

*   **Admin/Officer:**
    *   Login
    *   Create, Update, and Delete services
    *   Update application status
    *   Logout
*   **User:**
    *   Register and Login
    *   Search for services
    *   Apply for services
    *   View application status
    *   Manage profile
    *   Logout
*   **Staff:**
    *   Login
    *   View services
    *   Update application status

## Project Structure

```
E-gram/
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── firebase-config.js
│   └── auth.js
├── index.html
├── admin.html
├── staff.html
└── user.html
```

## Workflow and Execution

1.  **Setup:**
    *   Clone the repository: `git clone <repository-url>`
    *   Create a Firebase project and configure Firebase Authentication and Firestore.
    *   Add your Firebase project configuration to `js/firebase-config.js`.

2.  **Running the application:**
    *   Open the `index.html` file in your web browser.

3.  **User Registration and Login:**
    *   New users can register for an account.
    *   Existing users can log in with their credentials.

4.  **User Dashboard:**
    *   After logging in, users can search for available services, apply for them, and track the status of their applications.

5.  **Admin/Staff Login:**
    *   Admin and staff can log in using their dedicated credentials.

6.  **Admin Dashboard:**
    *   Admins can manage services (create, update, delete) and update the status of user applications.

7.  **Staff Dashboard:**
    *   Staff can view services and update the status of user applications.

## Coding Standards

*   The code is written in a modular fashion for better maintainability and testability.
*   The code is portable and should work in any modern web browser.
*   The project is maintained on a public GitHub repository.
