// main.js

// Import the modules data from modules.js
import { modules } from './modules.js';
// Import functions from auth.js if main.js needs to call them (e.g., showAuthModal)
// import { showAuthModal } from './auth.js'; // Uncomment if main.js needs to trigger auth modal


document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Get main elements
    const contentArea = document.getElementById('content');
    const quizModal = document.getElementById('quiz-modal');
    // authModal is now primarily managed by auth.js, main.js doesn't need a direct reference here
    // const authModal = document.getElementById('auth-modal');


    // Check if essential elements exist
    if (!contentArea) {
        console.error('Content area with id="content" not found. Cannot proceed.');
        return;
    }
    if (!quizModal) {
        console.warn('Quiz modal with id="quiz-modal" not found. Quiz feature will be limited.');
        // Continue execution, but quiz functionality will be broken without the modal
    }
     // authModal check is now done in auth.js


    // --- Modal Functions (Basic show/hide for quiz modal) ---

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
    // This uses event delegation on the body for elements with the class 'close-modal' or clicking the modal overlay
    document.body.addEventListener('click', (event) => {
        // Close modal when clicking the background overlay
        if (event.target.classList.contains('modal') && (event.target.id === 'quiz-modal' || event.target.id === 'auth-modal')) {
             hideModal(event.target);
             if (event.target.id === 'quiz-modal') {
                 // TODO: Add logic to reset quiz state if closed mid-quiz
             }
             // Auth modal closing logic is also handled here
        }

        // Close modal when clicking a button with class 'close-modal'
        if (event.target.classList.contains('close-modal')) {
            const modal = event.target.closest('.modal');
            if (modal) {
                hideModal(modal);
                 if (modal.id === 'quiz-modal') {
                     // TODO: Add logic to reset quiz state if closed mid-quiz
                 }
                 // Auth modal closing logic is also handled here
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

            // --- IMPORTANT: Initialize Module Specific Scripts ---
            // If the module data has an 'init' function, call it after loading the HTML.
            // This is crucial for modules with interactive elements like the slideshow.
            if (typeof moduleData.init === 'function') {
                console.log(`Calling init function for module: ${moduleName}`);
                moduleData.init(contentArea); // Pass the content area element if needed by init
            }
             // --- End Module Specific Scripts Initialization ---


            // After loading content, check for and attach event listeners to any quiz buttons
            // This needs to be done *after* the new content is added to the DOM
            if (moduleData.quiz && moduleName !== 'profile') { // Only add quiz button listener if quiz data exists and not on profile page
                 const quizButton = contentArea.querySelector('.start-quiz');
                 if (quizButton) {
                     console.log(`Found quiz button for ${moduleName}. Attaching listener.`);
                     // Use a data attribute to pass the module name to the handler
                     quizButton.setAttribute('data-quiz-module', moduleName);
                     quizButton.addEventListener('click', handleQuizButtonClick);
                 } else {
                     console.log(`Quiz data exists for ${moduleName}, but no .start-quiz button found.`);
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
            // Handle unknown module - load the notfound module if it exists
            if (modules['notfound']) {
                 contentArea.innerHTML = modules['notfound'].html;
                 console.warn(`Unknown module requested: ${moduleName}. Loaded notfound module.`);
            } else {
                // Fallback if notfound module doesn't exist
                contentArea.innerHTML = `
                    <h2>Module Not Found</h2>
                    <p>The requested learning module could not be loaded.</p>
                    <p>Please use the navigation bar to select a valid module.</p>
                `;
                console.error(`Unknown module requested: ${moduleName}. 'notfound' module also not defined.`);
            }
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
                            <p><strong>${index + 1}. ${q.question}</strong></p>
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
                // Close button is handled by the delegated listener on document.body

                modalContentArea.innerHTML = quizHtml;

                // Add event listener for the submit button (using event delegation or direct)
                const submitButton = modalContentArea.querySelector('.submit-quiz');
                if (submitButton) {
                     submitButton.addEventListener('click', handleSubmitQuiz);
                }

                // Need to re-add the close button inside the modal content after clearing it
                 const closeButtonHtml = `<button class="close-modal" style="margin-top: 15px; margin-left: 10px;">Close</button>`;
                 modalContentArea.insertAdjacentHTML('beforeend', closeButtonHtml);


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
                 loadContent('notfound'); // Load the 'notfound' module if the requested one doesn't exist
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

    // NOTE: Authentication modal triggering is now handled by auth.js
    // The login button listener is in auth.js
    // If main.js needed to trigger it (e.g., showAuthModal() on profile page if not logged in),
    // you would uncomment the import and call the function here.


    console.log('main.js initialization complete.');
});

// NOTE ABOUT IndexedDB or Backend:
// To save quiz scores or track user progress persistently, you will need
// a storage mechanism. IndexedDB is a browser-based database suitable
// for client-side storage. For multi-device access or more robust
// user management, a backend server and database would be necessary.
