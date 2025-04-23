// modules.js

// This file stores the content and data for each learning module.
// Export an object where keys are module names (matching data-module attributes)
// and values contain the HTML content, quiz questions, and initialization logic.

// --- IndexedDB Setup and Helper Functions ---
const DB_NAME = 'ProgressDB';
const DB_VERSION = 1;
const STORE_NAME = 'users';

let db;

// Function to open the IndexedDB database
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            // Create the object store if it doesn't exist
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'pseudoid' });
                // You might want to create indexes later if needed for queries
                // objectStore.createIndex('lastAccessed', 'lastAccessed', { unique: false });
                console.log(`IndexedDB object store "${STORE_NAME}" created.`);
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('IndexedDB database opened successfully.');
            resolve(db);
        };

        request.onerror = (event) => {
            console.error('IndexedDB database error:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Function to get progress data for a specific pseudoid
export function getProgress(pseudoid) {
    return new Promise((resolve, reject) => {
        if (!db) {
            // Attempt to open the DB if not already open
            openDatabase().then(() => getProgress(pseudoid).then(resolve).catch(reject)).catch(reject);
            return;
        }
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(pseudoid);

        request.onsuccess = (event) => {
            resolve(event.target.result); // Returns the user object or undefined
        };

        request.onerror = (event) => {
            console.error('Error getting progress:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Function to save or update progress data for a specific pseudoid
export function saveProgress(userData) {
    return new Promise((resolve, reject) => {
        if (!db) {
             // Attempt to open the DB if not already open
            openDatabase().then(() => saveProgress(userData).then(resolve).catch(reject)).catch(reject);
            return;
        }
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(userData); // Use put to add or update

        request.onsuccess = () => {
            console.log('Progress saved successfully.');
            resolve();
        };

        request.onerror = (event) => {
            console.error('Error saving progress:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Function to mark a module as completed for the current pseudoid
export function markModuleCompleted(pseudoid, moduleName) {
    return new Promise(async (resolve, reject) => {
        if (!pseudoid) {
            reject('No pseudoid provided.');
            return;
        }

        try {
            // Get the current progress data
            let userData = await getProgress(pseudoid);

            // If no data exists yet, create a new user record
            if (!userData) {
                userData = {
                    pseudoid: pseudoid,
                    completedModules: [],
                    quizScores: {},
                    lastAccessed: new Date().toISOString()
                };
                 console.log(`New user record created for pseudoid '${pseudoid}'`);
            }

            // Add the module to completedModules if not already there
            if (!userData.completedModules) {
                userData.completedModules = [];
            }

            if (!userData.completedModules.includes(moduleName)) {
                userData.completedModules.push(moduleName);
                userData.lastAccessed = new Date().toISOString();

                // Save the updated data
                await saveProgress(userData);
                console.log(`Module '${moduleName}' marked as completed for pseudoid '${pseudoid}'`);
            } else {
                 console.log(`Module '${moduleName}' already completed for pseudoid '${pseudoid}'`);
            }

            resolve(userData);
        } catch (error) {
            console.error('Error marking module as completed:', error);
            reject(error);
        }
    });
}

// Function to save quiz score for a specific pseudoid and module
export function saveQuizScore(pseudoid, moduleKey, score, total) {
    return new Promise(async (resolve, reject) => {
        if (!pseudoid) {
            reject('No pseudoid provided.');
            return;
        }

        try {
            // Get current progress data
            let userData = await getProgress(pseudoid);

            // If no data exists yet, create a new user record
            if (!userData) {
                 userData = {
                    pseudoid: pseudoid,
                    completedModules: [],
                    quizScores: {},
                    lastAccessed: new Date().toISOString()
                };
                 console.log(`New user record created for pseudoid '${pseudoid}' for quiz score.`);
            }

            // Make sure quizScores exists
            if (!userData.quizScores) {
                userData.quizScores = {};
            }

            // Add or update the quiz score
            const passingScore = Math.ceil(total * 0.7); // 70% passing
            const passed = score >= passingScore;

            userData.quizScores[moduleKey] = {
                score: score,
                total: total,
                percentage: ((score / total) * 100).toFixed(1),
                timestamp: new Date().toISOString(),
                passed: passed
            };

            userData.lastAccessed = new Date().toISOString();

            // If passed, add to completed modules if not already there
            if (passed && !userData.completedModules.includes(moduleKey)) {
                userData.completedModules.push(moduleKey);
                 console.log(`Quiz passed, module '${moduleKey}' marked as completed for pseudoid '${pseudoid}'`);
            }

            // Save the updated data
            await saveProgress(userData);
            console.log(`Quiz score for '${moduleKey}' saved for pseudoid '${pseudoid}': ${score}/${total} (Passed: ${passed})`);

            resolve(userData);
        } catch (error) {
            console.error('Error saving quiz score:', error);
            reject(error);
        }
    });
}


// Open the database when the script loads (asynchronously)
openDatabase().catch(error => console.error("Failed to open IndexedDB on load:", error));


// --- Module Definitions ---

export const modules = {
    home: {
        title: 'Welcome!',
        html: `
            <h2>Welcome to the Introduction to Digital Privacy and Data Security Hub!</h2>
            <p>Explore the fascinating world of data security and efficiency.</p>
            <section class="module-section">
                <h3>About This Hub</h3>
                <p>This platform is designed to help you learn about key concepts in data handling:</p>
                <ul>
                    <li><strong>Encryption:</strong> Securing your data from unauthorized access.</li>
                    <li><strong>Compression:</strong> Making your data smaller and more efficient.</li>
                    <li><strong>Hashing:</strong> Verifying data integrity.</li>
                </ul>
            </section>
            <section class="module-section">
                <h3>Get Started</h3>
                <p>Use the navigation bar above to dive into different topics. You can track your progress and test your knowledge with quizzes.</p>
                <div id="user-welcome">
                    <p>Loading user data...</p>
                </div>
                 <div id="pseudoid-prompt" style="display: none;">
                     <p>Please enter a unique pseudonym or ID to track your progress:</p>
                     <input type="text" id="pseudoid-input" placeholder="Enter your ID">
                     <button id="set-pseudoid-button">Set ID</button>
                     <p class="small-text">Your ID is stored locally in your browser and is not transmitted elsewhere.</p>
                 </div>
            </section>
            <section class="module-section">
                <h3>Latest Updates</h3>
                <p>Stay tuned for new modules and features!</p>
            </section>
        `,
        init: function(contentElement) {
            const userWelcomeDiv = contentElement.querySelector('#user-welcome');
            const pseudoidPromptDiv = contentElement.querySelector('#pseudoid-prompt');
            const pseudoidInput = contentElement.querySelector('#pseudoid-input');
            const setPseudoidButton = contentElement.querySelector('#set-pseudoid-button');

            const savedPseudoid = localStorage.getItem('currentPseudoid');

            if (savedPseudoid) {
                 pseudoidPromptDiv.style.display = 'none';
                 userWelcomeDiv.style.display = 'block';
                // Display personalized welcome message
                getProgress(savedPseudoid).then(userData => {
                    const totalModules = Object.keys(modules).length - 2; // Subtract home and profile
                    const completedCount = (userData && userData.completedModules) ? userData.completedModules.length : 0;

                    userWelcomeDiv.innerHTML = `
                        <div class="welcome-box">
                            <h4>Welcome back, Student ID: ${savedPseudoid}!</h4>
                            <p>You've completed ${completedCount} out of ${totalModules} learnable modules.</p>
                            <p><a href="#" id="view-progress-link">View your progress</a></p>
                        </div>
                    `;

                    // Add event listener to the view-progress link
                    const viewProgressLink = userWelcomeDiv.querySelector('#view-progress-link');
                    if (viewProgressLink) {
                        viewProgressLink.addEventListener('click', (event) => {
                            event.preventDefault();
                            // Simulate click on profile button
                            const profileButton = document.querySelector('button[data-module="profile"]');
                            if (profileButton) {
                                profileButton.click();
                            }
                        });
                    }
                }).catch(error => {
                    console.error('Error getting user data for home welcome:', error);
                    userWelcomeDiv.innerHTML = `<p>Error loading progress.</p>`;
                });
            } else {
                // No pseudoid found, prompt the user
                userWelcomeDiv.style.display = 'none';
                pseudoidPromptDiv.style.display = 'block';

                if (setPseudoidButton) {
                     setPseudoidButton.addEventListener('click', async () => {
                         const newPseudoid = pseudoidInput.value.trim();
                         if (newPseudoid) {
                             localStorage.setItem('currentPseudoid', newPseudoid);
                             // Create initial user data if it doesn't exist (saveProgress handles this)
                             await saveProgress({ pseudoid: newPseudoid, completedModules: [], quizScores: {} })
                                .then(() => {
                                     // Reload the home module to show the welcome message
                                    document.querySelector('button[data-module="home"]').click();
                                })
                                .catch(error => {
                                    console.error('Error setting initial progress:', error);
                                    // Handle error, maybe show a message to the user
                                    showNotification('Failed to set user ID. Please try again.', 'error'); // showNotification needs to be available
                                });

                         } else {
                            showNotification('Please enter a valid ID.', 'warning'); // showNotification needs to be available
                         }
                     });
                }
            }
        }
    },
    encryption: { // Renamed slightly for clarity vs the new lesson
        title: 'Encryption Basics Module',
        html: `
            <h2>Encryption Basics Module</h2>
            <p>Learn the fundamental concepts of protecting your data.</p>
            <section class="module-section">
                <h3>What is Encryption?</h3>
                <p>Encryption is the process of converting data into a code to prevent unauthorized access. This is done using an algorithm and a key. Only someone with the correct key can decrypt the data back into its original form.</p>
            </section>
            <section class="module-section">
                <h3>Why Encrypt?</h3>
                <p>Encryption ensures confidentiality, protecting sensitive information during storage and transmission.</p>
            </section>
            <button class="mark-completed" data-module="encryption">Mark as Completed</button>
            `,
        // No quiz defined here, quiz is with the Symmetric/Asymmetric lesson
        init: function(contentElement) {
            const markCompletedButton = contentElement.querySelector('.mark-completed');
            const moduleName = 'encryption'; // Hardcode the module key

            // Function to update button state
            const updateButtonState = (isCompleted) => {
                 if (markCompletedButton) {
                     markCompletedButton.disabled = isCompleted;
                     markCompletedButton.textContent = isCompleted ? 'Completed ✓' : 'Mark as Completed';
                     if (isCompleted) {
                        markCompletedButton.classList.add('completed'); // Add a class for styling
                     } else {
                         markCompletedButton.classList.remove('completed');
                     }
                 }
            };

            // Check initial completion status
            const savedPseudoid = localStorage.getItem('currentPseudoid');
            if (savedPseudoid) {
                getProgress(savedPseudoid).then(userData => {
                    const isCompleted = userData && userData.completedModules && userData.completedModules.includes(moduleName);
                    updateButtonState(isCompleted);
                }).catch(error => {
                    console.error('Error checking completion status:', error);
                    updateButtonState(false); // Assume not completed if error
                });
            } else {
                 updateButtonState(false); // Not completed if no user
            }


            // Add event listener to the mark-completed button
            if (markCompletedButton) {
                markCompletedButton.addEventListener('click', () => {
                    const currentPseudoid = localStorage.getItem('currentPseudoid');

                    if (currentPseudoid) {
                        markModuleCompleted(currentPseudoid, moduleName)
                            .then(() => {
                                // showNotification is defined in main.js, assuming it's globally available or passed in init
                                if (typeof showNotification !== 'undefined') {
                                     showNotification(`Module "${modules[moduleName].title}" marked as completed!`);
                                } else {
                                    alert(`Module "${modules[moduleName].title}" marked as completed!`); // Fallback
                                }
                                updateButtonState(true);
                            })
                            .catch(error => {
                                console.error('Error marking module as completed:', error);
                                if (typeof showNotification !== 'undefined') {
                                    showNotification('Please register or log in with a pseudoid first to track progress.', 'error');
                                } else {
                                    alert('Please register or log in with a pseudoid first to track progress.'); // Fallback
                                }
                            });
                    } else {
                        if (typeof showNotification !== 'undefined') {
                             showNotification('Please register or log in with a pseudoid first to track progress.', 'error');
                        } else {
                             alert('Please register or log in with a pseudoid first to track progress.'); // Fallback
                        }
                    }
                });
            }
        }
    },
    'encryption-types': { // Module key for the lesson with slideshow and quiz
        title: 'Symmetric and Asymmetric Encryption',
        html: `
            <h2>Symmetric and Asymmetric Encryption: A Comprehensive Lesson</h2>

            <div class="slideshow-container">
                <div id="slides">
                    <div class="slide active">
                        <section class="module-section">
                            <h3>Learning Objectives</h3>
                            <p>By the end of this lesson, you will understand:</p>
                            <ul>
                                <li>The basic concepts of encryption and why it's important</li>
                                <li>How symmetric encryption works, its advantages and limitations</li>
                                <li>How asymmetric encryption works, its advantages and limitations</li>
                                <li>Real-world applications of both encryption types</li>
                                <li>How the two methods can work together in practical security systems</li>
                            </ul>
                        </section>
                        <section class="module-section">
                            <h3>Introduction to Encryption</h3>
                            <p>Encryption is the process of converting information (plaintext) into an unreadable format (ciphertext) that can only be decoded by authorized parties. It's the foundation of data security and privacy in our digital world.</p>
                        </section>
                    </div>

                    <div class="slide">
                        <section class="module-section">
                            <h3>Symmetric Encryption</h3>
                            <h4>Concept</h4>
                            <p>Symmetric encryption uses the same key for both encryption and decryption. Think of it as a single physical key that both locks and unlocks a door.</p>
                            <h4>How It Works</h4>
                            <ol>
                                <li>The sender encrypts the plaintext message using the secret key</li>
                                <li>The encrypted message (ciphertext) is transmitted</li>
                                <li>The receiver uses the same secret key to decrypt the ciphertext back to plaintext</li>
                            </ol>
                        </section>
                    </div>

                    <div class="slide">
                        <section class="module-section">
                            <h4>Key Characteristics of Symmetric Encryption</h4>
                            <ul>
                                <li><strong>Speed:</strong> Generally faster than asymmetric encryption</li>
                                <li><strong>Efficiency:</strong> Works well for large amounts of data</li>
                                <li><strong>Key Distribution Challenge:</strong> Both parties need to securely share the key</li>
                                <li><strong>Key Management Issue:</strong> As the number of users increases, the number of keys needed grows rapidly (n&times;(n-1)/2 keys for n users)</li>
                            </ul>
                        </section>
                        <section class="module-section">
                            <h4>Common Algorithms</h4>
                            <ul>
                                <li>AES (Advanced Encryption Standard) - 128, 192, or 256-bit keys</li>
                                <li>DES (Data Encryption Standard) - outdated, 56-bit keys</li>
                                <li>3DES (Triple DES) - more secure version of DES</li>
                                <li>ChaCha20 - used in modern protocols like TLS</li>
                            </ul>
                        </section>
                    </div>

                    <div class="slide">
                        <section class="module-section">
                            <h3>Asymmetric Encryption (Public Key Cryptography)</h3>
                            <h4>Concept</h4>
                            <p>Asymmetric encryption uses a pair of related keys - a public key and a private key. Data encrypted with one key can only be decrypted with its corresponding key.</p>
                            <h4>How It Works</h4>
                             <ol>
                                <li>Each user has a public key (shared openly) and a private key (kept secret)</li>
                                <li>To send a secure message to someone, encrypt it using their public key</li>
                                <li>Only the recipient can decrypt it using their matching private key</li>
                            </ol>
                        </section>
                    </div>

                    <div class="slide">
                        <section class="module-section">
                            <h4>Key Characteristics of Asymmetric Encryption</h4>
                            <ul>
                                <li><strong>Different Keys:</strong> Uses mathematically related but different keys for encryption and decryption</li>
                                <li><strong>Key Distribution Advantage:</strong> Public keys can be freely shared</li>
                                <li><strong>Speed:</strong> Slower than symmetric encryption</li>
                                <li><strong>Processing Power:</strong> Requires more computational resources</li>
                                <li><strong>Security:</strong> Based on complex mathematical problems that are difficult to solve</li>
                            </ul>
                        </section>
                        <section class="module-section">
                            <h4>Common Algorithms</h4>
                            <ul>
                                <li>RSA (Rivest-Shamir-Adleman)</li>
                                <li>ECC (Elliptic Curve Cryptography)</li>
                                <li>Diffie-Hellman Key Exchange</li>
                                <li>DSA (Digital Signature Algorithm)</li>
                            </ul>
                        </section>
                    </div>

                    <div class="slide">
                        <section class="module-section">
                            <h3>Comparing Symmetric vs. Asymmetric Encryption</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Feature</th>
                                        <th>Symmetric</th>
                                        <th>Asymmetric</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Keys Used</td>
                                        <td>Single shared key</td>
                                        <td>Key pair (public &amp; private)</td>
                                    </tr>
                                    <tr>
                                        <td>Speed</td>
                                        <td>Faster</td>
                                        <td>Slower</td>
                                    </tr>
                                    <tr>
                                        <td>Security for large data</td>
                                        <td>Higher (when implemented correctly)</td>
                                        <td>Lower (due to speed/complexity, typically used for small data like keys)</td>
                                    </tr>
                                     <tr>
                                        <td>Key Length</td>
                                        <td>Shorter (128-256 bits for strong security)</td>
                                        <td>Longer (2048+ bits for comparable security)</td>
                                    </tr>
                                    <tr>
                                        <td>Key Distribution</td>
                                        <td>Difficult (needs a secure channel)</td>
                                        <td>Easier (public key can be shared openly)</td>
                                    </tr>
                                    <tr>
                                        <td>Primary Use Cases</td>
                                        <td>Bulk data encryption</td>
                                        <td>Key exchange, digital signatures, authentication</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                    </div>

                    <div class="slide">
                         <section class="module-section">
                            <h3>Real-World Applications & Hybrid Systems</h3>
                            <h4>Symmetric Encryption Applications</h4>
                            <ul>
                                <li>File encryption (e.g., encrypting a hard drive)</li>
                                <li>Database encryption</li>
                                <li>Hardware encryption (e.g., on SSDs)</li>
                                <li>Streaming data protection (e.g., video calls)</li>
                                <li>Session encryption in TLS/SSL (after key exchange)</li>
                            </ul>
                        </section>
                        <section class="module-section">
                            <h4>Asymmetric Encryption Applications</h4>
                            <ul>
                                <li>Digital signatures (verifying authenticity and integrity)</li>
                                <li>SSL/TLS certificates (verifying website identity)</li>
                                <li>Secure email (PGP/GPG)</li>
                                <li>Cryptocurrency systems (signing transactions)</li>
                                <li>Secure key exchange (transferring symmetric keys)</li>
                            </ul>
                        </section>
                         <section class="module-section">
                            <h4>Hybrid Systems: The Best of Both Worlds</h4>
                            <p>Most modern security systems use both encryption types together:</p>
                            <ol>
                                <li>Asymmetric encryption is used to securely exchange a symmetric key</li>
                                <li>Symmetric encryption is then used for the actual bulk data exchange</li>
                            </ol>
                            <p>This approach leverages:</p>
                            <ul>
                                <li>The security of asymmetric encryption for key exchange</li>
                                <li>The speed and efficiency of symmetric encryption for data transmission</li>
                            </ul>
                            <p><strong>Example:</strong> HTTPS connections use this hybrid approach:</p>
                             <ul>
                                <li>RSA or ECC (asymmetric) handles the initial handshake and symmetric key exchange</li>
                                <li>AES (symmetric) encrypts the actual web traffic</li>
                            </ul>
                        </section>
                    </div>

                     <div class="slide">
                        <section class="module-section">
                            <h3>Conclusion & Quiz</h3>
                            <p>Both symmetric and asymmetric encryption play crucial roles in modern security:</p>
                            <ul>
                                <li>Symmetric encryption offers speed and efficiency but presents key distribution challenges</li>
                                <li>Asymmetric encryption solves key distribution but is slower and more resource-intensive</li>
                            </ul>
                            <p>Together, they form comprehensive security systems that protect our digital world.</p>
                            <p>Remember that encryption is only as strong as its implementation and key management practices. Even the most sophisticated algorithms can be compromised by poor security practices.</p>
                        </section>
                         <section class="module-section">
                            <h3>Ready to test your knowledge?</h3>
                             <p>Take the quiz below to check your understanding of Symmetric and Asymmetric Encryption.</p>
                             <p id="quiz-score-display"></p> </section>
                        <button class="start-quiz" data-quiz-module="encryption-types">Start Encryption Types Quiz</button>
                        <button class="mark-completed" data-module="encryption-types">Mark as Completed (Requires passing quiz)</button>
                    </div>

                </div>
                   <div class="slide-navigation">
                    <button id="prev-slide">&lt; Previous</button>
                    <span id="slide-counter"></span>
                    <button id="next-slide">Next &gt;</button>
                </div>
            </div>
        `,
        // Define quiz questions for this specific lesson
        quiz: [
            {
                question: "Which type of encryption uses the same key for both encryption and decryption?",
                options: ["Symmetric", "Asymmetric", "Hashing", "Hybrid"],
                answer: "Symmetric"
            },
            {
                question: "What is the main advantage of asymmetric encryption over symmetric encryption?",
                options: ["It's faster for bulk data", "It solves the key distribution problem", "It uses shorter keys", "It doesn't require algorithms"],
                answer: "It solves the key distribution problem"
            },
            {
                question: "In a hybrid encryption system (like HTTPS), what is asymmetric encryption typically used for?",
                options: ["Encrypting the entire data stream", "Hashing passwords", "Securely exchanging a symmetric key", "Compressing data"],
                answer: "Securely exchanging a symmetric key"
            },
            {
                question: "Which of these is a common symmetric encryption algorithm?",
                options: ["RSA", "ECC", "AES", "SHA-256"],
                answer: "AES"
            },
             {
                question: "Which of these is a common asymmetric encryption algorithm?",
                options: ["AES", "DES", "RSA", "ChaCha20"],
                answer: "RSA"
            }
        ],
        // Add initialization function for slides and buttons
        init: async function(contentElement) {
            console.log('Initializing slideshow for encryption-types module...');
            const slides = contentElement.querySelectorAll('#slides .slide');
            const prevButton = contentElement.querySelector('#prev-slide');
            const nextButton = contentElement.querySelector('#next-slide');
            const slideCounter = contentElement.querySelector('#slide-counter');
            const startQuizButton = contentElement.querySelector('.start-quiz');
            const markCompletedButton = contentElement.querySelector('.mark-completed');
            const quizScoreDisplay = contentElement.querySelector('#quiz-score-display');

            let currentSlide = 0; // State for the current slide

            function updateSlides() {
                console.log('Updating slides. Current slide:', currentSlide);
                slides.forEach((slide, index) => {
                    slide.classList.toggle('active', index === currentSlide);
                });

                // Disable navigation buttons at the start/end
                prevButton.disabled = currentSlide === 0;
                nextButton.disabled = currentSlide === slides.length - 1;

                // Update slide counter text
                slideCounter.textContent = `Slide ${currentSlide + 1} of ${slides.length}`;

                 // Show or hide the quiz button and mark completed button only on the last slide
                 if (currentSlide === slides.length - 1) {
                     if (startQuizButton) startQuizButton.style.display = 'inline-block';
                     if (markCompletedButton) markCompletedButton.style.display = 'inline-block';
                 } else {
                     if (startQuizButton) startQuizButton.style.display = 'none';
                     if (markCompletedButton) markCompletedButton.style.display = 'none';
                 }
            }

            // Add event listeners only if buttons exist
            if (prevButton) {
                 prevButton.addEventListener('click', () => {
                    console.log('Previous button clicked.');
                    if (currentSlide > 0) {
                        currentSlide--;
                        updateSlides();
                    }
                });
            }

            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    console.log('Next button clicked.');
                    if (currentSlide < slides.length - 1) {
                        currentSlide++;
                        updateSlides();
                    }
                });
            }

             // Check quiz score and update button/display on load
             const moduleKey = 'encryption-types'; // Hardcode module key
             const savedPseudoid = localStorage.getItem('currentPseudoid');

             const updateQuizState = (userData) => {
                 if (quizScoreDisplay) {
                     const quizScore = userData?.quizScores?.[moduleKey];
                     if (quizScore) {
                         quizScoreDisplay.innerHTML = `Your last score: ${quizScore.score}/${quizScore.total} (${quizScore.percentage}%) - ${quizScore.passed ? '<span style="color: green;">Passed</span>' : '<span style="color: red;">Failed</span>'}`;
                     } else {
                         quizScoreDisplay.textContent = 'You have not taken the quiz yet.';
                     }
                 }

                 // Mark as completed button is only enabled if the quiz is passed
                 if (markCompletedButton) {
                     const quizPassed = userData?.quizScores?.[moduleKey]?.passed === true;
                     const moduleCompleted = userData?.completedModules?.includes(moduleKey);

                     markCompletedButton.disabled = !quizPassed || moduleCompleted;
                     markCompletedButton.textContent = moduleCompleted ? 'Completed ✓' : (quizPassed ? 'Mark as Completed' : 'Pass Quiz to Complete');
                     if (moduleCompleted) {
                         markCompletedButton.classList.add('completed');
                     } else {
                         markCompletedButton.classList.remove('completed');
                     }
                 }
                 // Quiz button is always enabled if user exists, disabled otherwise? Or handled by main.js
                 // Let main.js handle enabling/disabling the start-quiz button based on user presence
             };

             if (savedPseudoid) {
                 try {
                    const userData = await getProgress(savedPseudoid);
                    updateQuizState(userData);
                 } catch (error) {
                     console.error("Error loading quiz/completion state for encryption-types:", error);
                     updateQuizState(null); // Reset state on error
                 }
             } else {
                  updateQuizState(null); // Reset state if no user
             }


            // Initial slide display
            updateSlides();
        }
    },
    compression: {
        title: 'Data Compression Module',
        html: `
            <h2>Data Compression Module</h2>
            <p>Learn how to make data smaller and more manageable.</p>
            <section class="module-section">
                <h3>What is Compression?</h3>
                <p>Compression is the process of encoding information using fewer bits than the original representation. The goal is to reduce storage space or transmission bandwidth.</p>
            </section>
            <section class="module-section">
                <h3>Types of Compression</h3>
                <h4>Lossless Compression</h4>
                <p>Data is compressed and can be restored to its original form without any loss of information. Used for text files, executable programs, and data where fidelity is crucial.</p>
                <ul>
                    <li>Algorithms: ZIP, Gzip, PNG, FLAC</li>
                </ul>
                <h4>Lossy Compression</h4>
                <p>Data is compressed by discarding some information that is deemed less important, resulting in a smaller file size but some loss of quality. Used for multimedia like images, audio, and video where small quality degradation is acceptable for significant size reduction.</p>
                <ul>
                    <li>Algorithms: JPEG, MP3, MP4</li>
                </ul>
            </section>
            <section class="module-section">
                <h3>How it Works (Briefly)</h3>
                <p>Compression algorithms use various techniques, such as finding repeating patterns and replacing them with shorter symbols (e.g., Huffman coding, Lempel-Ziv) or discarding perceptually irrelevant data (for lossy).</p>
            </section>
            <section class="module-section">
                <h3>Applications</h3>
                <ul>
                    <li>Reducing file sizes for storage</li>
                    <li>Speeding up data transmission over networks</li>
                    <li>Optimizing website loading times</li>
                    <li>Efficient multimedia storage and streaming</li>
                </ul>
            </section>
             <section class="module-section">
                <h3>Ready for the quiz?</h3>
                 <p id="quiz-score-display-compression"></p> </section>
             <button class="start-quiz" data-quiz-module="compression">Start Compression Quiz</button>
            <button class="mark-completed" data-module="compression">Mark as Completed (Requires passing quiz)</button>
        `,
        quiz: [
            {
                question: "Which type of compression allows the original data to be perfectly reconstructed?",
                options: ["Lossy", "Lossless", "Both", "Neither"],
                answer: "Lossless"
            },
            {
                question: "Which of these is a common lossy compression format?",
                options: ["ZIP", "PNG", "JPEG", "Gzip"],
                answer: "JPEG"
            },
            {
                question: "Which of these is a common lossless compression format?",
                options: ["MP3", "MP4", "GIF", "JPEG"], // GIF is also lossless for graphics
                answer: "GIF"
            },
             {
                question: "For what type of data is lossy compression typically used?",
                options: ["Text documents", "Executable files", "Images and audio", "Database records"],
                answer: "Images and audio"
            }
        ],
        init: async function(contentElement) {
            const markCompletedButton = contentElement.querySelector('.mark-completed');
            const startQuizButton = contentElement.querySelector('.start-quiz');
            const quizScoreDisplay = contentElement.querySelector('#quiz-score-display-compression');
            const moduleName = 'compression'; // Hardcode the module key

            // Function to update button/display state
             const updateState = (userData) => {
                 if (quizScoreDisplay) {
                     const quizScore = userData?.quizScores?.[moduleName];
                     if (quizScore) {
                         quizScoreDisplay.innerHTML = `Your last score: ${quizScore.score}/${quizScore.total} (${quizScore.percentage}%) - ${quizScore.passed ? '<span style="color: green;">Passed</span>' : '<span style="color: red;">Failed</span>'}`;
                     } else {
                         quizScoreDisplay.textContent = 'You have not taken the quiz yet.';
                     }
                 }

                 // Mark as completed button is only enabled if the quiz is passed
                 if (markCompletedButton) {
                     const quizPassed = userData?.quizScores?.[moduleName]?.passed === true;
                     const moduleCompleted = userData?.completedModules?.includes(moduleName);

                     markCompletedButton.disabled = !quizPassed || moduleCompleted;
                     markCompletedButton.textContent = moduleCompleted ? 'Completed ✓' : (quizPassed ? 'Mark as Completed' : 'Pass Quiz to Complete');
                      if (moduleCompleted) {
                         markCompletedButton.classList.add('completed');
                     } else {
                         markCompletedButton.classList.remove('completed');
                     }
                 }

                 // Quiz button state (controlled by main.js user check)
             };


            // Check initial state
             const savedPseudoid = localStorage.getItem('currentPseudoid');
             if (savedPseudoid) {
                 try {
                    const userData = await getProgress(savedPseudoid);
                    updateState(userData);
                 } catch (error) {
                     console.error("Error loading quiz/completion state for compression:", error);
                     updateState(null); // Reset state on error
                 }
             } else {
                  updateState(null); // Reset state if no user
             }

            // Event listener for Mark as Completed button (enabled only if quiz passed, handled by main.js)
             if (markCompletedButton) {
                 markCompletedButton.addEventListener('click', () => {
                     const currentPseudoid = localStorage.getItem('currentPseudoid');
                     if (currentPseudoid && !markCompletedButton.disabled) { // Check if button is not disabled by state
                         markModuleCompleted(currentPseudoid, moduleName)
                             .then(() => {
                                  if (typeof showNotification !== 'undefined') {
                                    showNotification(`Module "${modules[moduleName].title}" marked as completed!`);
                                 } else { alert(`Module "${modules[moduleName].title}" marked as completed!`);}
                                 updateState({ ... (JSON.parse(localStorage.getItem('lastUserData')) || {}), completedModules: [...((JSON.parse(localStorage.getItem('lastUserData')) || {}).completedModules || []), moduleName] }); // Optimistic update or re-fetch? Re-fetching might be safer. Let's re-fetch in main.js after save.
                                 // Or just update the button state directly knowing it was successful
                                 updateState({... (savedPseudoid ? (JSON.parse(localStorage.getItem('lastUserData')) || {}) : {}), completedModules: [...((savedPseudoid ? (JSON.parse(localStorage.getItem('lastUserData')) || {}).completedModules : []) || []), moduleName] }); // Need a way to refresh userData or state
                                 // A better approach is to trigger a state update in main.js or refetch data after successful save.
                                 // For now, let's just visually update the button, the actual state is in IDB.
                                  updateState({
                                     ... (savedPseudoid ? (JSON.parse(localStorage.getItem('lastUserData')) || {}) : {}),
                                     quizScores: (savedPseudoid ? (JSON.parse(localStorage.getItem('lastUserData')) || {}).quizScores : {}), // Preserve score
                                     completedModules: [...((savedPseudoid ? (JSON.parse(localStorage.getItem('lastUserData')) || {}).completedModules : []) || []), moduleName] // Add completion
                                 });
                                  // Simplest visual update:
                                 markCompletedButton.disabled = true;
                                 markCompletedButton.textContent = 'Completed ✓';
                                 markCompletedButton.classList.add('completed');

                             })
                             .catch(error => {
                                 console.error('Error marking module as completed:', error);
                                  if (typeof showNotification !== 'undefined') {
                                    showNotification('Failed to mark module as completed.', 'error');
                                 } else { alert('Failed to mark module as completed.');}
                             });
                     } else if (!currentPseudoid) {
                          if (typeof showNotification !== 'undefined') {
                             showNotification('Please register or log in with a pseudoid first to track progress.', 'error');
                         } else { alert('Please register or log in with a pseudoid first to track progress.');}
                     }
                 });
             }

             // Event listener for Start Quiz button is handled in main.js
             // main.js will check for pseudoid before calling showQuiz
        }
    },
    hashing: {
        title: 'Hashing Module',
        html: `
            <h2>Hashing Module</h2>
            <p>Understand the importance of data integrity using hashing.</p>
            <section class="module-section">
                <h3>What is Hashing?</h3>
                <p>Hashing is the process of converting a variable-length input (like a message or file) into a fixed-length output string, which is typically a sequence of letters and numbers. This output is called a hash value, hash code, digest, or simply a hash.</p>
            </section>
            <section class="module-section">
                <h3>Key Properties of Cryptographic Hash Functions</h3>
                <ul>
                    <li><strong>Deterministic:</strong> The same input always produces the same output hash.</li>
                    <li><strong>One-Way (Preimage Resistance):</strong> It's computationally infeasible to reverse the process; you cannot get the original input from the hash output.</li>
                    <li><strong>Collision Resistance:</strong> It's computationally infeasible to find two different inputs that produce the same hash output.</li>
                    <li><strong>Avalanche Effect:</strong> A small change in the input should result in a significantly different output hash.</li>
                </ul>
            </section>
            <section class="module-section">
                <h3>How it Works (Conceptual)</h3>
                <p>Hash functions use complex mathematical operations to process the input data piece by piece, combining and transforming it until a final fixed-size hash is produced.</p>
            </section>
            <section class="module-section">
                <h3>Applications</h3>
                <ul>
                    <li><strong>Password Storage:</strong> Instead of storing passwords directly, websites store their hash. When a user logs in, the entered password's hash is compared to the stored hash. This protects the actual password if the database is breached.</li>
                    <li><strong>Data Integrity Verification:</strong> You can hash a file or message, send the hash separately, and the recipient can re-hash the data they received. If the hashes match, they know the data hasn't been tampered with.</li>
                    <li><strong>Digital Signatures:</strong> Hashing is used as part of the digital signature process to ensure the integrity and authenticity of digital documents.</li>
                    <li><strong>Data Indexing (Hash Tables):</strong> Used in data structures for fast lookups.</li>
                </ul>
            </section>
            <section class="module-section">
                <h3>Common Algorithms</h3>
                <ul>
                    <li>MD5 (Message Digest 5) - Considered insecure for cryptographic use (collisions found)</li>
                    <li>SHA-1 (Secure Hash Algorithm 1) - Also considered insecure for cryptographic use</li>
                    <li>SHA-256, SHA-512 (Part of SHA-2 family) - Widely used today</li>
                    <li>SHA-3 - A newer generation hash function</li>
                </ul>
            </section>
             <section class="module-section">
                <h3>Ready for the quiz?</h3>
                 <p id="quiz-score-display-hashing"></p> </section>
             <button class="start-quiz" data-quiz-module="hashing">Start Hashing Quiz</button>
            <button class="mark-completed" data-module="hashing">Mark as Completed (Requires passing quiz)</button>
        `,
        quiz: [
            {
                question: "What is the output of a hash function typically called?",
                options: ["Ciphertext", "Public Key", "Hash value", "Salt"],
                answer: "Hash value"
            },
            {
                question: "A good cryptographic hash function should be 'one-way'. What does this mean?",
                options: ["The same input always produces the same output", "A small input change creates a large output change", "It's hard to get the original input from the hash", "It produces a fixed-length output"],
                answer: "It's hard to get the original input from the hash"
            },
            {
                question: "Which property means it's hard to find two different inputs that produce the same hash?",
                options: ["Deterministic", "One-Way", "Avalanche Effect", "Collision Resistance"],
                answer: "Collision Resistance"
            },
             {
                question: "What is a primary use case for hashing in security?",
                options: ["Encrypting files for storage", "Securely exchanging encryption keys", "Verifying data integrity", "Compressing large video files"],
                answer: "Verifying data integrity"
            },
             {
                question: "Which hashing algorithm is considered insecure for cryptographic purposes?",
                options: ["SHA-256", "SHA-3", "MD5", "SHA-512"],
                answer: "MD5"
            }
        ],
        init: async function(contentElement) {
            const markCompletedButton = contentElement.querySelector('.mark-completed');
            const startQuizButton = contentElement.querySelector('.start-quiz');
             const quizScoreDisplay = contentElement.querySelector('#quiz-score-display-hashing');
            const moduleName = 'hashing'; // Hardcode the module key

             // Function to update button/display state
             const updateState = (userData) => {
                 if (quizScoreDisplay) {
                     const quizScore = userData?.quizScores?.[moduleName];
                     if (quizScore) {
                         quizScoreDisplay.innerHTML = `Your last score: ${quizScore.score}/${quizScore.total} (${quizScore.percentage}%) - ${quizScore.passed ? '<span style="color: green;">Passed</span>' : '<span style="color: red;">Failed</span>'}`;
                     } else {
                         quizScoreDisplay.textContent = 'You have not taken the quiz yet.';
                     }
                 }

                 // Mark as completed button is only enabled if the quiz is passed
                 if (markCompletedButton) {
                     const quizPassed = userData?.quizScores?.[moduleName]?.passed === true;
                     const moduleCompleted = userData?.completedModules?.includes(moduleName);

                     markCompletedButton.disabled = !quizPassed || moduleCompleted;
                     markCompletedButton.textContent = moduleCompleted ? 'Completed ✓' : (quizPassed ? 'Mark as Completed' : 'Pass Quiz to Complete');
                      if (moduleCompleted) {
                         markCompletedButton.classList.add('completed');
                     } else {
                         markCompletedButton.classList.remove('completed');
                     }
                 }
                // Quiz button state (controlled by main.js user check)
             };


            // Check initial state
             const savedPseudoid = localStorage.getItem('currentPseudoid');
             if (savedPseudoid) {
                 try {
                    const userData = await getProgress(savedPseudoid);
                    updateState(userData);
                 } catch (error) {
                     console.error("Error loading quiz/completion state for hashing:", error);
                     updateState(null); // Reset state on error
                 }
             } else {
                  updateState(null); // Reset state if no user
             }


             // Event listener for Mark as Completed button
             if (markCompletedButton) {
                 markCompletedButton.addEventListener('click', () => {
                     const currentPseudoid = localStorage.getItem('currentPseudoid');
                      if (currentPseudoid && !markCompletedButton.disabled) { // Check if button is not disabled by state
                         markModuleCompleted(currentPseudoid, moduleName)
                             .then(() => {
                                 if (typeof showNotification !== 'undefined') {
                                    showNotification(`Module "${modules[moduleName].title}" marked as completed!`);
                                 } else { alert(`Module "${modules[moduleName].title}" marked as completed!`);}
                                  // Visual update:
                                 markCompletedButton.disabled = true;
                                 markCompletedButton.textContent = 'Completed ✓';
                                 markCompletedButton.classList.add('completed');
                             })
                             .catch(error => {
                                 console.error('Error marking module as completed:', error);
                                  if (typeof showNotification !== 'undefined') {
                                    showNotification('Failed to mark module as completed.', 'error');
                                 } else { alert('Failed to mark module as completed.');}
                             });
                      } else if (!currentPseudoid) {
                         if (typeof showNotification !== 'undefined') {
                             showNotification('Please register or log in with a pseudoid first to track progress.', 'error');
                         } else { alert('Please register or log in with a pseudoid first to track progress.');}
                     }
                 });
             }
            // Event listener for Start Quiz button is handled in main.js
        }
    },
    profile: {
        title: 'My Progress',
        html: `
            <h2>My Progress</h2>
            <div id="profile-content">
                </div>
            <div id="pseudoid-setup" class="module-section">
                 </div>
             <button id="reset-progress" class="reset-button" style="display: none;">Reset All Progress</button>
        `,
        init: async function(contentElement) {
            const profileContentDiv = contentElement.querySelector('#profile-content');
             const pseudoidSetupDiv = contentElement.querySelector('#pseudoid-setup');
             const resetProgressButton = contentElement.querySelector('#reset-progress');
            const savedPseudoid = localStorage.getItem('currentPseudoid');
            const learnableModules = Object.keys(modules).filter(key => key !== 'home' && key !== 'profile');

            // Function to display the user's progress
            const displayProgress = (pseudoid, userData) => {
                 pseudoidSetupDiv.innerHTML = `
                    <h3>Current Student ID: ${pseudoid}</h3>
                    <button id="change-pseudoid">Change ID</button>
                 `;
                 resetProgressButton.style.display = 'block'; // Show reset button

                 if (!userData) {
                     profileContentDiv.innerHTML = `<p>No progress found for this ID. Start completing modules!</p>`;
                     return;
                 }

                const completedCount = userData.completedModules ? userData.completedModules.length : 0;
                let progressHtml = `
                    <section class="module-section">
                        <h3>Summary</h3>
                        <p>You have completed ${completedCount} out of ${learnableModules.length} learnable modules.</p>
                         <p>Last accessed: ${new Date(userData.lastAccessed).toLocaleString()}</p>
                    </section>
                    <section class="module-section">
                        <h3>Module Breakdown</h3>
                        <ul>
                `;

                learnableModules.forEach(moduleKey => {
                    const moduleInfo = modules[moduleKey];
                    const isCompleted = userData.completedModules && userData.completedModules.includes(moduleKey);
                    const quizScore = userData.quizScores ? userData.quizScores[moduleKey] : null;

                    progressHtml += `
                        <li>
                            <strong>${moduleInfo.title}</strong>:
                            ${isCompleted ? '<span class="completion-status completed">Completed ✓</span>' : '<span class="completion-status pending">Pending</span>'}
                            ${quizScore ?
                                ` (Quiz: ${quizScore.score}/${quizScore.total} - ${quizScore.percentage}% - ${quizScore.passed ? '<span style="color: green;">Passed</span>' : '<span style="color: red;">Failed</span>'})`
                                : (moduleInfo.quiz ? ' (Quiz: Not Taken)' : '')
                            }
                        </li>
                    `;
                });

                progressHtml += `
                        </ul>
                    </section>
                `;

                profileContentDiv.innerHTML = progressHtml;

                 // Add event listener to change ID button
                 const changePseudoidButton = pseudoidSetupDiv.querySelector('#change-pseudoid');
                 if (changePseudoidButton) {
                     changePseudoidButton.addEventListener('click', () => {
                         // Clear local storage and reload profile view to show input form
                         localStorage.removeItem('currentPseudoid');
                         document.querySelector('button[data-module="profile"]').click();
                         showNotification('Current ID cleared. Enter a new one.', 'info');
                     });
                 }
            };

            // Function to show the pseudoid input form
            const showInputForm = () => {
                 pseudoidSetupDiv.innerHTML = `
                    <h3>Set Your Student ID</h3>
                    <p>Enter a unique pseudonym or ID to track your progress. This is stored only in your browser.</p>
                    <input type="text" id="pseudoid-input" placeholder="Enter your ID">
                    <button id="set-pseudoid-button">Set ID</button>
                    <p class="small-text">If you use an existing ID, your previous progress will be loaded.</p>
                 `;
                 profileContentDiv.innerHTML = ''; // Clear progress display
                 resetProgressButton.style.display = 'none'; // Hide reset button

                 const pseudoidInput = pseudoidSetupDiv.querySelector('#pseudoid-input');
                 const setPseudoidButton = pseudoidSetupDiv.querySelector('#set-pseudoid-button');

                 if (setPseudoidButton) {
                     setPseudoidButton.addEventListener('click', async () => {
                         const newPseudoid = pseudoidInput.value.trim();
                         if (newPseudoid) {
                              // Check if this ID already exists
                             const existingUser = await getProgress(newPseudoid);
                             localStorage.setItem('currentPseudoid', newPseudoid);

                             if (!existingUser) {
                                 // If new user, create initial record
                                await saveProgress({ pseudoid: newPseudoid, completedModules: [], quizScores: {} })
                                    .then(() => {
                                         showNotification(`New ID "${newPseudoid}" set. Welcome!`, 'success');
                                         // Reload profile view to display the new progress
                                        document.querySelector('button[data-module="profile"]').click();
                                    })
                                     .catch(error => {
                                         console.error('Error setting initial progress for new user:', error);
                                          showNotification('Failed to set new ID. Please try again.', 'error');
                                     });
                             } else {
                                 // If existing user, just load their data
                                showNotification(`Logged in with ID "${newPseudoid}". Loading your progress.`, 'success');
                                 // Reload profile view to display existing progress
                                document.querySelector('button[data-module="profile"]').click();
                             }

                         } else {
                             showNotification('Please enter a valid ID.', 'warning');
                         }
                     });
                 }
            };


            // Main logic for profile init
            if (savedPseudoid) {
                getProgress(savedPseudoid)
                    .then(userData => {
                        displayProgress(savedPseudoid, userData);
                        // Store user data in localStorage temporarily for easy access by other modules' init functions
                        // This avoids repeated IDB lookups on module load, but is potentially stale.
                        // Re-fetching in main.js after saves is better. Let's remove this local storage temp store.
                        // localStorage.setItem('lastUserData', JSON.stringify(userData)); // Consider potential sync issues
                    })
                    .catch(error => {
                        console.error('Error loading profile progress:', error);
                         showNotification('Error loading your progress.', 'error');
                        showInputForm(); // Show input form if loading fails
                    });
            } else {
                showInputForm(); // Show input form if no pseudoid is saved
            }

             // Add event listener for reset button
             if (resetProgressButton) {
                 resetProgressButton.addEventListener('click', async () => {
                     const currentPseudoid = localStorage.getItem('currentPseudoid');
                     if (currentPseudoid && confirm('Are you sure you want to reset all your progress for this ID? This action cannot be undone.')) {
                         try {
                             await saveProgress({ pseudoid: currentPseudoid, completedModules: [], quizScores: {}, lastAccessed: new Date().toISOString() });
                              showNotification('Your progress has been reset.', 'success');
                              // Reload profile view
                              document.querySelector('button[data-module="profile"]').click();
                         } catch (error) {
                             console.error('Error resetting progress:', error);
                              showNotification('Failed to reset progress.', 'error');
                         }
                     } else if (!currentPseudoid) {
                          showNotification('No user ID is set to reset progress.', 'warning');
                     }
                 });
             }
        }
    }
    // Add other modules here following the same structure
};
