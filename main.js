// main.js
import * as auth from './auth.js';
// Import the modules data from modules.js
import { modules } from './modules.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Get main elements
    const contentArea = document.getElementById('content');
    const authModal = document.getElementById('auth-modal');
    const quizModal = document.getElementById('quiz-modal');

    // Check if essential elements exist
    if (!contentArea) {
        console.error('Content area with id="content" not found. Cannot proceed.');
        return;
    }
    if (!quizModal) {
        console.warn('Quiz modal with id="quiz-modal" not found. Quiz feature will be limited.');
    }
    if (!authModal) {
        console.warn('Auth modal with id="auth-modal" not found. Authentication feature will be limited.');
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
            console.log(`${modalElement.id} hidden.`);
        }
    }

    // Close modal when clicking the background overlay
    window.addEventListener('click', (event) => {
        if (event.target === authModal) {
            hideModal(authModal);
        }
        if (event.target === quizModal) {
            hideModal(quizModal);
        }
    });

    // Add event listener for close buttons inside modals (using event delegation)
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('close-modal')) {
            const modal = event.target.closest('.modal');
            if (modal) {
                hideModal(modal);
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
            
            // Initialize module-specific functionality if it exists
            if (moduleData.init && typeof moduleData.init === 'function') {
                moduleData.init(contentArea);
            }

            // After loading content, check for and attach event listeners to any quiz buttons
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
                console.log('Profile module loaded. Implementing logic to show user data.');
                displayUserProfile(); // Call a function to populate profile data
            }
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
            const modalContentArea = quizModal.querySelector('.modal-content');
    
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
                quizHtml += `<button class="close-modal" style="margin-left: 10px;">Close</button>`;

                modalContentArea.innerHTML = quizHtml;

                // Add event listener for the submit button
                const submitButton = modalContentArea.querySelector('.submit-quiz');
                if (submitButton) {
                    submitButton.addEventListener('click', handleSubmitQuiz);
                }

                showModal(quizModal); // Show the quiz modal
            } else {
                console.error('Modal content area (.modal-content) not found inside #quiz-modal.');
                alert(`Quiz feature for ${moduleName} is not yet fully implemented.\n\nCould not find modal content area.`);
            }
        } else {
            console.warn(`No quiz data found for module: ${moduleName}`);
            alert(`Quiz for ${moduleName} is not available yet.`);
        }
    }

    // Function to handle quiz submission
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

        // Save progress if user is logged in
        if (auth.isLoggedIn()) {
            auth.saveQuizScore(moduleName, score, totalQuestions);
            auth.saveProgress(moduleName, true); // Mark module as completed
        }

        // Display score in the modal
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
        }
    }

    // Function to display user profile data
    function displayUserProfile() {
        if (!auth.isLoggedIn()) {
            contentArea.innerHTML = `
                <h2>My Progress</h2>
                <p>Please log in to view your progress.</p>
                <button id="profile-login">Login</button>
            `;
            document.getElementById('profile-login').addEventListener('click', () => {
                showModal(authModal);
                setupAuthForm();
            });
            return;
        }
        
        const username = auth.getCurrentUser();
        const progress = auth.getUserProgress();
        const scores = auth.getUserScores();
        
        let completedModules = Object.keys(progress).filter(module => progress[module]);
        let completedHtml = completedModules.length > 0 ? 
            completedModules.map(module => modules[module]?.title || module).join(', ') : 
            'None yet.';
        
        let scoresHtml = '';
        if (Object.keys(scores).length > 0) {
            scoresHtml = Object.keys(scores).map(module => {
                const scoreData = scores[module];
                return `<p>${modules[module]?.title || module}: ${scoreData.score}/${scoreData.totalQuestions}</p>`;
            }).join('');
        } else {
            scoresHtml = 'No scores recorded.';
        }
        
        contentArea.querySelector('#completed-modules').innerHTML = completedHtml;
        contentArea.querySelector('#quiz-scores').innerHTML = scoresHtml;
        
        // Add logout button
        const logoutSection = document.createElement('section');
        logoutSection.className = 'module-section';
        logoutSection.innerHTML = `
            <h3>Account</h3>
            <p>Logged in as: <strong>${username}</strong></p>
            <button id="logout-button">Logout</button>
        `;
        contentArea.appendChild(logoutSection);
        
        document.getElementById('logout-button').addEventListener('click', () => {
            auth.logout();
            loginButton.textContent = 'Login';
            loadContent('home');
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            const homeButton = document.querySelector('button[data-module="home"]');
            if (homeButton) homeButton.classList.add('active');
        });
    }

    // --- Authentication Logic ---

    function setupAuthForm() {
        const authTitle = document.getElementById('auth-title');
        const authForm = document.getElementById('auth-form');
        const authSubmit = document.getElementById('auth-submit');
        const authSwitch = document.getElementById('switch-form');
        const authMessage = document.getElementById('auth-message');
        
        let isLoginMode = true;
        
        // Setup the form mode toggle
        authSwitch.addEventListener('click', (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            authTitle.textContent = isLoginMode ? 'Login' : 'Register';
            authSubmit.textContent = isLoginMode ? 'Login' : 'Register';
            authSwitch.parentElement.innerHTML = isLoginMode ? 
                'Don\'t have an account? <a href="#" id="switch-form">Register</a>' : 
                'Already have an account? <a href="#" id="switch-form">Login</a>';
            
            // Re-attach event listener to the new link
            document.getElementById('switch-form').addEventListener('click', (e) => {
                e.preventDefault();
                setupAuthForm();
            });
            
            authMessage.textContent = '';
        });
        
        // Handle form submission
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            let result;
            if (isLoginMode) {
                result = auth.login(username, password);
            } else {
                result = auth.register(username, password);
            }
            
            if (result.success) {
                hideModal(authModal);
                loginButton.textContent = 'My Account';
                loadContent('profile');
                // Update active nav button
                navButtons.forEach(btn => btn.classList.remove('active'));
                const profileButton = document.querySelector('button[data-module="profile"]');
                if (profileButton) profileButton.classList.add('active');
            } else {
                authMessage.textContent = result.message;
                authMessage.className = 'message error';
            }
        });
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

                // Update active state of nav buttons for visual feedback
                navButtons.forEach(btn => btn.classList.remove('active')); // Remove active class from all buttons
                button.classList.add('active'); // Add active class to the clicked button
            } else {
                console.warn('Navigation button missing data-module attribute or module not found in data:', button, moduleName);
                // Load a 'not found' message
                loadContent('notfound');
            }
        });
    });

    // Add login button to header
    const loginButton = document.createElement('button');
    loginButton.textContent = auth.isLoggedIn() ? 'My Account' : 'Login';
    loginButton.id = 'login-button';
    loginButton.classList.add('login-button');
    document.querySelector('header').appendChild(loginButton);

    loginButton.addEventListener('click', () => {
        if (auth.isLoggedIn()) {
            // Go to profile page
            loadContent('profile');
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            const profileButton = document.querySelector('button[data-module="profile"]');
            if (profileButton) profileButton.classList.add('active');
        } else {
            showModal(authModal);
            setupAuthForm();
        }
    });

    // Initial load: Load the 'home' module content when the page first loads
    loadContent('home');
    // Set the home button as active initially
    const homeButton = document.querySelector('button[data-module="home"]');
    if(homeButton) {
        homeButton.classList.add('active');
    }

    console.log('main.js initialization complete.');
});
