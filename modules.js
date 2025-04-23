const modules = {
    // Home page content
    home: `
        <div class="home-page">
            <h2>Welcome to Cryptography & Data Learning Hub</h2>
            <p>Learn the fundamentals of encryption, compression algorithms, and hash functions through interactive lessons and hands-on examples.</p>
            
            <div class="module-cards">
                <div class="module-card">
                    <h3>Encryption</h3>
                    <p>Learn how to secure data using various encryption techniques.</p>
                    <button class="module-btn" data-module="encryption">Start Learning</button>
                </div>
                
                <div class="module-card">
                    <h3>Compression</h3>
                    <p>Understand how data compression algorithms reduce file sizes.</p>
                    <button class="module-btn" data-module="compression">Start Learning</button>
                </div>
                
                <div class="module-card">
                    <h3>Hashing</h3>
                    <p>Explore how hash functions work and their applications.</p>
                    <button class="module-btn" data-module="hashing">Start Learning</button>
                </div>
            </div>
        </div>
    `,
    
    // Encryption module
    encryption: {
        intro: `
            <div class="module-intro">
                <h2>Encryption Fundamentals</h2>
                <p>Encryption is the process of encoding information so that only authorized parties can access it.</p>
                
                <h3>In this module, you'll learn:</h3>
                <ul>
                    <li>Classical ciphers and their history</li>
                    <li>Symmetric encryption algorithms</li>
                    <li>Asymmetric (public key) encryption</li>
                    <li>Digital signatures and certificates</li>
                    <li>Modern encryption applications</li>
                </ul>
                
                <div class="lesson-navigation">
                    <h3>Lessons:</h3>
                    <button class="lesson-btn" data-lesson="classical">1. Classical Ciphers</button>
                    <button class="lesson-btn" data-lesson="symmetric">2. Symmetric Encryption</button>
                    <button class="lesson-btn" data-lesson="asymmetric">3. Asymmetric Encryption</button>
                    <button class="lesson-btn" data-lesson="digital">4. Digital Signatures</button>
                    <button class="lesson-btn" data-lesson="applications">5. Modern Applications</button>
                </div>
            </div>
        `,
        
        lessons: {
            classical: `
                <div class="lesson">
                    <h2>Classical Ciphers</h2>
                    <p>Classical ciphers represent the earliest forms of encryption, used throughout history to protect sensitive communications.</p>
                    
                    <div class="module-section">
                        <h3>The Caesar Cipher</h3>
                        <p>One of the simplest and oldest known encryption techniques, named after Julius Caesar who used it to communicate with his generals.</p>
                        
                        <p>The Caesar cipher works by shifting each letter in the plaintext by a fixed number of positions in the alphabet.</p>
                        
                        <div id="caesar-demo" class="interactive-demo">
                            <p>Click "Try It" to use an interactive Caesar cipher demo</p>
                            <button class="demo-button" data-demo="caesar-demo">Try It</button>
                        </div>
                    </div>
                    
                    <div class="module-section">
                        <h3>Substitution Ciphers</h3>
                        <p>A more complex version of the Caesar cipher, substitution ciphers replace each letter with another letter or symbol based on a predefined key.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Transposition Ciphers</h3>
                        <p>These ciphers rearrange the order of letters in a message rather than replacing them, often using geometric patterns or matrices.</p>
                    </div>
                    
                    <div class="quiz-container">
                        <h3>Knowledge Check</h3>
                        <button class="quiz-button" data-quiz="encryption-classical">Take Quiz</button>
                    </div>
                </div>
            `,
            
            symmetric: `
                <div class="lesson">
                    <h2>Symmetric Encryption</h2>
                    <p>Symmetric encryption uses the same key for both encryption and decryption, making it fast but requiring secure key exchange.</p>
                    
                    <div class="module-section">
                        <h3>Data Encryption Standard (DES)</h3>
                        <p>Developed in the 1970s, DES was the first widely-used block cipher standardized for public use.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Advanced Encryption Standard (AES)</h3>
                        <p>The current standard for symmetric encryption, offering excellent security and performance.</p>
                        
                        <div id="aes-demo" class="interactive-demo">
                            <p>Click "Try It" to use an interactive AES encryption demo</p>
                            <button class="demo-button" data-demo="aes-demo">Try It</button>
                        </div>
                    </div>
                    
                    <div class="module-section">
                        <h3>Stream Ciphers</h3>
                        <p>Encryption algorithms that encrypt data one bit or byte at a time, often used in situations where data size is not known in advance.</p>
                    </div>
                    
                    <div class="quiz-container">
                        <h3>Knowledge Check</h3>
                        <button class="quiz-button" data-quiz="encryption-symmetric">Take Quiz</button>
                    </div>
                </div>
            `,
            
            asymmetric: `
                <div class="lesson">
                    <h2>Asymmetric Encryption</h2>
                    <p>Asymmetric encryption uses a pair of keys: a public key for encryption and a private key for decryption, solving the key distribution problem.</p>
                    
                    <div class="module-section">
                        <h3>RSA Algorithm</h3>
                        <p>Named after its inventors (Rivest, Shamir, Adleman), RSA is based on the mathematical difficulty of factoring large prime numbers.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Elliptic Curve Cryptography (ECC)</h3>
                        <p>A modern approach that uses the mathematics of elliptic curves to provide the same security level as RSA with smaller keys.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Key Exchange</h3>
                        <p>Methods for
