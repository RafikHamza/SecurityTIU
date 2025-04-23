// auth.js - Authentication logic
let currentUser = null;

// Simple user store - in a real app, you'd use a secure database
const users = JSON.parse(localStorage.getItem('users')) || {};

// Improved hash function (in a real app, use a proper crypto library)
function simpleHash(string) {
    let hash = 0;
    if (string.length === 0) return hash;
    for (let i = 0; i < string.length; i++) {
        const char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16); // Convert to hex string
}

export function register(username, password) {
    // Basic validation
    if (!username || username.length < 3) {
        return { success: false, message: 'Username must be at least 3 characters' };
    }
    if (!password || password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
    }
    
    if (users[username]) {
        return { success: false, message: 'Username already exists' };
    }
    
    // Hash the password before storing
    const hashedPassword = simpleHash(password);
    
    users[username] = {
        password: hashedPassword,
        progress: {},
        quizScores: {}
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login after registration
    currentUser = username;
    localStorage.setItem('currentUser', username);
    
    return { success: true, message: 'Registration successful!' };
}

export function login(username, password) {
    const user = users[username];
    if (!user) {
        return { success: false, message: 'Invalid username or password' };
    }
    
    // Check hashed password
    const hashedPassword = simpleHash(password);
    if (user.password !== hashedPassword) {
        return { success: false, message: 'Invalid username or password' };
    }
    
    currentUser = username;
    localStorage.setItem('currentUser', username);
    return { success: true, message: 'Login successful!' };
}

export function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
}

export function isLoggedIn() {
    return currentUser !== null;
}

export function getCurrentUser() {
    return currentUser;
}

export function saveProgress(moduleName, completed = true) {
    if (!currentUser) return false;
    
    if (!users[currentUser].progress) {
        users[currentUser].progress = {};
    }
    
    users[currentUser].progress[moduleName] = completed;
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

export function saveQuizScore(moduleName, score, totalQuestions) {
    if (!currentUser) return false;
    
    if (!users[currentUser].quizScores) {
        users[currentUser].quizScores = {};
    }
    
    users[currentUser].quizScores[moduleName] = { score, totalQuestions };
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

export function getUserProgress() {
    if (!currentUser) return null;
    return users[currentUser].progress || {};
}

export function getUserScores() {
    if (!currentUser) return null;
    return users[currentUser].quizScores || {};
}

// Initialize from localStorage on page load
(() => {
    currentUser = localStorage.getItem('currentUser');
})();
