// modules.js



// This file stores the content and data for each learning module.

// Export an object where keys are module names (matching data-module attributes)

// and values contain the HTML content and potentially quiz questions.



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

                db.createObjectStore(STORE_NAME, { keyPath: 'pseudoid' });

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

function getProgress(pseudoid) {

    return new Promise((resolve, reject) => {

        if (!db) {

            reject('IndexedDB not initialized.');

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

function saveProgress(userData) {

    return new Promise((resolve, reject) => {

        if (!db) {

            reject('IndexedDB not initialized.');

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

function markModuleCompleted(pseudoid, moduleName) {

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

            }

            

            resolve(userData);

        } catch (error) {

            console.error('Error marking module as completed:', error);

            reject(error);

        }

    });

}



// Function to save quiz score for a specific pseudoid and module

function saveQuizScore(pseudoid, moduleKey, score, total) {

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

            }

            

            // Make sure quizScores exists

            if (!userData.quizScores) {

                userData.quizScores = {};

            }

            

            // Add or update the quiz score

            userData.quizScores[moduleKey] = {

                score: score,

                total: total,

                timestamp: new Date().toISOString(),

                passed: score >= (total * 0.7) // Consider 70% as passing score

            };

            

            userData.lastAccessed = new Date().toISOString();

            

            // If passed, add to completed modules if not already there

            if (userData.quizScores[moduleKey].passed && !userData.completedModules.includes(moduleKey)) {

                userData.completedModules.push(moduleKey);

            }

            

            // Save the updated data

            await saveProgress(userData);

            console.log(`Quiz score for '${moduleKey}' saved for pseudoid '${pseudoid}'`);

            

            resolve(userData);

        } catch (error) {

            console.error('Error saving quiz score:', error);

            reject(error);

        }

    });

}



// Open the database when the script loads

openDatabase().catch(error => console.error("Failed to open IndexedDB:", error));



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

                    <!-- Will be populated with personalized welcome if pseudoid exists -->

                </div>

            </section>

            <section class="module-section">

                <h3>Latest Updates</h3>

                <p>Stay tuned for new modules and features!</p>

            </section>

        `,

        init: function(contentElement) {

            // Check if we have a saved pseudoid in localStorage

            const savedPseudoid = localStorage.getItem('currentPseudoid');

            const welcomeDiv = contentElement.querySelector('#user-welcome');

            

            if (savedPseudoid && welcomeDiv) {

                // Display personalized welcome message

                getProgress(savedPseudoid).then(userData => {

                    if (userData) {

                        const completedCount = userData.completedModules ? userData.completedModules.length : 0;

                        const totalModules = Object.keys(modules).length - 2; // Subtract home and profile

                        

                        welcomeDiv.innerHTML = `

                            <div class="welcome-box">

                                <h4>Welcome back, Student ID: ${savedPseudoid}!</h4>

                                <p>You've completed ${completedCount} out of ${totalModules} modules.</p>

                                <p><a href="#" id="view-progress-link">View your progress</a></p>

                            </div>

                        `;

                        

                        // Add event listener to the view-progress link

                        const viewProgressLink = contentElement.querySelector('#view-progress-link');

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

                    }

                }).catch(error => {

                    console.error('Error getting user data for welcome:', error);

                });

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

            // Add event listener to the mark-completed button

            const markCompletedButton = contentElement.querySelector('.mark-completed');

            if (markCompletedButton) {

                markCompletedButton.addEventListener('click', () => {

                    const moduleName = markCompletedButton.getAttribute('data-module');

                    const savedPseudoid = localStorage.getItem('currentPseudoid');

                    

                    if (savedPseudoid) {

                        markModuleCompleted(savedPseudoid, moduleName)

                            .then(() => {

                                showNotification(`Module "${modules[moduleName].title}" marked as completed!`);

                                markCompletedButton.disabled = true;

                                markCompletedButton.textContent = 'Completed ✓';

                            })

                            .catch(error => {

                                console.error('Error marking module as completed:', error);

                                showNotification('Please register or log in with a pseudoid first to track progress.', 'error');

                            });

                    } else {

                        showNotification('Please register or log in with a pseudoid first to track progress.', 'error');

                    }

                });

            }

            

            // Check if this module is already completed

            const savedPseudoid = localStorage.getItem('currentPseudoid');

            if (savedPseudoid && markCompletedButton) {

                getProgress(savedPseudoid).then(userData => {

                    if (userData && userData.completedModules && userData.completedModules.includes('encryption')) {

                        markCompletedButton.disabled = true;

                        markCompletedButton.textContent = 'Completed ✓';

                    }

                }).catch(error => {

                    console.error('Error checking completion status:', error);

                });

            }

        }

    },

    'encryption-types': { // New module key for the lesson

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

                                        <td>Higher</td>

                                        <td>Lower</td>

                                    </tr>

                                    <tr>

                                        <td>Key Distribution</td>

                                        <td>Difficult</td>

                                        <td>Easier</td>

                                    </tr>

                                    <tr>

                                        <td>Key Length</td>

                                        <td>Shorter (128-256 bits)</td>

                                        <td>Longer (2048+ bits)</td>

                                    </tr>

                                    <tr>

                                        <td>Use Cases</td>

                                        <td>Bulk data encryption</td>

                                        <td>Key exchange, digital signatures</td>

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

                                <li>File encryption</li>

                                <li>Database encryption</li>

                                <li>Hardware encryption</li>

                                <li>Streaming data protection</li>

                                <li>Session encryption in TLS/SSL</li>

                            </ul>

                            <h4>Asymmetric Encryption Applications</h4>

                            <ul>

                                <li>Digital signatures</li>

                                <li>SSL/TLS certificates</li>

                                <li>Secure email (PGP/GPG)</li>

                                <li>Cryptocurrency systems</li>

                                <li>Secure key exchange</li>

                            </ul>

                        </section>

                         <section class="module-section">

                            <h4>Hybrid Systems: The Best of Both Worlds</h4>

                            <p>Most modern security systems use both encryption types together:</p>

                            <ol>

                                <li>Asymmetric encryption is used to securely exchange a symmetric key</li>

                                <li>Symmetric encryption is then used for the actual data exchange</li>

                            </ol>

                            <p>This approach leverages:</p>

                            <ul>

                                <li>The security of asymmetric encryption for key exchange</li>

                                <li>The speed and efficiency of symmetric encryption for data transmission</li>

                            </ul>

                            <p><strong>Example:</strong> HTTPS connections use this hybrid approach:</p>

                             <ul>

                                <li>RSA or ECC (asymmetric) handles the initial handshake</li>

                                <li>AES (symmetric) encrypts the actual web traffic</li>

                            </ul>

                        </section>

                    </div>



                    <div class="slide">

                        <section class="module-section">

                            <h3>Practical Examples & Conclusion</h3>

                             <h4>HTTPS Connection Example</h4>

                            <ol>

                                <li>Your browser gets the website's public key (from its SSL certificate)</li>

                                <li>Browser generates a random symmetric key</li>

                                <li>Browser encrypts this symmetric key using the website's public key</li>

                                <li>Website decrypts it using its private key</li>

                                <li>Both sides now have the same symmetric key to encrypt all further communications</li>

                            </ol>

                        </section>

                         <section class="module-section">

                            <h3>Conclusion</h3>

                            <p>Both symmetric and asymmetric encryption play crucial roles in modern security:</p>

                            <ul>

                                <li>Symmetric encryption offers speed and efficiency but presents key distribution challenges</li>

                                <li>Asymmetric encryption solves key distribution but is slower and more resource-intensive</li>

                            </ul>

                            <p>Together, they form comprehensive security systems that protect our digital world.</p>

                            <p>Remember that encryption is only as strong as its implementation and key management practices. Even the most sophisticated algorithms can be compromised by poor security practices.</p>

                        </section>

                         <section class="module-section">

                            <h3>Assessment Ideas</h3>

                            <ul>

                                <li>Compare the key distribution problem in symmetric vs. asymmetric encryption</li>

                                <li>Describe a real-world scenario where both encryption types would be used together</li>

                                <li>Explain why asymmetric encryption alone isn't typically used for large file encryption</li>

                            </ul>

                        </section>

                        <button class="start-quiz" data-quiz-module="encryption-types">Start Encryption Types Quiz</button>

                        <button class="mark-completed" data-module="encryption-types">Mark as Completed</button>

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

        // Add initialization function for slides

        init: function(contentElement) {

            console.log('Initializing slideshow for encryption-types module...');

            const slides = contentElement.querySelectorAll('#slides .slide');

            const prevButton = contentElement.querySelector('#prev-slide');

            const nextButton = contentElement.querySelector('#next-slide');

            const slideCounter = contentElement.querySelector('#slide-counter');

            const markCompletedButton = contentElement.querySelector('.mark-completed');

            let currentSlide = 0;



            function updateSlides() {

                console.log('Updating slides. Current slide:', currentSlide);

                slides.forEach((slide, index) => {

                    slide.classList.toggle('active', index === currentSlide);

                });



                prevButton.disabled = currentSlide === 0;

                nextButton.disabled = currentSlide === slides.length - 1;

                slideCounter.textContent = `Slide ${currentSlide + 1} of ${slides.length}`;

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

            } else {

                console.warn('Previous slide button not found.');

            }



            if (nextButton) {

                 nextButton.addEventListener('click', () => {

                     console.log('Next button clicked.');

                     if (currentSlide < slides.length - 1) {

                         currentSlide++;

                         updateSlides();

                     }

       
