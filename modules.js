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

// Open the database when the script loads
openDatabase().catch(error => console.error("Failed to open IndexedDB:", error));

// --- Module Definitions ---

export const modules = {
    home: {
        title: 'Welcome!',
        html: `
            <h2>Welcome to the Introduction to Digital Privacy and Data Security Hub!</h2> <p>Explore the fascinating world of data security and efficiency.</p>
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
            </section>
            <section class="module-section">
                 <h3>Latest Updates</h3>
                 <p>Stay tuned for new modules and features!</p>
                 </section>
        `
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
             `,
        // No quiz defined here, quiz is with the Symmetric/Asymmetric lesson
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
                        <button class="start-quiz" data-quiz="encryption-types">Start Encryption Types Quiz</button> </div>
                </div>
                 <div class="slide-navigation">
                    <button id="prev-slide">&lt; Previous</button>
                    <span id="slide-counter"></span> <button id="next-slide">Next &gt;</button>
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
            // Add more quiz questions relevant to the Symmetric/Asymmetric lesson here
        ],
        // Add initialization function for slides
        init: function(contentElement) {
            console.log('Initializing slideshow for encryption-types module...');
            const slides = contentElement.querySelectorAll('#slides .slide');
            const prevButton = contentElement.querySelector('#prev-slide');
            const nextButton = contentElement.querySelector('#next-slide');
            const slideCounter = contentElement.querySelector('#slide-counter');
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
                 });
            } else {
                 console.warn('Next slide button not found.');
            }


            // Initialize the first slide view
            updateSlides();
             console.log('Slideshow initialization complete.');
        }
    },

    compression: {
        title: 'Compression Module',
        html: `
            <h2>Compression Module</h2>
            <p>Discover how to reduce the size of your data for storage and transmission efficiency.</p>
            <section class="module-section">
                <h3>What is Data Compression?</h3>
                <p>Data compression is the process of encoding information using fewer bits than the original representation. This is useful for saving storage space and reducing the time and bandwidth needed to transmit data.</p>
            </section>
            <section class="module-section">
                <h3>Lossless vs. Lossy Compression</h3>
                <p>Understand the two main types of compression:</p>
                <ul>
                    <li><strong>Lossless:</strong> The original data can be perfectly reconstructed from the compressed data (e.g., ZIP, GZIP, PNG for simple images). Used for text, code, and data where accuracy is critical.</li>
                    <li><strong>Lossy:</strong> Some information is discarded during compression, so the original data cannot be perfectly restored, but the reduction in size is much greater (e.g., JPEG for images, MP3 for audio, MP4 for video). Used for multimedia where small imperfections are often acceptable.</li>
                </ul>
            </section>
             <section class="module-section">
                 <h3>Common Compression Algorithms</h3>
                 <p>Learn about algorithms like Huffman Coding, Lempel-Ziv (LZ77, LZ78, LZW), and run-length encoding.</p>
                 </section>
             <button class="start-quiz" data-quiz="compression">Start Compression Quiz</button>
        `,
         // Define quiz questions for the compression module
        quiz: [
            {
                question: "Which type of compression allows the original data to be perfectly reconstructed?",
                options: ["Lossy", "Lossless", "Hashing", "Encryption"],
                answer: "Lossless"
            },
            {
                question: "JPEG is typically used for which type of compression?",
                options: ["Lossless", "Lossy", "Symmetric", "Asymmetric"],
                answer: "Lossy"
            },
             {
                question: "What is a common application for lossless compression?",
                options: ["Streaming video", "Storing digital photos", "Compressing text documents", "Playing music files"],
                answer: "Compressing text documents"
            }
            // Add more compression quiz questions here
        ]
    },
    hashing: {
        title: 'Hashing Module',
        html: `
            <h2>Hashing Module</h2>
            <p>Understand how hashing is used for data integrity and security applications.</p>
            <section class="module-section">
                <h3>What is a Hash Function?</h3>
                <p>A hash function takes an input (or 'message') and returns a fixed-size string of bytes, typically a hexadecimal number, called a 'hash value' or 'message digest'.</p>
            </section>
            <section class="module-section">
                <h3>Properties of Cryptographic Hash Functions</h3>
                <p>Good cryptographic hash functions have key properties:</p>
                <ul>
                    <li><strong>Deterministic:</strong> The same input always produces the same output.</li>
                    <li><strong>One-way:</strong> It's computationally infeasible to reverse the process and get the input from the output.</li>
                    <li><strong>Collision Resistance:</strong> It's computationally infeasible to find two different inputs that produce the same output.</li>
                </ul>
            </section>
             <section class="module-section">
                 <h3>Uses of Hashing</h3>
                 <p>Hashing is widely used for:</p>
                 <ul>
                     <li>Verifying data integrity (checking if a file has been altered).</li>
                     <li>Storing passwords securely (storing the hash of the password instead of the password itself).</li>
                     <li>Creating digital signatures.</li>
                 </ul>
             </section>
             <section class="module-section">
                 <h3>Common Hash Algorithms</h3>
                 <p>Examples include SHA-256, SHA-3, and MD5 (though MD5 is considered insecure for some applications due to collision vulnerabilities).</p>
             </section>
             <button class="start-quiz" data-quiz="hashing">Start Hashing Quiz</button>
        `,
         // Define quiz questions for the hashing module
        quiz: [
            {
                question: "What is the output of a hash function called?",
                options: ["Encryption key", "Compressed file", "Message digest", "Algorithm"],
                answer: "Message digest"
            },
            {
                question: "A good cryptographic hash function should be 'one-way'. What does this mean?",
                options: ["It only works in one direction (encryption)", "It's easy to get the input from the output", "It's computationally infeasible to get the input from the output", "It only accepts one type of input"],
                answer: "It's computationally infeasible to get the input from the output"
            },
             {
                question: "Which property means it's hard to find two different inputs that produce the same hash output?",
                options: ["Deterministic", "One-way", "Collision Resistance", "Fixed-size output"],
                answer: "Collision Resistance"
            }
            // Add more hashing quiz questions here
        ]
    },
    profile: {
        title: 'My Progress',
        html: `
            <h2>My Progress</h2>
            <p>Enter your Pseudoid below to load or save your progress and quiz scores.</p>

            <section class="module-section" id="profile-input-section">
                <label for="pseudoid-input">Pseudoid:</label>
                <input type="text" id="pseudoid-input" placeholder="Enter your unique ID">
                <button id="load-progress-button">Load Progress</button>
                <button id="save-progress-button">Save Progress</button>
                <span id="current-pseudoid-display">No Pseudoid Loaded</span>
            </section>

            <section class="module-section">
                <h3>Completed Modules:</h3>
                <div id="completed-modules">No modules completed yet.</div> </section>

            <section class="module-section">
                <h3>Quiz Scores:</h3>
                <div id="quiz-scores">No quiz scores recorded yet.</div> </section>

             <section class="module-section">
                <h3>Account Settings (Placeholder)</h3>
                <p>Settings options would go here if needed.</p>
            </section>
        `,
        // Add an init function specifically for the profile page
        init: function(contentElement) {
             console.log('Initializing profile module...');
             const pseudoidInput = contentElement.querySelector('#pseudoid-input');
             const loadButton = contentElement.querySelector('#load-progress-button');
             const saveButton = contentElement.querySelector('#save-progress-button');
             const currentPseudoidDisplay = contentElement.querySelector('#current-pseudoid-display');
             const completedModulesDiv = contentElement.querySelector('#completed-modules');
             const quizScoresDiv = contentElement.querySelector('#quiz-scores');

             let currentPseudoid = null; // Variable to store the currently loaded pseudoid

             // Function to update the displayed pseudoid
             function updatePseudoidDisplay(pseudoid) {
                 currentPseudoid = pseudoid; // Update the variable
                 if (pseudoid) {
                     currentPseudoidDisplay.textContent = `Current Pseudoid: ${pseudoid}`;
                     currentPseudoidDisplay.style.color = '#28a745'; // Green color
                 } else {
                     currentPseudoidDisplay.textContent = 'No Pseudoid Loaded';
                     currentPseudoidDisplay.style.color = '#dc3545'; // Red color
                 }
             }

             // Function to display progress data on the page
             function displayProgress(progress) {
                 if (progress) {
                     completedModulesDiv.innerHTML = progress.completedModules && progress.completedModules.length > 0 ? progress.completedModules.join(', ') : 'No modules completed yet.';
                     if (progress.quizScores && Object.keys(progress.quizScores).length > 0) {
                         quizScoresDiv.innerHTML = Object.entries(progress.quizScores)
                             .map(([quizType, score]) => `<p>${quizType}: ${score.score}/${score.total}</p>`)
                             .join('');
                     } else {
                         quizScoresDiv.innerHTML = 'No quiz scores recorded yet.';
                     }
                 } else {
                     // Clear displayed progress if no data is provided
                     completedModulesDiv.innerHTML = 'No modules completed yet.';
                     quizScoresDiv.innerHTML = 'No quiz scores recorded yet.';
                 }
             }


             // Function to load progress from IndexedDB
             async function loadProgress(pseudoid) {
                 if (!pseudoid) {
                     alert('Please enter a Pseudoid to load progress.');
                     return;
                 }
                 try {
                     const progress = await getProgress(pseudoid); // Use the IndexedDB helper
                     if (progress) {
                         console.log('Loaded progress:', progress);
                         displayProgress(progress); // Display the loaded data
                         alert(`Progress loaded for Pseudoid: ${pseudoid}`);
                         updatePseudoidDisplay(pseudoid);
                     } else {
                         alert(`No saved progress found for Pseudoid: ${pseudoid}`);
                         displayProgress(null); // Clear displayed progress
                         updatePseudoidDisplay(''); // Clear display if not found
                     }
                 } catch (error) {
                     console.error('Error loading progress:', error);
                     alert('An error occurred while loading progress.');
                     displayProgress(null);
                     updatePseudoidDisplay('');
                 }
             }

             // Function to save progress to IndexedDB
             async function saveCurrentProgress() {
                 if (!currentPseudoid) {
                     alert('Please load or enter a Pseudoid first.');
                     return;
                 }
                 // TODO: Collect current progress data (e.g., completed modules, quiz scores)
                 // This is a placeholder. You would need a way to track completed modules
                 // and quiz scores globally or fetch them here.
                 const currentProgressData = {
                     pseudoid: currentPseudoid,
                     completedModules: ['Encryption Basics'], // Placeholder
                     quizScores: {
                         'encryption-types': { score: 3, total: 5 }, // Placeholder
                         'compression': { score: 2, total: 3 } // Placeholder
                     }
                 };

                 try {
                     await saveProgress(currentProgressData); // Use the IndexedDB helper
                     alert(`Progress saved for Pseudoid: ${currentPseudoid}`);
                     console.log('Saved progress:', currentProgressData);
                     // Optionally refresh the displayed progress after saving
                     displayProgress(currentProgressData);
                 } catch (error) {
                     console.error('Error saving progress:', error);
                     alert('An error occurred while saving progress.');
                 }
             }


             // Add event listeners to the buttons
             if (loadButton) {
                 loadButton.addEventListener('click', () => {
                     const pseudoid = pseudoidInput.value.trim();
                     loadProgress(pseudoid);
                 });
             }
             if (saveButton) {
                 saveButton.addEventListener('click', saveCurrentProgress); // Call saveCurrentProgress
             }

             // Optional: Load progress automatically if a pseudoid is already saved in session/local storage
             // For simplicity, we'll just wait for the user to click Load.

             console.log('Profile module initialization complete.');
        }
    },
     // Optional: Add a 'notfound' module
     notfound: {
         title: 'Module Not Found',
         html: `
             <h2>Module Not Found</h2>
             <p>The requested learning module could not be loaded.</p>
             <p>Please use the navigation bar to select a valid module.</p>
         `
     }
};

// You could add other data or functions here if needed by modules.js
