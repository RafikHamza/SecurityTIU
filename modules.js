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
                        <p>Methods for securely exchanging keys over an insecure channel, including the Diffie-Hellman key exchange protocol.</p>
                    </div>
                    
                    <div class="quiz-container">
                        <h3>Knowledge Check</h3>
                        <button class="quiz-button" data-quiz="encryption-asymmetric">Take Quiz</button>
                    </div>
                </div>
            `,
            
            digital: `
                <div class="lesson">
                    <h2>Digital Signatures</h2>
                    <p>Digital signatures provide authentication, integrity, and non-repudiation for electronic documents and communications.</p>
                    
                    <div class="module-section">
                        <h3>How Digital Signatures Work</h3>
                        <p>Digital signatures use asymmetric cryptography to create a unique fingerprint that verifies the sender's identity and ensures the message hasn't been altered.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Public Key Infrastructure (PKI)</h3>
                        <p>The framework of technologies, policies, and procedures that enable secure digital certificate and public key management.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Certificate Authorities</h3>
                        <p>Trusted entities that issue digital certificates, binding public keys to entities such as websites, individuals, or organizations.</p>
                    </div>
                    
                    <div class="quiz-container">
                        <h3>Knowledge Check</h3>
                        <button class="quiz-button" data-quiz="encryption-digital">Take Quiz</button>
                    </div>
                </div>
            `,
            
            applications: `
                <div class="lesson">
                    <h2>Modern Encryption Applications</h2>
                    <p>Encryption is essential in modern digital life, protecting communications, data storage, and online transactions.</p>
                    
                    <div class="module-section">
                        <h3>HTTPS and TLS</h3>
                        <p>How encryption secures web browsing and protects sensitive information transmitted online.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>End-to-End Encryption</h3>
                        <p>Encryption systems where only the communicating users can read the messages, providing maximum privacy.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Disk Encryption</h3>
                        <p>Methods for protecting data at rest on storage devices, preventing unauthorized access if a device is lost or stolen.</p>
                    </div>
                    
                    <div class="quiz-container">
                        <h3>Knowledge Check</h3>
                        <button class="quiz-button" data-quiz="encryption-applications">Take Quiz</button>
                    </div>
                </div>
            `
        },
        
        // Quiz questions for each lesson
        quizzes: {
            classical: [
                {
                    text: "In a Caesar cipher with a shift of 3, what does the plaintext 'HELLO' encrypt to?",
                    options: ["KHOOR", "IFMMP", "EBIIL", "JGNNQ"],
                    correctIndex: 0
                },
                {
                    text: "Which of the following is NOT a classical cipher?",
                    options: ["Caesar Cipher", "Playfair Cipher", "AES", "Vigenère Cipher"],
                    correctIndex: 2
                },
                {
                    text: "What is the main weakness of substitution ciphers?",
                    options: ["They're too complex to use", "They can be broken using frequency analysis", "They require computers", "They only work on short messages"],
                    correctIndex: 1
                },
                {
                    text: "In a transposition cipher, what happens to the letters in the original message?",
                    options: ["They are replaced with different letters", "They are replaced with numbers", "Their order is rearranged", "They are converted to binary"],
                    correctIndex: 2
                }
            ],
            
            symmetric: [
                {
                    text: "What is the key characteristic of symmetric encryption?",
                    options: ["It uses two different keys", "It uses the same key for encryption and decryption", "It doesn't require a key", "It only works for text data"],
                    correctIndex: 1
                },
                {
                    text: "Which of the following is a symmetric encryption algorithm?",
                    options: ["RSA", "AES", "Diffie-Hellman", "ECC"],
                    correctIndex: 1
                },
                {
                    text: "What is a block cipher?",
                    options: ["A cipher that only works on blockchain technology", "A cipher that encrypts data one bit at a time", "A cipher that encrypts fixed-size blocks of data", "A cipher that only works with alphanumeric characters"],
                    correctIndex: 2
                },
                {
                    text: "What is the main challenge with symmetric encryption in communication?",
                    options: ["It's too slow", "Securely sharing the key between parties", "It can only encrypt short messages", "It requires special hardware"],
                    correctIndex: 1
                }
            ],
            
            asymmetric: [
                {
                    text: "What is the main advantage of asymmetric encryption over symmetric encryption?",
                    options: ["It's faster", "It's more secure", "It solves the key distribution problem", "It uses less computing power"],
                    correctIndex: 2
                },
                {
                    text: "In RSA encryption, which key is used to encrypt data?",
                    options: ["Master key", "Private key", "Public key", "Session key"],
                    correctIndex: 2
                },
                {
                    text: "The security of Elliptic Curve Cryptography (ECC) is based on:",
                    options: ["The difficulty of factoring large numbers", "The elliptic curve discrete logarithm problem", "The randomness of prime numbers", "The complexity of polynomial equations"],
                    correctIndex: 1
                },
                {
                    text: "What is the purpose of the Diffie-Hellman key exchange?",
                    options: ["To encrypt messages", "To generate digital signatures", "To securely establish a shared secret key", "To verify digital certificates"],
                    correctIndex: 2
                }
            ],
            
            digital: [
                {
                    text: "What does a digital signature provide?",
                    options: ["Encryption only", "Authentication and integrity", "Compression and encryption", "Faster transmission speeds"],
                    correctIndex: 1
                },
                {
                    text: "To create a digital signature, which key is used?",
                    options: ["Public key", "Private key", "Symmetric key", "Session key"],
                    correctIndex: 1
                },
                {
                    text: "What is the role of a Certificate Authority (CA)?",
                    options: ["To encrypt all internet traffic", "To issue and verify digital certificates", "To create encryption algorithms", "To hack into secure systems and test them"],
                    correctIndex: 1
                },
                {
                    text: "What information is typically contained in a digital certificate?",
                    options: ["The owner's private key", "The owner's credit card details", "The owner's public key and identity information", "The complete history of the owner's online activities"],
                    correctIndex: 2
                }
            ],
            
            applications: [
                {
                    text: "What does HTTPS use to secure web communications?",
                    options: ["SSH protocol", "TLS/SSL protocols", "FTP protocol", "SMTP protocol"],
                    correctIndex: 1
                },
                {
                    text: "What is end-to-end encryption?",
                    options: ["Encryption that only works on end devices like smartphones", "Encryption where only the communicating users can read the messages", "Encryption that works at the end of a transmission", "Encryption that automatically expires after a set time"],
                    correctIndex: 1
                },
                {
                    text: "What is the main purpose of disk encryption?",
                    options: ["To speed up disk performance", "To compress data and save space", "To protect data if a device is lost or stolen", "To prevent disk failures"],
                    correctIndex: 2
                },
                {
                    text: "Which of the following is NOT typically protected by encryption?",
                    options: ["Banking transactions", "Public website content", "Private messages", "Password storage"],
                    correctIndex: 1
                }
            ]
        }
    },
    
    // Compression module
    compression: {
        intro: `
            <div class="module-intro">
                <h2>Data Compression Fundamentals</h2>
                <p>Data compression reduces the size of files, enabling faster transmission and efficient storage of information.</p>
                
                <h3>In this module, you'll learn:</h3>
                <ul>
                    <li>Lossless vs. lossy compression</li>
                    <li>Run-length encoding</li>
                    <li>Dictionary-based compression</li>
                    <li>Huffman coding</li>
                    <li>Modern compression formats</li>
                </ul>
                
                <div class="lesson-navigation">
                    <h3>Lessons:</h3>
                    <button class="lesson-btn" data-lesson="basics">1. Compression Basics</button>
                    <button class="lesson-btn" data-lesson="rle">2. Run-Length Encoding</button>
                    <button class="lesson-btn" data-lesson="dictionary">3. Dictionary Compression</button>
                    <button class="lesson-btn" data-lesson="huffman">4. Huffman Coding</button>
                    <button class="lesson-btn" data-lesson="modern">5. Modern Formats</button>
                </div>
            </div>
        `,
        
        lessons: {
            basics: `
                <div class="lesson">
                    <h2>Compression Basics</h2>
                    <p>Data compression techniques reduce redundancy in data to decrease its size while preserving information.</p>
                    
                    <div class="module-section">
                        <h3>Lossless vs. Lossy Compression</h3>
                        <p>Lossless compression allows perfect reconstruction of the original data, while lossy compression sacrifices some detail for better compression ratios.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>When to Use Each Type</h3>
                        <p>Lossless compression is essential for text, programs, and data where accuracy is critical. Lossy compression works well for media like images, audio, and video where some loss of quality may be acceptable.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Compression Ratio</h3>
                        <p>The measure of how much a file size is reduced, calculated as (original size) / (compressed size).</p>
                    </div>
                    
                    <div class="quiz-container">
                        <h3>Knowledge Check</h3>
                        <button class="quiz-button" data-quiz="compression-basics">Take Quiz</button>
                    </div>
                </div>
            `,
            
            rle: `
                <div class="lesson">
                    <h2>Run-Length Encoding (RLE)</h2>
                    <p>Run-length encoding is one of the simplest compression techniques, replacing sequences of the same data with a count and a single value.</p>
                    
                    <div class="module-section">
                        <h3>How RLE Works</h3>
                        <p>RLE replaces sequences (runs) of repeated data with a count number and a single instance of the repeated value.</p>
                        
                        <div id="rle-demo" class="interactive-demo">
                            <p>Click "Try It" to use an interactive RLE compression demo</p>
                            <button class="demo-button" data-demo="rle-demo">Try It</button>
                        </div>
                    </div>
                    
                    <div class="module-section">
                        <h3>Advantages and Limitations</h3>
                        <p>RLE works well for data with many repeated sequences but can actually increase the size of files without many repetitions.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Common Applications</h3>
                        <p>RLE is often used in image formats like BMP and PCX, particularly for images with large areas of solid color.</p>
                    </div>
                    
                    <div class="quiz-container">
                        <h3>Knowledge Check</h3>
                        <button class="quiz-button" data-quiz="compression-rle">Take Quiz</button>
                    </div>
                </div>
            `,
            
            dictionary: `
                <div class="lesson">
                    <h2>Dictionary-Based Compression</h2>
                    <p>Dictionary-based compression algorithms build a dictionary of repeated patterns and replace them with shorter references.</p>
                    
                    <div class="module-section">
                        <h3>LZ77 and LZ78</h3>
                        <p>These algorithms look for repeated strings and replace them with references to previous occurrences, forming the basis for many modern compression systems.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>LZW Compression</h3>
                        <p>An improved dictionary-based algorithm that builds its dictionary during compression without needing to store it separately.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Applications</h3>
                        <p>Dictionary-based methods are used in ZIP files, PNG images, and many other formats due to their good balance of compression ratio and speed.</p>
                    </div>
                    
                    <div class="quiz-container">
                        <h3>Knowledge Check</h3>
                        <button class="quiz-button" data-quiz="compression-dictionary">Take Quiz</button>
                    </div>
                </div>
            `,
            
            huffman: `
                <div class="lesson">
                    <h2>Huffman Coding</h2>
                    <p>Huffman coding is an entropy encoding algorithm that assigns variable-length codes to input characters based on their frequencies.</p>
                    
                    <div class="module-section">
                        <h3>How Huffman Coding Works</h3>
                        <p>More frequent characters get shorter codes, while less frequent characters get longer codes, minimizing the average code length.</p>
                        
                        <div id="huffman-demo" class="interactive-demo">
                            <p>Click "Try It" to use an interactive Huffman coding demo</p>
                            <button class="demo-button" data-demo="huffman-demo">Try It</button>
                        </div>
                    </div>
                    
                    <div class="module-section">
                        <h3>Building a Huffman Tree</h3>
                        <p>The algorithm builds a binary tree from the bottom up based on character frequencies, with the path to each leaf node representing its code.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Applications</h3>
                        <p>Huffman coding is used in JPEG, MP3, and many archive formats, often in combination with other compression techniques.</p>
                    </div>
                    
                    <div class="quiz-container">
                        <h3>Knowledge Check</h3>
                        <button class="quiz-button" data-quiz="compression-huffman">Take Quiz</button>
                    </div>
                </div>
            `,
            
            modern: `
                <div class="lesson">
                    <h2>Modern Compression Formats</h2>
                    <p>Modern compression formats combine multiple techniques to achieve the best balance of compression ratio, speed, and versatility.</p>
                    
                    <div class="module-section">
                        <h3>ZIP and GZIP</h3>
                        <p>Popular general-purpose lossless compression formats that use a combination of LZ77 and Huffman coding.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Image Compression</h3>
                        <p>JPEG (lossy), PNG (lossless), and WebP (both modes) each serve different purposes in image compression.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Video and Audio Compression</h3>
                        <p>Modern formats like H.265 for video and Opus for audio use sophisticated psychovisual and psychoacoustic models combined with advanced compression techniques.</p>
                    </div>
                    
                    <div class="quiz-container">
                        <h3>Knowledge Check</h3>
                        <button class="quiz-button" data-quiz="compression-modern">Take Quiz</button>
                    </div>
                </div>
            `
        },
        
        // Quiz questions for each lesson
        quizzes: {
            basics: [
                {
                    text: "What is the main difference between lossless and lossy compression?",
                    options: ["Lossless is faster", "Lossless allows perfect reconstruction of the original data", "Lossy works only on text files", "Lossy requires specialized hardware"],
                    correctIndex: 1
                },
                {
                    text: "Which type of compression would be most appropriate for compressing executable program files?",
                    options: ["Lossy compression", "Lossless compression", "Either would work equally well", "Neither - program files should never be compressed"],
                    correctIndex: 1
                },
                {
                    text: "A compression ratio of 10:1 means:",
                    options: ["The compressed file is 10 times larger than the original", "The original file is 10 times larger than the compressed file", "The compression process took 10 times longer than normal", "The file was compressed 10 times consecutively"],
                    correctIndex: 1
                },
                {
                    text: "Which of the following would likely benefit most from lossy compression?",
                    options: ["A database of financial records", "Source code for a software application", "A high-resolution photograph", "A configuration file"],
                    correctIndex: 2
                }
            ],
            
            rle: [
                {
                    text: "In Run-Length Encoding, the sequence 'AAABBBCCC' would be encoded as:",
                    options: ["3A3B3C", "AAA BBB CCC", "A3B3C3", "Cannot be encoded with RLE"],
                    correctIndex: 0
                },
                {
                    text: "When is Run-Length Encoding most efficient?",
                    options: ["When data has many different values in sequence", "When data has long runs of the same value", "When data is encrypted", "When data is already compressed"],
                    correctIndex: 1
                },
                {
                    text: "Which type of image would compress well with RLE?",
                    options: ["A detailed photograph of a forest", "A barcode", "A complex gradient", "A screenshot with many different colors"],
                    correctIndex: 1
                },
                {
                    text: "What happens if you apply RLE to data with no repeated sequences?",
                    options: ["The compressed result will be smaller", "The compressed result will be the same size", "The compressed result will be larger", "RLE will fail to compress it at all"],
                    correctIndex: 2
                }
            ],
            
            dictionary: [
                {
                    text: "What is the basic principle behind dictionary-based compression?",
                    options: ["Replacing repeated sequences with references to previous occurrences", "Encoding characters based on their frequency", "Removing all vowels from text data", "Converting data to a different number base"],
                    correctIndex: 0
                },
                {
                    text: "LZW compression is different from LZ77 because:",
                    options: ["LZW is lossy while LZ77 is lossless", "LZW builds a dictionary during compression", "LZW only works on text files", "LZW was invented much later"],
                    correctIndex: 1
                },
                {
                    text: "Which file format commonly uses dictionary-based compression?",
                    options: ["MP3", "JPEG", "ZIP", "WAV"],
                    correctIndex: 2
                },
                {
                    text: "What type of data compresses well with dictionary-based methods?",
                    options: ["Random noise", "Encrypted data", "Text with repeated phrases or patterns", "High-entropy data"],
                    correctIndex: 2
                }
            ],
            
            huffman: [
                {
                    text: "In Huffman coding, which characters get the shortest codes?",
                    options: ["The first characters in the alphabet", "Symbols like punctuation marks", "The most frequently occurring characters", "The least frequently occurring characters"],
                    correctIndex: 2
                },
                {
                    text: "What data structure is used to create Huffman codes?",
                    options: ["Hash table", "Binary search tree", "Linked list", "Binary tree"],
                    correctIndex: 3
                },
                {
                    text: "Why is Huffman coding considered a variable-length code?",
                    options: ["It only works on variable-sized input", "Different input characters are assigned codes of different lengths", "The algorithm varies depending on input", "The compression ratio varies widely"],
                    correctIndex: 1
                },
                {
                    text: "What is a limitation of Huffman coding compared to some other compression methods?",
                    options: ["It can only compress text files", "It requires two passes through the data", "It's extremely slow", "It can only achieve minimal compression"],
                    correctIndex: 1
                }
            ],
            
            modern: [
                {
                    text: "Which combination of algorithms is commonly used in ZIP files?",
                    options: ["JPEG and MP3", "LZ77 and Huffman coding", "SHA-256 and AES", "RLE and Base64"],
                    correctIndex: 1
                },
                {
                    text: "Which image format supports transparency and uses lossless compression?",
                    options: ["JPEG", "GIF", "PNG", "BMP"],
                    correctIndex: 2
                },
                {
                    text: "What makes modern video compression efficient?",
                    options: ["Converting all videos to black and white", "Only compressing keyframes", "Using psychovisual models and temporal redundancy", "Reducing the frame rate"],
                    correctIndex: 2
                },
                {
                    text: "Which of these is NOT a modern compression format?",
                    options: ["HEIF", "FLAC", "RLE", "BZIP2"],
                    correctIndex: 2
                }
            ]
        }
    },
    
    // Hashing module
    hashing: {
        intro: `
            <div class="module-intro">
                <h2>Hash Functions Fundamentals</h2>
                <p>Hash functions convert data of arbitrary size to fixed-size values, with many applications in computing and security.</p>
                
                <h3>In this module, you'll learn:</h3>
                <ul>
                    <li>What hash functions are and their properties</li>
                    <li>Common hash algorithms</li>
                    <li>Hash tables and dictionaries</li>
                    <li>Cryptographic hash functions</li>
                    <li>Real-world applications</li>
                </ul>
                
                <div class="lesson-navigation">
                    <h3>Lessons:</h3>
                    <button class="lesson-btn" data-lesson="intro">1. Hash Function Basics</button>
                    <button class="lesson-btn" data-lesson="algorithms">2. Common Hash Algorithms</button>
                    <button class="lesson-btn" data-lesson="tables">3. Hash Tables</button>
                    <button class="lesson-btn" data-lesson="crypto">4. Cryptographic Hashing</button>
                    <button class="lesson-btn" data-lesson="applications">5. Practical Applications</button>
                </div>
            </div>
        `,
        
        lessons: {
            intro: `
                <div class="lesson">
                    <h2>Hash Function Basics</h2>
                    <p>Hash functions transform input data of any size into a fixed-size output, typically for indexing or verification purposes.</p>
                    
                    <div class="module-section">
                        <h3>What is a Hash Function?</h3>
                        <p>A hash function takes arbitrary input and produces a fixed-size string of characters, which typically appears random but is deterministic.</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Properties of Good Hash Functions</h3>
                        <p>Good hash functions are fast to compute, distribute outputs uniformly, and minimize collisions (when two different inputs produce the same hash).</p>
                    </div>
                    
                    <div class="module-section">
                        <h3>Hash Collisions</h3>
                        <p>Due to the pigeonhole principle, collisions are inevitable when mapping a larger set of inputs to a
