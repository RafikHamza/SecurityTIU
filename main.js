// main.js
import { modules, getProgress, saveQuizScore, markModuleCompleted } from './modules.js';

const contentElement = document.getElementById('content');
const navButtons = document.querySelectorAll('nav button');
const quizModal = document.getElementById('quiz-modal');
const quizModalContent = quizModal.querySelector('.modal-content');
const closeModalButton = quizModal.querySelector('.close-modal');
const notificationElement = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
const closeNotificationButton = document.getElementById('close-notification');

let currentPseudoid = localStorage.getItem('currentPseudoid');

// --- Notification Functions ---
export function showNotification(message, type = 'success') {
    notificationMessage.textContent = message;
    notificationElement.className = `notification ${type}`; // Sets class for styling (e.g., 'success', 'error', 'warning')
    notificationElement.classList.add('show');

    // Auto-hide after a few seconds
    setTimeout(() => {
        hideNotification();
    }, 5000); // Hide after 5 seconds
}

function hideNotification() {
    notificationElement.classList.remove('show');
}

if (closeNotificationButton) {
    closeNotificationButton.addEventListener('click', hideNotification);
}

// --- Quiz Modal Functions ---
function showQuiz(moduleKey, quizData) {
     currentPseudoid = localStorage.getItem('currentPseudoid'); // Ensure we have the latest pseudoid

    if (!currentPseudoid) {
        showNotification('Please register or log in with a pseudoid to take quizzes.', 'warning');
        return;
    }

    let quizHtml = `<h3>${modules[moduleKey].title} Quiz</h3><form id="quiz-form">`;
    quizData.forEach((q, index) => {
        quizHtml += `
            <div class="quiz-question">
                <p>${index + 1}. ${q.question}</p>
                ${q.options.map((option, i) => `
                    <label>
                        <input type="radio" name="q${index}" value="${option}">
                        ${option}
                    </label><br>
                `).join('')}
            </div>
        `;
    });
    quizHtml += `<button type="submit">Submit Quiz</button></form>`;

    quizModalContent.innerHTML = quizHtml + quizModalContent.innerHTML; // Add quiz above the close button
    quizModal.classList.add('show');

    const quizForm = quizModalContent.querySelector('#quiz-form');
    if (quizForm) {
        quizForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            let score = 0;
            const totalQuestions = quizData.length;

            quizData.forEach((q, index) => {
                const selectedOption = quizForm.querySelector(`input[name="q${index}"]:checked`);
                if (selectedOption && selectedOption.value === q.answer) {
                    score++;
                }
            });

            // Disable the submit button and inputs after submission
            quizForm.querySelector('button[type="submit"]').disabled = true;
             quizForm.querySelectorAll('input[type="radio"]').forEach(input => input.disabled = true);


            // Save the score
            await saveQuizScore(currentPseudoid, moduleKey, score, totalQuestions)
                .then(userData => {
                     const percentage = ((score / totalQuestions) * 100).toFixed(1);
                     const passed = userData.quizScores[moduleKey].passed;

                    // Display result in the modal
                    const resultsHtml = `
                        <div class="quiz-results">
                            <h4>Quiz Results</h4>
                            <p>Your score: ${score} out of ${totalQuestions} (${percentage}%)</p>
                            <p>${passed ? '<span style="color: green;">You Passed!</span>' : '<span style="color: red;">You Did Not Pass. Try again!</span>'}</p>
                            ${passed ? `<p>This module is now marked as completed on your profile.</p>` : ''}
                        </div>
                    `;
                    quizForm.insertAdjacentHTML('afterend', resultsHtml); // Add results after the form

                     // Update the state of the mark completed button in the module's HTML if visible
                     const currentModuleButtons = contentElement.querySelectorAll(`[data-module="${moduleKey}"].mark-completed`);
                     currentModuleButtons.forEach(button => {
                          const quizPassed = userData?.quizScores?.[moduleKey]?.passed === true;
                          const moduleCompleted = userData?.completedModules?.includes(moduleKey);
                          button.disabled = !quizPassed || moduleCompleted;
                          button.textContent = moduleCompleted ? 'Completed ✓' : (quizPassed ? 'Mark as Completed' : 'Pass Quiz to Complete');
                           if (moduleCompleted) {
                             button.classList.add('completed');
                         } else {
                             button.classList.remove('completed');
                         }
                     });

                     // Update the quiz score display in the module's HTML if visible
                     const currentModuleScoreDisplay = contentElement.querySelector(`#quiz-score-display-${moduleKey}`);
                      if (currentModuleScoreDisplay) {
                           currentModuleScoreDisplay.innerHTML = `Your last score: ${score}/${totalQuestions} (${percentage}%) - ${passed ? '<span style="color: green;">Passed</span>' : '<span style="color: red;">Failed</span>')`;
                      }


                    showNotification(`Quiz completed: ${score}/${totalQuestions} (${percentage}%)`, passed ? 'success' : 'warning');

                })
                .catch(error => {
                    console.error('Error saving quiz score:', error);
                    showNotification('Error saving your quiz score.', 'error');
                });
        });
    }
}

function hideQuiz() {
    quizModal.classList.remove('show');
     // Clear quiz content except the close button
    const closeBtnHtml = quizModalContent.querySelector('.close-modal').outerHTML;
    quizModalContent.innerHTML = closeBtnHtml;
}

if (closeModalButton) {
    closeModalButton.addEventListener('click', hideQuiz);
}


// --- Module Loading Function ---
function loadModule(moduleKey) {
    const module = modules[moduleKey];

    if (!module) {
        console.error(`Module not found: ${moduleKey}`);
        contentElement.innerHTML = `<h2>Error</h2><p>Module "${moduleKey}" not found.</p>`;
        document.title = 'Error - Digital Privacy and Data Security Hub';
        return;
    }

    // Set main content HTML
    contentElement.innerHTML = module.html;

    // Update page title
    document.title = `${module.title} - Digital Privacy and Data Security Hub`;

    // Call the module's init function if it exists
    if (module.init && typeof module.init === 'function') {
        module.init(contentElement);
    }

     // Add event listener for the Start Quiz button if it exists in the loaded module
     const startQuizButton = contentElement.querySelector('.start-quiz');
     if (startQuizButton && module.quiz) {
         const quizModuleKey = startQuizButton.getAttribute('data-quiz-module');
         startQuizButton.addEventListener('click', () => {
            showQuiz(quizModuleKey, module.quiz);
         });
          // Disable quiz button if no pseudoid is set
         if (!localStorage.getItem('currentPseudoid')) {
              startQuizButton.disabled = true;
               if (typeof showNotification !== 'undefined') {
                   // Briefly show instruction if they click the disabled button
                  startQuizButton.addEventListener('click', () => {
                     showNotification('Please register or log in with a pseudoid to take quizzes.', 'warning');
                  }, { once: true }); // Only show the notification once per click attempt
              }
         } else {
              startQuizButton.disabled = false;
         }
     }

     // Note: Mark Completed button listeners are handled within each module's init
}

// --- Initial Load and Navigation ---

// Add event listeners to navigation buttons
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const moduleKey = button.getAttribute('data-module');
        if (moduleKey) {
            loadModule(moduleKey);
            // Optional: Update active state on buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        }
    });
});

// Load the default module on page load (e.g., 'home')
loadModule('home');
document.querySelector('button[data-module="home"]').classList.add('active'); // Mark home as active initially

// Make showNotification available globally for module inits (less ideal but works)
// A better approach might be to pass showNotification as an argument to module.init
window.showNotification = showNotification;
