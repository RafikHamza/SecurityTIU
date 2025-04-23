// App initialization
document.addEventListener('DOMContentLoaded', () => {
    initDatabase();
    setupNavigation();
    checkUserAuth();
    loadModule('home');
});

// IndexDB Setup
const DB_NAME = 'CryptoLearningDB';
const DB_VERSION = 1;
let db;

function initDatabase() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        
        // Students store
        if (!db.objectStoreNames.contains('students')) {
            const studentStore = db.createObjectStore('students', { keyPath: 'id', autoIncrement: true });
            studentStore.createIndex('by_email', 'email', { unique: true });
        }
        
        // Progress store
        if (!db.objectStoreNames.contains('progress')) {
            const progressStore = db.createObjectStore('progress', { keyPath: 'id', autoIncrement: true });
            progressStore.createIndex('by_student', 'studentId', { unique: false });
            progressStore.createIndex('by_module', 'moduleId', { unique: false });
        }
        
        // Quiz results store
        if (!db.objectStoreNames.contains('quizResults')) {
            const quizStore = db.createObjectStore('quizResults', { keyPath: 'id', autoIncrement: true });
            quizStore.createIndex('by_student', 'studentId', { unique: false });
            quizStore.createIndex('by_quiz', 'quizId', { unique: false });
        }
    };
    
    request.onsuccess = (event) => {
        db = event.target.result;
        console.log('Database initialized successfully');
    };
    
    request.onerror = (event) => {
        console.error('Database error:', event.target.error);
    };
}

// User Authentication
let currentUser = null;

function checkUserAuth() {
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
        getStudentById(parseInt(userId)).then(user => {
            if (user) {
                currentUser = user;
                updateUI();
            } else {
                showAuthModal();
            }
        });
    } else {
        showAuthModal();
    }
}

function registerStudent(name, email) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['students'], 'readwrite');
        const store = transaction.objectStore('students');
        const request = store.add({ name, email, createdAt: new Date() });
        
        request.onsuccess = () => {
            resolve(request.result); // Returns the new user ID
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

function getStudentById(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['students'], 'readonly');
        const store = transaction.objectStore('students');
        const request = store.get(id);
        
        request.onsuccess = () => {
            resolve(request.result);
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Progress Tracking
function saveProgress(moduleId, lessonId, completed) {
    if (!currentUser) return Promise.reject('No user logged in');
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['progress'], 'readwrite');
        const store = transaction.objectStore('progress');
        
        // Check if progress record exists
        const index = store.index('by_student');
        const request = index.openCursor(IDBKeyRange.only(currentUser.id));
        
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            
            if (cursor) {
                const data = cursor.value;
                if (data.moduleId === moduleId && data.lessonId === lessonId) {
                    // Update existing record
                    data.completed = completed;
                    data.updatedAt = new Date();
                    const updateRequest = cursor.update(data);
                    updateRequest.onsuccess = () => resolve(true);
                    updateRequest.onerror = () => reject(updateRequest.error);
                    return;
                }
                cursor.continue();
            } else {
                // Create new record
                const addRequest = store.add({
                    studentId: currentUser.id,
                    moduleId,
                    lessonId,
                    completed,
                    createdAt: new Date()
                });
                addRequest.onsuccess = () => resolve(true);
                addRequest.onerror = () => reject(addRequest.error);
            }
        };
    });
}

function getStudentProgress() {
    if (!currentUser) return Promise.reject('No user logged in');
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['progress'], 'readonly');
        const store = transaction.objectStore('progress');
        const index = store.index('by_student');
        const request = index.getAll(IDBKeyRange.only(currentUser.id));
        
        request.onsuccess = () => {
            resolve(request.result);
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Quiz Management
function saveQuizResult(quizId, answers, score) {
    if (!currentUser) return Promise.reject('No user logged in');
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['quizResults'], 'readwrite');
        const store = transaction.objectStore('quizResults');
        
        const request = store.add({
            studentId: currentUser.id,
            quizId,
            answers,
            score,
            takenAt: new Date()
        });
        
        request.onsuccess = () => {
            resolve(true);
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Navigation and UI
function setupNavigation() {
    const navButtons = document.querySelectorAll('nav button');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const module = button.getAttribute('data-module');
            loadModule(module);
        });
    });
}

function loadModule(moduleName) {
    const contentArea = document.getElementById('content');
    
    // Clear previous content
    contentArea.innerHTML = '';
    
    // Load new content based on module
    switch(moduleName) {
        case 'home':
            contentArea.innerHTML = modules.home;
            break;
        case 'encryption':
            contentArea.innerHTML = modules.encryption.intro;
            setupEncryptionModule();
            break;
        case 'compression':
            contentArea.innerHTML = modules.compression.intro;
            setupCompressionModule();
            break;
        case 'hashing':
            contentArea.innerHTML = modules.hashing.intro;  
            setupHashingModule();
            break;
        case 'profile':
            loadProfilePage();
            break;
        default:
            contentArea.innerHTML = '<h2>Page Not Found</h2><p>The requested module could not be found.</p>';
    }
    
    // Setup any interactive elements
    setupInteractiveElements();
}

function loadProfilePage() {
    const contentArea = document.getElementById('content');
    
    if (!currentUser) {
        contentArea.innerHTML = '<h2>Please log in to view your profile</h2>';
        return;
    }
    
    contentArea.innerHTML = '<h2>My Learning Progress</h2><div id="progress-stats"></div>';
    
    // Load and display progress data
    getStudentProgress().then(progressData => {
        const statsDiv = document.getElementById('progress-stats');
        
        if (progressData.length === 0) {
            statsDiv.innerHTML = '<p>You haven\'t started any lessons yet.</p>';
            return;
        }
        
        // Calculate progress stats
        const totalModules = Object.keys(modules).length - 2; // Exclude home and profile
        const completedLessons = progressData.filter(p => p.completed).length;
        const totalLessons = 15; // Total number of lessons across all modules
        
        statsDiv.innerHTML = `
            <div class="progress-card">
                <h3>Overall Progress</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(completedLessons/totalLessons*100)}%"></div>
                </div>
                <p>Completed ${completedLessons} out of ${totalLessons} lessons</p>
            </div>
        `;
        
        // Add module-specific progress
        ['encryption', 'compression', 'hashing'].forEach(moduleName => {
            const moduleProgress = progressData.filter(p => p.moduleId === moduleName && p.completed).length;
            const totalModuleLessons = 5; // Assuming 5 lessons per module
            
            statsDiv.innerHTML += `
                <div class="progress-card">
                    <h3>${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Progress</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(moduleProgress/totalModuleLessons*100)}%"></div>
                    </div>
                    <p>Completed ${moduleProgress} out of ${totalModuleLessons} lessons</p>
                </div>
            `;
        });
    });
}

// Authentication UI
function showAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Welcome to Crypto Learning Hub</h2>
            <p>Please register or log in to track your progress</p>
            
            <form id="auth-form">
                <div class="form-group">
                    <label for="name">Your Name</label>
                    <input type="text" id="name" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                
                <button type="submit" class="btn-primary">Start Learning</button>
            </form>
        </div>
    `;
    
    document.getElementById('auth-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        registerStudent(name, email).then(userId => {
            return getStudentById(userId);
        }).then(user => {
            currentUser = user;
            localStorage.setItem('currentUserId', user.id);
            modal.style.display = 'none';
            updateUI();
        }).catch(error => {
            console.error('Registration error:', error);
            alert('There was an error with registration. Please try again.');
        });
    });
}

// Quiz UI
function showQuiz(quizId, questions) {
    const modal = document.getElementById('quiz-modal');
    modal.style.display = 'block';
    
    let quizHTML = `
        <div class="modal-content">
            <h2>Knowledge Check</h2>
            <form id="quiz-form">
    `;
    
    questions.forEach((question, qIndex) => {
        quizHTML += `
            <div class="quiz-question">
                <p>${qIndex + 1}. ${question.text}</p>
                <div class="quiz-options">
        `;
        
        question.options.forEach((option, oIndex) => {
            quizHTML += `
                <label class="quiz-option">
                    <input type="radio" name="q${qIndex}" value="${oIndex}" required>
                    ${option}
                </label>
            `;
        });
        
        quizHTML += `
                </div>
            </div>
        `;
    });
    
    quizHTML += `
                <button type="submit" class="btn-primary">Submit Answers</button>
            </form>
        </div>
    `;
    
    modal.innerHTML = quizHTML;
    
    document.getElementById('quiz-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const answers = [];
        let score = 0;
        
        questions.forEach((question, qIndex) => {
            const selected = document.querySelector(`input[name="q${qIndex}"]:checked`);
            const answerIndex = selected ? parseInt(selected.value) : -1;
            
            answers.push(answerIndex);
            
            if (answerIndex === question.correctIndex) {
                score++;
            }
        });
        
        const finalScore = (score / questions.length) * 100;
        
        saveQuizResult(quizId, answers, finalScore).then(() => {
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>Quiz Results</h2>
                    <p>You scored ${score} out of ${questions.length} (${finalScore}%)</p>
                    <button id="close-quiz" class="btn-primary">Continue Learning</button>
                </div>
            `;
            
            document.getElementById('close-quiz').addEventListener('click', () => {
                modal.style.display = 'none';
                
                // Mark lesson as completed if score is good enough
                if (finalScore >= 70) {
                    const [moduleId, lessonId] = quizId.split('-');
                    saveProgress(moduleId, lessonId, true);
                    updateUI();
                }
            });
        });
    });
}

// Setup interactive elements
function setupInteractiveElements() {
    // This will be called after loading each module
    // Set up any interactive components like demos, code snippets, etc.
    
    // Add event listeners for "Try it" buttons
    const demoButtons = document.querySelectorAll('.demo-button');
    demoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const demoId = e.target.getAttribute('data-demo');
            runDemo(demoId);
        });
    });
    
    // Add event listeners for quiz buttons
    const quizButtons = document.querySelectorAll('.quiz-button');
    quizButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const quizId = e.target.getAttribute('data-quiz');
            const moduleId = quizId.split('-')[0];
            const lessonId = quizId.split('-')[1];
            
            // Find the quiz questions for this module and lesson
            let questions;
            switch(moduleId) {
                case 'encryption':
                    questions = modules.encryption.quizzes[lessonId];
                    break;
                case 'compression':
                    questions = modules.compression.quizzes[lessonId];
                    break;
                case 'hashing':
                    questions = modules.hashing.quizzes[lessonId];
                    break;
            }
            
            if (questions) {
                showQuiz(quizId, questions);
            }
        });
    });
}

// Module-specific setup
function setupEncryptionModule() {
    // Add module-specific interactivity here
}

function setupCompressionModule() {
    // Add module-specific interactivity here
}

function setupHashingModule() {
    // Add module-specific interactivity here
}

// Demo implementations
function runDemo(demoId) {
    const demoContainer = document.getElementById(demoId);
    
    if (!demoContainer) return;
    
    switch(demoId) {
        case 'caesar-demo':
            runCaesarDemo(demoContainer);
            break;
        case 'aes-demo':
            runAESDemo(demoContainer);
            break;
        case 'rle-demo':
            runRLEDemo(demoContainer);
            break;
        case 'huffman-demo':
            runHuffmanDemo(demoContainer);
            break;
        case 'md5-demo':
            runMD5Demo(demoContainer);
            break;
        case 'sha-demo':
            runSHADemo(demoContainer);
            break;
    }
}

// Example demo implementation
function runCaesarDemo(container) {
    container.innerHTML = `
        <div class="demo-content">
            <h3>Caesar Cipher Interactive Demo</h3>
            <div class="form-group">
                <label for="plaintext">Enter Text:</label>
                <input type="text" id="plaintext" value="HELLO">
            </div>
            <div class="form-group">
                <label for="shift">Shift (1-25):</label>
                <input type="number" id="shift" min="1" max="25" value="3">
            </div>
            <button id="encrypt-btn">Encrypt</button>
            <div class="result">
                <h4>Result:</h4>
                <div id="result-text"></div>
            </div>
        </div>
    `;
    
    document.getElementById('encrypt-btn').addEventListener('click', () => {
        const text = document.getElementById('plaintext').value.toUpperCase();
        const shift = parseInt(document.getElementById('shift').value);
        
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (char.match(/[A-Z]/)) {
                const code = ((char.charCodeAt(0) - 65 + shift) % 26) + 65;
                result += String.fromCharCode(code);
            } else {
                result += char;
            }
        }
        
        document.getElementById('result-text').textContent = result;
    });
}

// UI update after user authentication
function updateUI() {
    // Update header to show logged in user
    const header = document.querySelector('header');
    const userSection = document.createElement('div');
    userSection.className = 'user-section';
    userSection.innerHTML = `
        <p>Welcome, ${currentUser.name} | <a href="#" id="logout-link">Logout</a></p>
    `;
    
    // Check if user section already exists
    const existingUserSection = header.querySelector('.user-section');
    if (existingUserSection) {
        header.replaceChild(userSection, existingUserSection);
    } else {
        header.appendChild(userSection);
    }
    
    // Add logout functionality
    document.getElementById('logout-link').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUserId');
        currentUser = null;
        location.reload();
    });
}
