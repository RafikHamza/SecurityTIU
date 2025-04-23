// auth.js - Add this new file to handle authentication logic
let currentUser = null;

// Simple user store - in a real app, you'd use a secure database
const users = JSON.parse(localStorage.getItem('users')) || {};

export function register(username, password) {
  if (users[username]) {
    return { success: false, message: 'Username already exists' };
  }
  
  // In a real app, you'd hash the password
  users[username] = {
    password,
    progress: {},
    quizScores: {}
  };
  
  localStorage.setItem('users', JSON.stringify(users));
  return { success: true };
}

export function login(username, password) {
  const user = users[username];
  if (!user || user.password !== password) {
    return { success: false, message: 'Invalid username or password' };
  }
  
  currentUser = username;
  localStorage.setItem('currentUser', username);
  return { success: true };
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
