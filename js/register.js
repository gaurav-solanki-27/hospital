import { auth, db } from './config.js'; // Ensure the path is correct
import { createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js';
import { doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js';

document.getElementById('btn').addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const displayName = document.getElementById('displayName').value;

    // Validate password rules on submit
    const errorMessage = validatePassword(password);
    if (errorMessage) {
        showErrorMessage(errorMessage);
        document.getElementById('password-rules').style.display = 'block';
        return;
    } else {
        document.getElementById('password-rules').style.display = 'none';
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with display name
        await updateProfile(user, { displayName: displayName });

        // Save additional user details to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            displayName: displayName,
            email: email,
            createdAt: serverTimestamp()
        });

        showSuccessMessage('Registration successful!');
        document.getElementById('register-form').reset(); // Reset form fields

        // Redirect to user login page
        window.location.href = '/html/user_login.html'; // Adjust the path as necessary
    } catch (error) {
        showErrorMessage(error.message);
    }
});

// Validate password on input
document.getElementById('password').addEventListener('input', () => {
    const password = document.getElementById('password').value;
    validatePassword(password);
});

function validatePassword(password) {
    const lengthRule = document.getElementById('length');
    const uppercaseRule = document.getElementById('uppercase');
    const lowercaseRule = document.getElementById('lowercase');
    const numberRule = document.getElementById('number');
    const specialRule = document.getElementById('special');

    if (!lengthRule || !uppercaseRule || !lowercaseRule || !numberRule || !specialRule) {
        console.error('One or more password rule elements are missing.');
        return;
    }

    let errors = [];
    if (password.length < 8) {
        lengthRule.style.color = 'red';
        errors.push('Password must be at least 8 characters long.');
    } else {
        lengthRule.style.color = 'black';
    }
    if (!/[A-Z]/.test(password)) {
        uppercaseRule.style.color = 'red';
        errors.push('Password must contain at least one uppercase letter.');
    } else {
        uppercaseRule.style.color = 'black';
    }
    if (!/[a-z]/.test(password)) {
        lowercaseRule.style.color = 'red';
        errors.push('Password must contain at least one lowercase letter.');
    } else {
        lowercaseRule.style.color = 'black';
    }
    if (!/[0-9]/.test(password)) {
        numberRule.style.color = 'red';
        errors.push('Password must contain at least one number.');
    } else {
        numberRule.style.color = 'black';
    }
    if (!/[!@#$%^&*]/.test(password)) {
        specialRule.style.color = 'red';
        errors.push('Password must contain at least one special character (!@#$%^&*).');
    } else {
        specialRule.style.color = 'black';
    }

    document.getElementById('password-rules').style.display = 'block';
    return errors.length > 0 ? errors.join(' ') : null;
}

function showErrorMessage(message) {
    const messageContainer = document.getElementById('message');
    if (messageContainer) {
        messageContainer.textContent = message;
        messageContainer.style.color = 'red';
        messageContainer.style.display = 'block';
    }
}

function showSuccessMessage(message) {
    const messageContainer = document.getElementById('message');
    if (messageContainer) {
        messageContainer.textContent = message;
        messageContainer.style.color = 'green';
        messageContainer.style.display = 'block';
    }
}
