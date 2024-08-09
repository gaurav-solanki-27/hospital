import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js';
import { getDoc, doc } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js';
import { auth, db } from './config.js'; // Ensure the path is correct

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('btn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (loginBtn) {
        loginBtn.addEventListener('click', async (event) => {
            event.preventDefault();

            const email = emailInput.value;
            const password = passwordInput.value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                console.log('User signed in:', user.uid);

                // Check user's role
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.role === 'user') {
                        window.location.href = '/html/user.html'; // Redirect to user dashboard
                    } else {
                        throw new Error('User role not recognized.');
                    }
                } else {
                    throw new Error('User document not found.');
                }
            } catch (error) {
                console.error('Login error:', error.message);
                showErrorMessage(error.message);
            }
        });
    }

    function showErrorMessage(message) {
        const messageContainer = document.getElementById('message');
        if (messageContainer) {
            messageContainer.textContent = message;
            messageContainer.style.color = 'red';
            messageContainer.style.display = 'block';
        }
    }
});
