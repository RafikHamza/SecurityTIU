// modules.js

// This file stores the content and data for each learning module.
// Export an object where keys are module names (matching data-module attributes)
// and values contain the HTML content and potentially quiz questions.

export const modules = {
    home: {
        title: 'Welcome!',
        html: `
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
        `
    },
    encryption: {
        title: 'Encryption Module',
        html: `
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
        `,
        // Define quiz questions for the encryption module
        quiz: [
            {
                question: "What is the primary purpose of encryption?",
                options: ["To reduce file size", "To verify data integrity", "To secure data from unauthorized access", "To convert data to a different format"],
                answer: "To secure data from unauthorized access"
            },
            {
                question: "Which type of encryption uses the same key for both encryption and decryption?",
                options: ["Symmetric", "Asymmetric", "Hashing", "Compression"],
                answer: "Symmetric"
            },
            {
                question: "RSA is an example of which type of encryption?",
                options: ["Symmetric", "Asymmetric", "Lossless", "Lossy"],
                answer: "Asymmetric"
            }
            // Add more encryption quiz questions here
        ]
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
            <p>View your learning progress and quiz results here.</p>
            <section class="module-section">
                <h3>Student Dashboard</h3>
                <p>This section would ideally show personalized progress, completed modules, and quiz scores.</p>
                <p><em>Implementing a full profile and progress tracking system requires backend storage (like IndexedDB or a server-side database) and user authentication.</em></p>
                 <h4>Completed Modules:</h4>
                 <p id="completed-modules">None yet.</p> <h4>Quiz Scores:</h4>
                 <div id="quiz-scores">No scores recorded.</div> </section>
            <section class="module-section">
                <h3>Account Settings</h3>
                <p>Area for user settings (if applicable).</p>
            </section>
        `
        // Profile page typically doesn't have a quiz directly
    }
};

// You could add other data or functions here if needed by modules.js
