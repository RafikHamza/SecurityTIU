document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Get the main content area element
    const contentArea = document.getElementById('content');
    if (!contentArea) {
        console.error('Content area with id="content" not found. Cannot proceed.');
        return; // Stop execution if the content area isn't found
    }

    // Function to load content into the main area based on the module name
    function loadContent(moduleName) {
        console.log(`Attempting to load module: ${moduleName}`);

        let htmlContent = ''; // Variable to hold the HTML content for the module

        // Use a switch statement to determine which content to load
        switch (moduleName) {
            case 'home':
                htmlContent = `
                    <h2>Welcome to the Cryptography & Data Learning Hub!</h2>
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
                    </section>
                    <section class="module-section">
                         <h3>Latest Updates</h3>
                         <p>Stay tuned for new modules and features!</p>
                         </section>
                `;
                console.log('Home module content prepared.');
                break;

            case 'encryption':
                htmlContent = `
                    <h2>Encryption Module</h2>
                    <p>Learn how to protect your data using various encryption techniques.</p>
                    <section class="module-section">
                        <h3>What is Encryption?</h3>
                        <p>Encryption is the process of converting data into a code to prevent unauthorized access. This is done using an algorithm and a key. Only someone with the correct key can decrypt the data back into its original form.</p>
                    </section>
                    <section class="module-section">
                        <h3>Symmetric vs. Asymmetric Encryption</h3>
                        <p>Explore the difference between symmetric encryption (using the same key for encryption and decryption) and asymmetric encryption (using a pair of public and private keys).</p>
                        <h4>Symmetric Examples:</h4>
                        <ul>
                            <li>AES (Advanced Encryption Standard)</li>
                            <li>DES (Data Encryption Standard - largely outdated)</li>
                        </ul>
                         <h4>Asymmetric Examples:</h4>
                        <ul>
                            <li>RSA (Rivest–Shamir–Adleman)</li>
                            <li>ECC (Elliptic Curve Cryptography)</li>
                        </ul>
                    </section>
                     <section class="module-section">
                         <h3>How Encryption Works (Simplified)</h3>
                         <p>Imagine scrambling a message so only your friend with a special decoder ring can read it. The scrambling is encryption, the decoder ring is the key.</p>
                         </section>
                    <button class="start-quiz" data-quiz="encryption">Start Encryption Quiz</button>
                `;
                console.log('Encryption module content prepared.');
                break;

            case 'compression':
                htmlContent = `
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
                `;
                console.log('Compression module content prepared.');
                break;

            case 'hashing':
                htmlContent = `
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
                `;
                console.log('Hashing module content prepared.');
                break;

            case 'profile':
                htmlContent = `
                    <h2>My Progress</h2>
                    <p>View your learning progress and quiz results here.</p>
                    <section class="module-section">
                        <h3>Student Dashboard</h3>
                        <p>This section would ideally show personalized progress, completed modules, and quiz scores.</p>
                        <p><em>Implementing a full profile and progress tracking system requires backend storage (like IndexedDB or a server-side database) and user authentication.</em></p>
                        <h4>Completed Modules:</h4>
                         <p>None yet.</p> <h4>Quiz Scores:</h4>
                         <p>No scores recorded.</p> </section>
                    <section class="module-section">
                        <h3>Account Settings</h3>
                        <p>Area for user settings (if applicable).</p>
                         </section>
                    `;
                console.log('Profile module content prepared.');
                // Note: Profile page typically doesn't have a quiz button directly
                break;

            default:
                // Fallback content for unknown modules
                htmlContent = `
                    <h2>Module Not Found</h2>
                    <p>The requested learning module could not be loaded.</p>
                    <p>Please use the navigation bar to select a valid module.</p>
                `;
                console.warn(`Unknown module requested: ${moduleName}`);
        }

        // Update the content area with the generated HTML
        contentArea.innerHTML = htmlContent;
        console.log(`Content for ${moduleName} loaded into the DOM.`);

        // After loading content, check for and attach event listeners to any quiz buttons
        // This needs to be done *after* the new content is added to the DOM
        if (moduleName !== 'home' && moduleName !== 'profile') { // Only add quiz button listener to module pages
             const quizButton = contentArea.querySelector('.start-quiz');
             if (quizButton) {
                 console.log(`Found quiz button for ${moduleName}. Attaching listener.`);
                 quizButton.addEventListener('click', handleQuizButtonClick);
             } else {
                 console.log(`No quiz button found for ${moduleName}.`);
             }
         }

        // TODO: Add logic here to initialize other interactive elements within the loaded content
        // For example, if a module has interactive diagrams or exercises, you would
        // find those elements here and attach their event listeners.
    }

    // Function to handle quiz button clicks (placeholder)
    function handleQuizButtonClick(event) {
        const quizType = event.target.getAttribute('data-quiz');
        console.log(`Quiz button clicked for: ${quizType}`);
        // ==============================================================
        // TODO: IMPLEMENT YOUR QUIZ MODAL DISPLAY AND QUIZ LOADING LOGIC HERE
        // This function should:
        // 1. Prevent default button behavior if necessary (though not usually needed for simple buttons)
        // 2. Get the quiz type from the button's data-quiz attribute.
        // 3. Fetch or generate the questions for that quiz type.
        // 4. Populate the #quiz-modal with the quiz content.
        // 5. Display the #quiz-modal.
        // 6. Add event listeners for quiz interactions (e.g., answer selection, submit).
        // ==============================================================
        alert(`Quiz feature for ${quizType} is not yet fully implemented.\n\nThis is where you would load and display the quiz questions.`); // Placeholder action
    }


    // Add event listeners to all navigation buttons in the header's nav
    const navButtons = document.querySelectorAll('header nav button');
    console.log(`Found ${navButtons.length} navigation buttons in the header.`);

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const moduleName = button.getAttribute('data-module');
            if (moduleName) {
                console.log(`Navigation button clicked: ${moduleName}`);
                loadContent(moduleName); // Load the content for the clicked module

                // Optional: Update active state of nav buttons for visual feedback
                navButtons.forEach(btn => btn.classList.remove('active')); // Remove active class from all buttons
                button.classList.add('active'); // Add active class to the clicked button
            } else {
                console.warn('Navigation button missing data-module attribute:', button);
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
    // TODO: ADD LOGIC FOR MODALS HERE
    // This section would handle the display and interaction of your
    // #auth-modal and #quiz-modal elements.
    //
    // Example:
    // const authModal = document.getElementById('auth-modal');
    // const quizModal = document.getElementById('quiz-modal');
    //
    // Functions to open/close modals:
    // function openModal(modalElement) { modalElement.style.display = 'block'; }
    // function closeModal(modalElement) { modalElement.style.display = 'none'; }
    //
    // Add event listeners to open modals (e.g., a login button on the home page)
    // Add event listeners to close modals (e.g., a close button or clicking outside the modal)
    // Add event listeners for form submissions within modals (e.g., login/registration forms)
    // ==============================================================

    console.log('main.js initialization complete.');
});

// NOTE ABOUT modules.js:
// Based on your file structure, you might have intended modules.js to hold
// the actual content or logic for each module. If so, you would modify this
// main.js to import or access that content from modules.js instead of having
// the HTML strings directly in the loadContent function.
// For example, modules.js could export an object like:
// export const modules = {
//     encryption: { title: 'Encryption', html: '<p>Encryption content...</p>', quiz: [...] },
//     compression: { title: 'Compression', html: '<p>Compression content...</p>', quiz: [...] },
//     // etc.
// };
// And then in main.js:
// import { modules } from './modules.js';
// function loadContent(moduleName) {
//     const moduleData = modules[moduleName];
//     if (moduleData) {
//         contentArea.innerHTML = `<h2>${moduleData.title}</h2>${moduleData.html}`;
//         // ... logic for quiz button if moduleData.quiz exists ...
//     } else {
//         // handle unknown module
//     }
// }
// The current code keeps all content definition within main.js for simplicity,
// assuming modules.js might be used for other purposes or is not yet structured
// to hold module content this way.
