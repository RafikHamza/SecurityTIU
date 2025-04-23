<div class="module-section">
                        <h3>Hash Collisions</h3>
                        <p>Due to the pigeonhole principle, collisions are inevitable when mapping a larger set of inputs to a smaller set of outputs. Good hash functions minimize these collisions.</p>
                        
                        <div id="hash-demo" class="interactive-demo">
                            <p>Click "Try It" to see a basic hash function in action</p>
                            <button class="demo-button" data-demo="hash-demo">Try It</button>
                        </div>
                    </div>
                    
                    <div class="quiz-container">
                        <h3>Knowledge Check</h3>
                        <button class="quiz-button" data-quiz="hashing-intro">Take Quiz</button>
                    </div>
                </div>
            `,
            
            algorithms: `
                <div class="lesson">
                    <h2>Common Hash Algorithms</h2>
                    <p>Various hash algorithms have been developed for different purposes, from simple checksum calculations to secure cryptographic functions.</p>
                    
                    <div class="module-section">
                        <h3>Simple Hash Functions</h3>
                        <p>Basic algorithms like CRC32 (Cyclic Redundancy Check), used for error detection in digital networks and storage devices.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>MD5 and SHA Family</h3>
                        <p>More complex algorithms developed for security applications, though some (like MD5) are no longer considered secure for cryptographic purposes.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Modern Hash Functions</h3>
                        <p>Current secure hash algorithms like SHA-256, SHA-3, and BLAKE2 that provide strong security properties for various applications.</p>
                    </div>
                    
                    <div class="quiz-container">
                        <h3>Knowledge Check</h3>
                        <button class="quiz-button" data-quiz="hashing-algorithms">Take Quiz</button>
                    </div>
                </div>
            `,
            
            tables: `
                <div class="lesson">
                    <h2>Hash Tables</h2>
                    <p>Hash tables are data structures that use hash functions to map keys to values for highly efficient lookup operations.</p>
                    
                    <div class="module-section">
                        <h3>How Hash Tables Work</h3>
                        <p>Hash tables use a hash function to compute an index into an array of buckets, from which the desired value can be found.</p>
                        
                        <div id="hashtable-demo" class="interactive-demo">
                            <p>Click "Try It" to see a hash table in action</p>
                            <button class="demo-button" data-demo="hashtable-demo">Try It</button>
                        </div>
                    </div>
                    
                    <div class="module-section">
                        <h3>Collision Resolution</h3>
                        <p>Techniques like chaining and open addressing are used to handle the inevitable collisions that occur in hash tables.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Performance Considerations</h3>
                        <p>The efficiency of hash tables depends on the quality of the hash function, the load factor, and the collision resolution strategy.</p>
                    </div>
                    
                    <div class="quiz-container">
                        <h3>Knowledge Check</h3>
                        <button class="quiz-button" data-quiz="hashing-tables">Take Quiz</button>
                    </div>
                </div>
            `,
            
            crypto: `
                <div class="lesson">
                    <h2>Cryptographic Hashing</h2>
                    <p>Cryptographic hash functions provide additional security properties that make them suitable for security-sensitive applications.</p>
                    
                    <div class="module-section">
                        <h3>Security Properties</h3>
                        <p>Cryptographic hash functions must be preimage resistant (hard to reverse), second preimage resistant (hard to find another input with same hash), and collision resistant (hard to find any two inputs with same hash).</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Password Hashing</h3>
                        <p>Special algorithms like bcrypt, Argon2, and PBKDF2 are designed specifically for secure password storage, with features like salting and computational intensity.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>HMAC</h3>
                        <p>Hash-based Message Authentication Codes combine hashing with a secret key to provide both authentication and integrity verification.</p>
                    </div>
                    
                    <div class="quiz-container">
                        <h3>Knowledge Check</h3>
                        <button class="quiz-button" data-quiz="hashing-crypto">Take Quiz</button>
                    </div>
                </div>
            `,
            
            applications: `
                <div class="lesson">
                    <h2>Practical Applications of Hashing</h2>
                    <p>Hash functions are used in numerous applications across computing and security.</p>
                    
                    <div class="module-section">
                        <h3>Data Integrity Verification</h3>
                        <p>File checksums and digital signatures use hash functions to verify that data hasn't been modified during transmission or storage.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Blockchain Technology</h3>
                        <p>Cryptocurrencies like Bitcoin rely on cryptographic hash functions for their proof-of-work systems and to link blocks in the chain.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Data Deduplication</h3>
                        <p>Storage systems use hash functions to identify and eliminate duplicate data, saving space while maintaining data integrity.</p>
                    </div>
                    
                    <div class="quiz-container">
                        <h3>Knowledge Check</h3>
                        <button class="quiz-button" data-quiz="hashing-applications">Take Quiz</button>
                    </div>
                </div>
            `
        },
        
        // Quiz questions for each hashing lesson
        quizzes: {
            intro: [
                {
                    text: "What is the main purpose of a hash function?",
                    options: ["To encrypt sensitive data", "To compress data for storage", "To map data of arbitrary size to fixed-size values", "To translate between programming languages"],
                    correctIndex: 2
                },
                {
                    text: "What is a hash collision?",
                    options: ["When a hash function crashes the program", "When two different inputs produce the same hash output", "When a hash function is too slow to compute", "When a hash value exceeds the maximum allowed size"],
                    correctIndex: 1
                },
                {
                    text: "Which of these is NOT a desirable property of a general-purpose hash function?",
                    options: ["Fast to compute", "Uniformly distributed outputs", "Predictable patterns in output", "Minimal collisions"],
                    correctIndex: 2
                },
                {
                    text: "Why is it impossible to completely eliminate hash collisions for all possible inputs?",
                    options: ["Hash algorithms are not powerful enough yet", "Modern computers lack sufficient processing power", "The pigeonhole principle (mapping from a larger set to a smaller set)", "Hash functions contain inherent design flaws"],
                    correctIndex: 2
                }
            ],
            
            algorithms: [
                {
                    text: "What is CRC32 primarily used for?",
                    options: ["Secure password storage", "Error detection in digital networks", "Database indexing", "Encrypting files"],
                    correctIndex: 1
                },
                {
                    text: "Why is MD5 no longer recommended for security-sensitive applications?",
                    options: ["It's too slow", "It produces hashes that are too short", "It has known collision vulnerabilities", "It's proprietary and expensive"],
                    correctIndex: 2
                },
                {
                    text: "What is the output size of the SHA-256 algorithm?",
                    options: ["128 bits", "160 bits", "256 bits", "512 bits"],
                    correctIndex: 2
                },
                {
                    text: "Which hash function family was selected as the winner of the NIST hash function competition in 2012?",
                    options: ["MD6", "BLAKE", "Skein", "Keccak (now SHA-3)"],
                    correctIndex: 3
                }
            ],
            
            tables: [
                {
                    text: "What is the primary advantage of using hash tables?",
                    options: ["They use less memory than arrays", "They provide O(1) average time complexity for lookups", "They maintain sorted data", "They can only store numeric data"],
                    correctIndex: 1
                },
                {
                    text: "What is the load factor of a hash table?",
                    options: ["The number of collisions that have occurred", "The ratio of filled slots to total slots", "The average time to compute the hash function", "The maximum allowed size of the hash table"],
                    correctIndex: 1
                },
                {
                    text: "Which collision resolution technique involves creating linked lists at each bucket?",
                    options: ["Linear probing", "Double hashing", "Chaining", "Cuckoo hashing"],
                    correctIndex: 2
                },
                {
                    text: "Which of these programming language data structures is typically implemented using hash tables?",
                    options: ["Arrays", "Linked lists", "Stacks", "Dictionaries/Maps"],
                    correctIndex: 3
                }
            ],
            
            crypto: [
                {
                    text: "Which property means it should be computationally infeasible to find any input that produces a given hash?",
                    options: ["Collision resistance", "Preimage resistance", "Second preimage resistance", "Determinism"],
                    correctIndex: 1
                },
                {
                    text: "What is a 'salt' in the context of password hashing?",
                    options: ["A fixed string appended to all passwords", "Random data added to each password before hashing", "A technique to make hashing faster", "A method to recover lost passwords"],
                    correctIndex: 1
                },
                {
                    text: "Why are specialized password hashing functions like bcrypt deliberately designed to be slow?",
                    options: ["To ensure compatibility with older systems", "To make it harder for attackers to conduct brute force attacks", "To produce longer hash outputs", "To reduce server load during peak times"],
                    correctIndex: 1
                },
                {
                    text: "What additional input does an HMAC use beyond what a regular hash function requires?",
                    options: ["A timestamp", "A secret key", "A counter value", "A random initialization vector"],
                    correctIndex: 1
                }
            ],
            
            applications: [
                {
                    text: "How are hash functions used in file verification systems?",
                    options: ["To compress the files for faster download", "To encrypt the files for security", "To calculate checksums that can verify file integrity", "To preview the file contents"],
                    correctIndex: 2
                },
                {
                    text: "In blockchain technology, what role do hash functions play?",
                    options: ["They encrypt the transactions for privacy", "They link blocks together and provide the proof-of-work challenge", "They compress the blockchain to save space", "They provide user authentication"],
                    correctIndex: 1
                },
                {
                    text: "How can hash functions help with data deduplication?",
                    options: ["By encrypting duplicate data", "By identifying identical data through their hash values", "By compressing similar files together", "By marking duplicates for manual review"],
                    correctIndex: 1
                },
                {
                    text: "Which of these is NOT a common application of hash functions?",
                    options: ["Digital signatures", "Content addressing in distributed systems", "Full disk encryption", "Finding similar items (locality-sensitive hashing)"],
                    correctIndex: 2
                }
            ]
        }
    }
};

// Export the modules object for use in main.js
export default modules;
