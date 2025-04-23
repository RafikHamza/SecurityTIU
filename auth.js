// auth.js

// This file will handle the student authentication logic,
// including showing/hiding the auth modal and processing login/registration.

// Get the authentication modal element
const authModal = document.getElementById('auth-modal');
const authModalContent = authModal ? authModal.querySelector('.modal-content') : null;

// Check if the auth modal and its content area exist
if (!authModal) {
    console.warn('Authentication modal with id="auth-modal" not found. Authentication features will not work.');
} else if (!authModalContent) {
     console.warn('Modal content area (.modal-content) not found inside #auth-modal. Authentication form cannot be loaded.');
}


// Function to display the authentication modal
export function showAuthModal() {
    if (authModal && authModalContent) {
        console.log('Showing authentication modal.');
        // TODO: Load the appropriate form (login or register) into authModalContent
        authModalContent.innerHTML = `
            <h3>Login or Register</h3>
            <form id="auth-form">
                <div>
                    <label for="username">Username:</label>
                    <input type="text" id="username" required>
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" required>
                </div>
                <button type="submit">Login</button>
                <button type="button" id="register-button">Register</button>
            </form>
            <button class="close-modal" style="margin-top: 15px;">Close</button>
        `;

        // Add event listeners for form submission and register button
        const authForm = authModalContent.querySelector('#auth-form');
        if (authForm) {
            authForm.addEventListener('submit', handleAuthSubmit);
        }
        const registerButton = authModalContent.querySelector('#register-button');
         if (registerButton) {
            registerButton.addEventListener('click', showRegistrationForm);
        }


        authModal.style.display = 'block';
    } else {
        console.error('Cannot show authentication modal: modal or content area not found.');
    }
}

// Function to hide the authentication modal
export function hideAuthModal() {
    if (authModal) {
        console.log('Hiding authentication modal.');
        authModal.style.display = 'none';
        // Optional: Clear modal content when hiding
        // if (authModalContent) authModalContent.innerHTML = '';
    }
}

// Function to handle login/registration form submission (Placeholder)
function handleAuthSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    console.log('Authentication form submitted.');

    const usernameInput = authModalContent.querySelector('#username');
    const passwordInput = authModalContent.querySelector('#password');

    const username = usernameInput.value;
    const password = passwordInput.value;

    console.log(`Attempting login with Username: ${username}, Password: ${password}`);

    // ==============================================================
    // TODO: IMPLEMENT ACTUAL LOGIN/REGISTRATION LOGIC HERE
    // This would involve:
    // 1. Checking if the user is trying to Login or Register (e.g., based on a button clicked or form state).
    // 2. For Login: Verify username and password (compare hashed password from storage).
    // 3. For Registration: Hash the password, store user data (username, hashed password, progress) in IndexedDB or backend.
    // 4. Handle success (e.g., show success message, hide modal, update UI for logged-in user) or failure (show error message).
    // 5. Potentially manage user session state (e.g., using localStorage or a backend session).
    // ==============================================================

    // Placeholder success message
    alert(`Login/Registration logic not fully implemented.\nAttempted with Username: ${username}`);

    // Example: Hide modal on successful login/registration
    // hideAuthModal();
}

// Function to switch to registration form (Placeholder)
function showRegistrationForm() {
     if (authModalContent) {
         console.log('Showing registration form.');
         // TODO: Load the registration form HTML into authModalContent
         authModalContent.innerHTML = `
             <h3>Register New Account</h3>
             <form id="register-form">
                 <div>
                     <label for="new-username">Username:</label>
                     <input type="text" id="new-username" required>
                 </div>
                 <div>
                     <label for="new-password">Password:</label>
                     <input type="password" id="new-password" required>
                 </div>
                  <div>
                     <label for="confirm-password">Confirm Password:</label>
                     <input type="password" id="confirm-password" required>
                 </div>
                 <button type="submit">Register</button>
                 <button type="button" id="login-form-button">Back to Login</button>
             </form>
             <button class="close-modal" style="margin-top: 15px;">Close</button>
         `;

         // Add event listeners for registration form submission and back button
         const registerForm = authModalContent.querySelector('#register-form');
         if (registerForm) {
             registerForm.addEventListener('submit', handleAuthSubmit); // Re-use handleAuthSubmit or create a new one
         }
         const loginFormButton = authModalContent.querySelector('#login-form-button');
         if (loginFormButton) {
             loginFormButton.addEventListener('click', showLoginForm); // Function to show login form again
         }
     }
}

// Function to switch back to login form (Placeholder)
function showLoginForm() {
     if (authModalContent) {
         console.log('Showing login form.');
         // TODO: Load the login form HTML into authModalContent
          authModalContent.innerHTML = `
            <h3>Login or Register</h3>
            <form id="auth-form">
                <div>
                    <label for="username">Username:</label>
                    <input type="text" id="username" required>
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" required>
                </div>
                <button type="submit">Login</button>
                <button type="button" id="register-button">Register</button>
            </form>
            <button class="close-modal" style="margin-top: 15px;">Close</button>
        `;

        // Add event listeners back to the login form elements
         const authForm = authModalContent.querySelector('#auth-form');
        if (authForm) {
            authForm.addEventListener('submit', handleAuthSubmit);
        }
        const registerButton = authModalContent.querySelector('#register-button');
         if (registerButton) {
            registerButton.addEventListener('click', showRegistrationForm);
        }
     }
}


// Add event listener to the Login/Register button in the header
// This listener is added here in auth.js because auth.js manages the auth modal
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        console.log('Login button found. Attaching click listener.');
        loginButton.addEventListener('click', showAuthModal);
    } else {
        console.warn('Login button with id="login-button" not found.');
    }

    // Optional: Add event listeners for closing the modal by clicking outside
    // This is already handled by the delegated listener in main.js for .modal class,
    // but you could add specific listeners here if needed.
});

// NOTE: Actual authentication (password hashing, IndexedDB/backend interaction, session management)
// is a complex topic and requires significant additional code in handleAuthSubmit.
