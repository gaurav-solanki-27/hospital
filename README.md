# Hospital


## Project Overview
The "Hospital" project is designed to transform a static surgical scheduling system into a dynamic model, accommodating various hospital scenarios. This project focuses on creating an efficient interface to manage Operating Theater (OT) activities, addressing challenges such as room availability, doctor preferences, and emergencies. The system allows hospital administrators to analyze OT activity, view schedules, and manage resources efficiently.

## Features
- **Admin Module:**
  - Manage doctor details
  - Manage patient details
  - Schedule operations with date, time, OT ID, anesthesia details, and more
  - Track pre- and post-operative events
  - Attach surgical reports and add remarks

- **User Module:**
  - Register and log in
  - View doctor details
  - View surgical information

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Firebase (Firestore, Authentication)
- **Deployment:** Cloud hosting (e.g., Firebase Hosting)

## System Architecture
The system architecture consists of a modular design, separating concerns into distinct components:
- **Frontend:** Interfaces for admins and users, implemented with HTML, CSS, and JavaScript.
- **Backend:** Firebase handles authentication, database operations, and real-time updates.

## Admin registration in firebase manually
- **Step 1: Create Admin User in Firebase Authentication.**

    First, create the admin user in the Firebase Authentication console. This will generate a unique UID for the user.

    - **1**. Go to the Firebase Console.
    - **2**. Navigate to the "Authentication" section.
    - **3**. Click on the "Users" tab.
    - **4**. Click "Add user".
    - **5**. Fill in the email and password for the admin user and click "Add user".

- **Step 2: Get the UID of the Admin User.**

    After creating the user in Firebase Authentication, you will have a unique UID associated with this user.

    - **1**. In the Firebase Console, go to the "Authentication" section.
    - **2**. Find the newly created admin user.
    - **3**. Copy the UID of the admin user.

- **Step 3: Add the Admin User to Firestore.**
    
    Now, you need to manually add the admin user to the admins collection in Firestore using the copied UID.

    - **1**. Go to the Firebase Console.
    - **2**. Navigate to the "Firestore Database" section.
    - **3**. Click on the "Start Collection" button if you haven't created the admins collection yet.
    - **4**. Enter admins as the collection ID.
    - **5**. Click "Next".
    - **6**. Paste the copied UID into the document ID field.
    
- **Add fields to the document**:
- **email**: The email of the admin user.
- **role**: admin.
- **createdAt**: (optional) Server timestamp or any other timestamp format.

## Example
    ```bash
         {
            "email": "admin@example.com",
            "role": "admin",
            "createdAt": "timestamp" // This field is optional
            }
    ```
## Firebase Setup
**1. Create Firebase Project**:
- Go to Firebase Console.
- Create a new project and name it (e.g., "Hospital").

**2. Add Firebase to Your Web App**:
- Click on the Web icon (</>) in the Firebase Console to add Firebase to your web app.
- Copy the Firebase configuration code and paste it into js/config.js.

**3. Enable Firebase Services**:
- **Authentication**: Enable "Email/Password" under Authentication > Sign-in method.
- **Firestore Database**: Create a Firestore database in production mode.
- **Storage**: Set up Firebase Storage for document uploads.

**4. Initialize Firebase**:
- Initialize Firebase in js/config.js using the provided configuration.
    ```bash
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_PROJECT_ID.appspot.com",
            messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
            appId: "YOUR_APP_ID"
    };//Replace your firebase configuration here.
    ```

## Contributing
- Contributions are welcome. Please fork the repository and create a pull request with your changes. Make sure to follow the coding standards and update the README.md file with any new features or changes.

## License

[MIT License](LICENSE.txt)

