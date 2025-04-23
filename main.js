// main.js

// Import the modules data from modules.js
import { modules } from './modules.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Get main elements
    const contentArea = document.getElementById('content');
    const authModal = document.getElementById('auth-modal'); // Assuming you have this modal
    const quizModal = document.getElementById('quiz-modal');

    // Check if essential elements exist
    if (!contentArea) {
        console.error('Content area with id="content" not found. Cannot proceed.');
        return;
    }
    if (!quizModal) {
        console.warn('Quiz modal with id="quiz-modal" not found. Quiz feature will be limited.');
        // Continue execution, but quiz functionality will be broken without the modal
    }
     if (!authModal) {
        console.warn('Auth modal with id="auth-modal" not found. Authentication feature will be limited.');
        // Continue execution, but auth functionality will be broken without the modal
    }


    // --- Modal Functions ---

    // Function to display a modal
    function showModal(modalElement) {
        if (modalElement) {
            modalElement.style.display = 'block';
            console.log(`${modalElement.id} shown.`);
        }
    }

    // Function to hide a modal
    function hideModal(modalElement) {
        if (modalElement) {
            modalElement.style.display = 'none';
            // Optional: Clear modal content when hiding if needed
            // let modalContent = modalElement.querySelector('.modal-content');
            // if (modalContent) modalContent.innerHTML = '';
            console.log(`${modalElement.id} hidden.`);
        }
    }

    // Add event listeners to close modals (e.g., clicking a close button or outside the modal)
    // This assumes you add a close button with class 'close-modal' inside your modal content
    // or want to close by clicking the background overlay.

    // Close modal when clicking the background overlay
    window.addEventListener('click', (event) => {
        if (event.target === authModal) {
            hideModal(authModal);
        }
        if (event.target === quizModal) {
            hideModal(quizModal);
             // TODO: Add logic to reset quiz state if closed mid-quiz
        }
    });

    // Add event listener for close buttons inside modals (using event delegation)
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('close-modal')) {
            const modal = event.target.closest('.modal');
            if (modal) {
                hideModal(modal);
                 if (modal.id === 'quiz-modal') {
                     // TODO: Add logic to reset quiz state if closed mid-quiz
                 }
            }
        }
    });


    // --- Content Loading Function ---

    // Function to load content into the main area based on the module name
    function loadContent(moduleName) {
        console.log(`Attempting to load module: ${moduleName}`);

        // Get module data from the imported 'modules' object
        const moduleData = modules[moduleName];

        if (moduleData) {
            // Set the HTML content from the module data
            contentArea.innerHTML = moduleData.html;
            console.log(`Content for ${moduleName} loaded into the DOM.`);

            // After loading content, check for and attach event listeners to any quiz buttons
            // This needs to be done *after* the new content is added to the DOM
            if (moduleName !== 'home' && moduleName !== 'profile' && moduleData.quiz) {
                 const quizButton = contentArea.querySelector('.start-quiz');
                 if (quizButton) {
                     console.log(`Found quiz button for ${moduleName}. Attaching listener.`);
                     // Use a data attribute to pass the module name to the handler
                     quizButton.setAttribute('data-quiz-module', moduleName);
                     quizButton.addEventListener('click', handleQuizButtonClick);
                 } else {
                     console.log(`No quiz button found for ${moduleName} or module has no quiz data.`);
                 }
             } else if (moduleName === 'profile') {
                 // TODO: Add logic here to load and display user progress/scores on the profile page
                 console.log('Profile module loaded. Implement logic to show user data.');
                 displayUserProfile(); // Call a function to populate profile data
             }


            // TODO: Add logic here to initialize other interactive elements within the loaded content
            // For example, if a module has interactive diagrams or exercises, you would
            // find those elements here and attach their event listeners after innerHTML is set.

        } else {
            // Handle unknown module
            contentArea.innerHTML = `
                <h2>Module Not Found</h2>
                <p>The requested learning module could not be loaded.</p>
                <p>Please use the navigation bar to select a valid module.</p>
            `;
            console.warn(`Unknown module requested: ${moduleName}`);
        }
    }

    // --- Quiz Logic ---

    // Function to handle quiz button clicks
    function handleQuizButtonClick(event) {
        // Get the module name from the data attribute
        const moduleName = event.target.getAttribute('data-quiz-module');
        console.log(`Quiz button clicked for module: ${moduleName}`);

        const moduleData = modules[moduleName];

        if (moduleData && moduleData.quiz && quizModal) {
            const quizQuestions = moduleData.quiz;
            const modalContentArea = quizModal.querySelector('.modal-content'); // Assuming you have a div with class 'modal-content' inside #quiz-modal

            if (modalContentArea) {
                // Clear previous quiz content
                modalContentArea.innerHTML = '';

                // Add quiz title and questions
                let quizHtml = `<h3>${moduleData.title} Quiz</h3>`;
                quizQuestions.forEach((q, index) => {
                    quizHtml += `
                        <div class="quiz-question">
                            <p>${index + 1}. ${q.question}</p>
                            <div class="quiz-options">
                                ${q.options.map((option, optIndex) => `
                                    <label>
                                        <input type="radio" name="question-${index}" value="${option}">
                                        ${option}
                                    </label><br>
                                `).join('')}
                            </div>
                        </div>
                    `;
                });

                // Add a submit button and a close button
                quizHtml += `<button class="submit-quiz" data-quiz-module="${moduleName}">Submit Quiz</button>`;
                quizHtml += `<button class="close-modal" style="margin-left: 10px;">Close</button>`; // Added margin for spacing

                modalContentArea.innerHTML = quizHtml;

                // Add event listener for the submit button (using event delegation or direct)
                const submitButton = modalContentArea.querySelector('.submit-quiz');
                if (submitButton) {
                     submitButton.addEventListener('click', handleSubmitQuiz);
                }


                showModal(quizModal); // Show the quiz modal

            } else {
                console.error('Modal content area (.modal-content) not found inside #quiz-modal.');
                alert(`Quiz feature for ${moduleName} is not yet fully implemented.\n\nCould not find modal content area.`); // Fallback alert
            }
        } else {
            console.warn(`No quiz data found for module: ${moduleName}`);
            alert(`Quiz for ${moduleName} is not available yet.`);
        }
    }

    // Function to handle quiz submission (Placeholder)
    function handleSubmitQuiz(event) {
        const moduleName = event.target.getAttribute('data-quiz-module');
        console.log(`Quiz submitted for module: ${moduleName}`);

        const quizQuestions = modules[moduleName].quiz;
        let score = 0;
        const totalQuestions = quizQuestions.length;
        const answers = {}; // To store user's selected answers

        // Get selected answers
        quizQuestions.forEach((q, index) => {
            const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
            if (selectedOption) {
                answers[`question-${index}`] = selectedOption.value;
                // Check if the answer is correct
                if (selectedOption.value === q.answer) {
                    score++;
                }
            }
        });

        console.log(`User answers:`, answers);
        console.log(`Score: ${score}/${totalQuestions}`);

        // ==============================================================
        // TODO: IMPLEMENT QUIZ RESULT DISPLAY AND POTENTIALLY SAVE SCORE
        // 1. Display the score to the user (e.g., in the modal or a new section).
        // 2. Provide feedback on correct/incorrect answers.
        // 3. Potentially save the score (requires IndexedDB or a backend).
        // 4. Offer an option to retry the quiz or close the modal.
        // ==============================================================

        // Placeholder: Display score in the modal
        const modalContentArea = quizModal.querySelector('.modal-content');
        if (modalContentArea) {
            modalContentArea.innerHTML = `
                <h3>Quiz Results for ${modules[moduleName].title}</h3>
                <p>You scored: ${score} out of ${totalQuestions}</p>
                <h4>Review Answers:</h4>
                 ${quizQuestions.map((q, index) => {
                     const userAnswer = answers[`question-${index}`] || 'No answer selected';
                     const isCorrect = userAnswer === q.answer;
                     const resultClass = isCorrect ? 'correct-answer' : 'incorrect-answer';
                     return `
                         <div class="quiz-review">
                             <p><strong>${index + 1}. ${q.question}</strong></p>
                             <p class="${resultClass}">Your Answer: ${userAnswer}</p>
                             ${!isCorrect ? `<p class="correct-answer">Correct Answer: ${q.answer}</p>` : ''}
                         </div>
                     `;
                 }).join('')}
                <button class="close-modal">Close</button>
                 <button class="retry-quiz" data-quiz-module="${moduleName}" style="margin-left: 10px;">Retry Quiz</button>
            `;

             // Add listener for retry button
             const retryButton = modalContentArea.querySelector('.retry-quiz');
             if(retryButton) {
                 retryButton.addEventListener('click', handleQuizButtonClick); // Call handleQuizButtonClick again to restart
             }

             // Close button listener is handled by the delegated listener on document.body
        }

        // TODO: Save score to IndexedDB or backend if implementing progress tracking
        // saveQuizScore(moduleName, score); // Example function call
    }

    // TODO: Function to display user profile data (requires data storage)
    function displayUserProfile() {
        console.log('Displaying user profile data...');
        // This function would fetch user data (e.g., from IndexedDB)
        // and populate the #completed-modules and #quiz-scores elements
        // on the profile page.

        // Example placeholder:
        // const completedModulesElement = document.getElementById('completed-modules');
        // const quizScoresElement = document.getElementById('quiz-scores');
        // if (completedModulesElement) completedModulesElement.textContent = 'Encryption, Compression'; // Example
        // if (quizScoresElement) quizScoresElement.innerHTML = '<p>Encryption: 3/3</p><p>Compression: 2/3</p>'; // Example
    }


    // --- Navigation Setup ---

    // Add event listeners to all navigation buttons in the header's nav
    const navButtons = document.querySelectorAll('header nav button');
    console.log(`Found ${navButtons.length} navigation buttons in the header.`);

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const moduleName = button.getAttribute('data-module');
            if (moduleName && modules[moduleName]) { // Check if module exists in our data
                console.log(`Navigation button clicked: ${moduleName}`);
                loadContent(moduleName); // Load the content for the clicked module

                // Optional: Update active state of nav buttons for visual feedback
                navButtons.forEach(btn => btn.classList.remove('active')); // Remove active class from all buttons
                button.classList.add('active'); // Add active class to the clicked button
            } else {
                console.warn('Navigation button missing data-module attribute or module not found in data:', button, moduleName);
                // Optionally load a 'not found' message
                 loadContent('notfound'); // You could add a 'notfound' case to modules.js
            }
        });
    });

    // Initial load: Load the 'home' module content when the page first loads
    loadContent('home');
    // Optional: Set the home button as active initially
    const homeButton = document.querySelector('button[data-module="home"]');
    if(homeButton) {
        homeButton.classList.add('active');
    }

    // ==============================================================
    // TODO: ADD LOGIC FOR AUTH MODAL HERE
    // This section would handle the display and interaction of your
    // #auth-modal element.
    //
    // Example: Add a login button somewhere that calls showModal(authModal)
    // const loginButton = document.getElementById('login-button'); // Assuming you have this button
    // if (loginButton) {
    //     loginButton.addEventListener('click', () => showModal(authModal));
    // }
    //
    // Implement logic to handle login/registration form submissions inside the modal.
    // This would involve getting form data, potentially hashing passwords (if registering),
    // and interacting with IndexedDB or a backend for authentication and user data storage.
    // ==============================================================


    console.log('main.js initialization complete.');
});

// NOTE ABOUT IndexedDB or Backend:
// To save quiz scores or track user progress persistently, you will need
// a storage mechanism. IndexedDB is a browser-based database suitable
// for client-side storage. For multi-device access or more robust
// user management, a backend server and database would be necessary.
