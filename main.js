// main.js

// Import the modules data from modules.js
import { modules } from './modules.js';

// --- IndexedDB Setup and Functions ---
const DB_NAME = 'LearningHubDB';
const DB_VERSION = 1;
const STORE_NAME = 'userProgress';

let db;

// Function to open the IndexedDB database
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            // This runs if the database is new or the version is updated
            db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'pseudoid' });
                console.log(`IndexedDB object store '${STORE_NAME}' created.`);
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('IndexedDB opened successfully.');
            resolve(db);
        };

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Function to load user progress from IndexedDB
async function loadProgressFromDB(pseudoid) {
    if (!db) {
        console.warn('IndexedDB not open. Attempting to open...');
        try {
            await openDatabase();
        } catch (error) {
            console.error('Failed to open DB for loading:', error);
            return null;
        }
    }

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(pseudoid);

        request.onsuccess = (event) => {
            console.log(`IndexedDB load success for ${pseudoid}:`, event.target.result);
            resolve(event.target.result); // Returns the progress object or undefined
        };

        request.onerror = (event) => {
            console.error(`IndexedDB load error for ${pseudoid}:`, event.target.error);
            reject(event.target.error);
        };
    });
}

// Function to save user progress to IndexedDB
async function saveProgressToDB(pseudoid, progressData) {
     if (!db) {
        console.warn('IndexedDB not open. Attempting to open...');
         try {
            await openDatabase();
        } catch (error) {
            console.error('Failed to open DB for saving:', error);
            return;
        }
    }

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        // Add the pseudoid to the progress data before saving
        progressData.pseudoid = pseudoid;

        const request = store.put(progressData); // Use put() to add or update

        request.onsuccess = () => {
            console.log(`IndexedDB save success for ${pseudoid}.`);
            resolve();
        };

        request.onerror = (event) => {
            console.error(`IndexedDB save error for ${pseudoid}:`, event.target.error);
            reject(event.target.error);
        };
    });
}

// --- Global State (to hold current pseudoid) ---
let currentPseudoid = null;

// Function to set the current pseudoid
function setCurrentPseudoid(pseudoid) {
    currentPseudoid = pseudoid;
    console.log('Current Pseudoid set:', currentPseudoid);
    // You might also update UI elements here or save to sessionStorage
    // to persist across page reloads within a session.
    if (pseudoid) {
        sessionStorage.setItem('currentPseudoid', pseudoid);
    } else {
        sessionStorage.removeItem('currentPseudoid');
    }
}

// Function to get the current pseudoid
function getCurrentPseudoid() {
    // Check session storage first, then the global variable
    return sessionStorage.getItem('currentPseudoid') || currentPseudoid;
}


// --- Main Application Logic ---

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded and parsed');

    // Open the database when the DOM is ready
    try {
        await openDatabase();
        console.log('Database ready.');
         // Attempt to load pseudoid from session storage on load
         const savedPseudoid = sessionStorage.getItem('currentPseudoid');
         if (savedPseudoid) {
             setCurrentPseudoid(savedPseudoid);
             console.log('Loaded pseudoid from session storage:', savedPseudoid);
             // You might want to automatically load the profile page or display a message
             // indicating the user is "logged in" with this pseudoid.
         }

    } catch (error) {
        console.error('Failed to initialize database:', error);
        alert('Failed to open the progress database. Progress tracking will not work.');
    }


    // Get main content area and quiz modal
    const contentArea = document.getElementById('content');
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
        // Only check for quiz-modal now, as auth-modal is removed
        if (event.target.classList.contains('modal') && event.target.id === 'quiz-modal') {
             hideModal(event.target);
             // TODO: Add logic to reset quiz state if closed mid-quiz
        }

        // Close modal when clicking a button with class 'close-modal'
        if (event.target.classList.contains('close-modal')) {
            const modal = event.target.closest('.modal');
            // Only check for quiz-modal now, as auth-modal is removed
            if (modal && modal.id === 'quiz-modal') {
                hideModal(modal);
                // TODO: Add logic to reset quiz state if closed mid-quiz
            }
             // If you add a close button to the profile page itself, this might trigger unexpectedly.
             // Consider making modal close buttons more specific (e.g., .modal .close-button)
             // or adding checks here if needed.
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
            // This is crucial for modules with interactive elements like the slideshow or profile page.
            if (typeof moduleData.init === 'function') {
                console.log(`Calling init function for module: ${moduleName}`);
                // Pass the content area and the IndexedDB functions to the profile init
                if (moduleName === 'profile') {
                    moduleData.init(contentArea, {
                        loadProgressFromDB: loadProgressFromDB,
                        saveProgressToDB: saveProgressToDB,
                        setCurrentPseudoid: setCurrentPseudoid, // Pass the setter
                        getCurrentPseudoid: getCurrentPseudoid // Pass the getter
                    });
                } else {
                    moduleData.init(contentArea); // Other modules just need the content area
                }
            }
             // --- End Module Specific Scripts Initialization ---


            // After loading content, check for and attach event listeners to any quiz buttons
            // This needs to be done *after* the new content is added to the DOM
            // Check if quiz data exists and if the module is not the profile page
            if (moduleData.quiz && moduleName !== 'profile') {
                 const quizButton = contentArea.querySelector('.start-quiz');
                 if (quizButton) {
                     console.log(`Found quiz button for ${moduleName}. Attaching listener.`);
                     // Use a data attribute to pass the module name to the handler
                     quizButton.setAttribute('data-quiz-module', moduleName);
                     quizButton.addEventListener('click', handleQuizButtonClick);
                 } else {
                     console.log(`Quiz data exists for ${moduleName}, but no .start-quiz button found.`);
                 }
             }
             // Profile page initialization is handled by its moduleData.init function now


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
        const currentId = getCurrentPseudoid();
        if (!currentId) {
            alert('Please enter your Pseudoid on the "My Progress" page first to track quiz scores.');
            // Optionally redirect to the profile page or show the pseudoid input modal
            loadContent('profile');
            // Find the pseudoid input and highlight it?
            const pseudoidInput = contentArea.querySelector('#pseudoid-input');
            if(pseudoidInput) {
                pseudoidInput.focus();
                pseudoidInput.style.border = '2px solid red';
                setTimeout(() => pseudoidInput.style.border = '', 2000); // Remove highlight after 2 seconds
            }
            return; // Stop here if no pseudoid is set
        }

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
    async function handleSubmitQuiz(event) {
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
        // 3. Potentially save the score (requires localStorage using the pseudoid).
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

        // --- Save score to IndexedDB ---
        const currentId = getCurrentPseudoid();
         if (currentId) {
             console.log(`Saving quiz score for ${currentId} - ${moduleName}: ${score}/${totalQuestions}`);
             // Load existing progress first to update it
             const progress = await loadProgressFromDB(currentId) || { pseudoid: currentId, completedModules: [], quizScores: {} };

             // Update quiz score for this module
             progress.quizScores[moduleName] = { score: score, total: totalQuestions };

             // TODO: Add logic to mark modules as completed, perhaps after a certain quiz score threshold?
             // Example: if (score / totalQuestions > 0.8 && !progress.completedModules.includes(moduleName)) {
             //     progress.completedModules.push(moduleName);
             // }

             await saveProgressToDB(currentId, progress);
             console.log('Quiz score saved to IndexedDB.');
         } else {
             console.warn('No Pseudoid set. Quiz score not saved.');
             alert('Quiz finished, but score was not saved because no Pseudoid is set.');
         }
        // --- End Save score to IndexedDB ---
    }

    // TODO: Function to display user profile data (requires data storage)
    // This logic is now primarily handled within the profile module's init function
    function displayUserProfile() {
        console.log('displayUserProfile function called in main.js - logic is now in modules.js profile init.');
        // The actual display logic is in modules.js -> profile -> init
        // This function might be used if main.js needed to trigger a profile data refresh
        // from outside the profile module itself.
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
                // Optionally load a 'not found' module if the requested one doesn't exist
                 loadContent('notfound');
            }
        });
    });

    // Initial load: Load the 'home' module content when the page first loads
    loadContent('home');
    // Optional: Set the home button as active initially
    const homeButton = document.querySelector('button[data-module="home']');
    if(homeButton) {
        homeButton.classList.add('active');
    }


    console.log('main.js initialization complete.');
});

// NOTE ABOUT IndexedDB or Backend:
// Using IndexedDB for progress tracking is browser-based. Data is stored locally
// in the user's browser. It can be cleared by the user and won't sync across devices.
// For a more robust solution, a backend server and database would be necessary.
