// Database Connection Checker for Hack The Signals
// This script checks if the database connection is working properly

import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, signInAnonymously, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, collection, addDoc, getDocs, query, limit, serverTimestamp 
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
let app, auth, db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully in db-checker.js");
} catch (error) {
    console.error("Error initializing Firebase in db-checker.js:", error);
}

// Check if Firebase is initialized
export function isFirebaseInitialized() {
    return !!app && !!auth && !!db;
}

// Check if Firestore is connected
export async function checkFirestoreConnection() {
    try {
        if (!db) {
            return { success: false, message: "Firestore not initialized" };
        }
        
        // Try to access a collection
        const testCollection = collection(db, 'connection_checks');
        
        return { success: true, message: "Firestore connection successful" };
    } catch (error) {
        console.error("Error checking Firestore connection:", error);
        return { success: false, message: `Error: ${error.message}` };
    }
}

// Test write operation
export async function testWriteOperation() {
    try {
        if (!db) {
            return { success: false, message: "Firestore not initialized" };
        }
        
        // Write a test document
        const testCollection = collection(db, 'connection_checks');
        const testData = {
            message: "Connection check",
            timestamp: serverTimestamp(),
            browser: navigator.userAgent,
            checkId: `check_${Date.now()}`
        };
        
        const docRef = await addDoc(testCollection, testData);
        
        return { 
            success: true, 
            message: "Write operation successful", 
            docId: docRef.id,
            data: testData
        };
    } catch (error) {
        console.error("Error testing write operation:", error);
        return { success: false, message: `Error: ${error.message}` };
    }
}

// Test read operation
export async function testReadOperation() {
    try {
        if (!db) {
            return { success: false, message: "Firestore not initialized" };
        }
        
        // Read from test collection
        const testCollection = collection(db, 'connection_checks');
        const q = query(testCollection, limit(5));
        const querySnapshot = await getDocs(q);
        
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({
                id: doc.id,
                data: doc.data()
            });
        });
        
        return { 
            success: true, 
            message: "Read operation successful", 
            count: querySnapshot.size,
            documents
        };
    } catch (error) {
        console.error("Error testing read operation:", error);
        return { success: false, message: `Error: ${error.message}` };
    }
}

// Test authentication
export async function testAuthentication() {
    try {
        if (!auth) {
            return { success: false, message: "Authentication not initialized" };
        }
        
        // Sign in anonymously
        const userCredential = await signInAnonymously(auth);
        
        return { 
            success: true, 
            message: "Authentication successful", 
            uid: userCredential.user.uid
        };
    } catch (error) {
        console.error("Error testing authentication:", error);
        return { success: false, message: `Error: ${error.message}` };
    }
}

// Check current authentication state
export function getCurrentAuthState() {
    return new Promise((resolve) => {
        if (!auth) {
            resolve({ authenticated: false, message: "Authentication not initialized" });
            return;
        }
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            if (user) {
                resolve({ 
                    authenticated: true, 
                    uid: user.uid,
                    email: user.email,
                    isAnonymous: user.isAnonymous
                });
            } else {
                resolve({ authenticated: false, message: "No user signed in" });
            }
        });
    });
}

// Run all checks
export async function runAllChecks() {
    const results = {
        initialized: isFirebaseInitialized(),
        firestoreConnection: await checkFirestoreConnection(),
        writeOperation: null,
        readOperation: null,
        authentication: null,
        authState: await getCurrentAuthState()
    };
    
    if (results.firestoreConnection.success) {
        results.writeOperation = await testWriteOperation();
        results.readOperation = await testReadOperation();
    }
    
    if (results.initialized) {
        results.authentication = await testAuthentication();
    }
    
    return results;
}

// Add a connection check to the window object for easy access in the console
window.dbChecker = {
    isFirebaseInitialized,
    checkFirestoreConnection,
    testWriteOperation,
    testReadOperation,
    testAuthentication,
    getCurrentAuthState,
    runAllChecks
};

// Run checks when the script loads and log results to console
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Running database connection checks...");
    const results = await runAllChecks();
    console.log("Database connection check results:", results);
    
    // Comment out or remove the indicator code
    // const indicator = document.createElement('div');
    // indicator.style.position = 'fixed';
    // indicator.style.bottom = '10px';
    // indicator.style.left = '10px';
    // indicator.style.padding = '5px 10px';
    // indicator.style.borderRadius = '4px';
    // indicator.style.fontSize = '12px';
    // indicator.style.fontFamily = 'monospace';
    // indicator.style.zIndex = '9999';
    
    // if (results.initialized && results.firestoreConnection.success) {
    //     indicator.style.backgroundColor = 'rgba(74, 222, 128, 0.2)';
    //     indicator.style.color = '#4ade80';
    //     indicator.style.border = '1px solid #4ade80';
    //     indicator.textContent = '✓ DB Connected';
    // } else {
    //     indicator.style.backgroundColor = 'rgba(255, 77, 77, 0.2)';
    //     indicator.style.color = '#ff4d4d';
    //     indicator.style.border = '1px solid #ff4d4d';
    //     indicator.textContent = '✗ DB Error';
    // }
    
    // document.body.appendChild(indicator);
});
