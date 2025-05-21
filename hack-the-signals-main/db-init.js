// Database Initialization Script for Hack The Signals
// This script sets up the initial database structure and creates an admin user

import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, collection, addDoc, setDoc, doc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXQRBSZ9yHgxUmIKbXRUCQjQjKUeZLOxk",
  authDomain: "hack-the-signals-db.firebaseapp.com",
  projectId: "hack-the-signals-db",
  storageBucket: "hack-the-signals-db.appspot.com",
  messagingSenderId: "1098765432",
  appId: "1:1098765432:web:a1b2c3d4e5f6g7h8i9j0k1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const initForm = document.getElementById('init-form');
const statusMessage = document.getElementById('status-message');
const adminEmail = document.getElementById('admin-email');
const adminPassword = document.getElementById('admin-password');
const initButton = document.getElementById('init-button');

// Event Listeners
if (initForm) {
  initForm.addEventListener('submit', handleInitialization);
}

// Handle database initialization
async function handleInitialization(e) {
  e.preventDefault();
  
  // Get admin credentials
  const email = adminEmail.value;
  const password = adminPassword.value;
  
  if (!email || !password) {
    updateStatus('Please enter admin email and password.', 'error');
    return;
  }
  
  // Disable button and show loading state
  initButton.disabled = true;
  initButton.textContent = 'Initializing...';
  updateStatus('Initializing database...', 'info');
  
  try {
    // Step 1: Create admin user
    updateStatus('Creating admin user...', 'info');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Step 2: Add admin user to users collection
    updateStatus('Setting up admin permissions...', 'info');
    await setDoc(doc(db, 'users', uid), {
      uid: uid,
      email: email,
      role: 'admin',
      createdAt: serverTimestamp()
    });
    
    // Step 3: Create sample data
    updateStatus('Creating sample data...', 'info');
    await createSampleData();
    
    // Success
    updateStatus('Database initialized successfully! You can now log in to the admin dashboard.', 'success');
    initButton.textContent = 'Initialization Complete';
    
    // Add link to admin dashboard
    const adminLink = document.createElement('a');
    adminLink.href = 'admin.html';
    adminLink.textContent = 'Go to Admin Dashboard';
    adminLink.className = 'admin-link';
    document.querySelector('.status-container').appendChild(adminLink);
    
  } catch (error) {
    console.error('Initialization error:', error);
    updateStatus(`Error: ${error.message}`, 'error');
    initButton.disabled = false;
    initButton.textContent = 'Initialize Database';
  }
}

// Create sample data
async function createSampleData() {
  try {
    // Create sample registrations
    const registrationsCollection = collection(db, 'registrations');
    
    // Sample registration 1
    await addDoc(registrationsCollection, {
      'first-name': 'John',
      'last-name': 'Doe',
      'email': 'john.doe@example.com',
      'phone': '9876543210',
      'college': 'Silver Oak University',
      'membership-type': 'cs-sps',
      'ieee-membership': 'IEEE123456',
      'team-name': 'Signal Masters',
      'team-members': 'jane.doe@example.com, bob.smith@example.com',
      'experience-level': 'intermediate',
      'dietary-restrictions': 'Vegetarian',
      'status': 'confirmed',
      'createdAt': serverTimestamp()
    });
    
    // Sample registration 2
    await addDoc(registrationsCollection, {
      'first-name': 'Jane',
      'last-name': 'Doe',
      'email': 'jane.doe@example.com',
      'phone': '9876543211',
      'college': 'Silver Oak University',
      'membership-type': 'ieee',
      'ieee-membership': 'IEEE123457',
      'team-name': 'Signal Masters',
      'team-members': 'john.doe@example.com, bob.smith@example.com',
      'experience-level': 'advanced',
      'dietary-restrictions': '',
      'status': 'confirmed',
      'createdAt': serverTimestamp()
    });
    
    // Sample registration 3
    await addDoc(registrationsCollection, {
      'first-name': 'Bob',
      'last-name': 'Smith',
      'email': 'bob.smith@example.com',
      'phone': '9876543212',
      'college': 'Silver Oak University',
      'membership-type': 'non-ieee',
      'ieee-membership': '',
      'team-name': 'Signal Masters',
      'team-members': 'john.doe@example.com, jane.doe@example.com',
      'experience-level': 'beginner',
      'dietary-restrictions': 'Gluten-free',
      'status': 'confirmed',
      'createdAt': serverTimestamp()
    });
    
    // Create sample teams
    const teamsCollection = collection(db, 'teams');
    
    // Sample team
    await addDoc(teamsCollection, {
      'name': 'Signal Masters',
      'members': [
        'john.doe@example.com',
        'jane.doe@example.com',
        'bob.smith@example.com'
      ],
      'createdAt': serverTimestamp()
    });
    
    console.log('Sample data created successfully');
  } catch (error) {
    console.error('Error creating sample data:', error);
    throw error;
  }
}

// Update status message
function updateStatus(message, type = 'info') {
  if (!statusMessage) return;
  
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
}

// Export functions for use in other scripts
export { db, auth };
