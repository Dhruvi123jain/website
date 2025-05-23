// Simple Registration Form Handler
// This script handles the registration form submission and connects to Firebase

// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple registration handler loaded');
    
    // Get the registration form
    const registrationForm = document.getElementById('registration-form');
    console.log('Registration form found:', !!registrationForm);
    
    // Add submit event to the form
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            try {
                // Get form data
                const formData = new FormData(registrationForm);
                const formDataObj = {};
                
                formData.forEach((value, key) => {
                    formDataObj[key] = value;
                });
                
                console.log('Form data:', formDataObj);
                
                // Add timestamp
                formDataObj.createdAt = serverTimestamp();
                formDataObj.status = 'pending';
                
                // Save to Firestore
                const registrationsCollection = collection(db, 'registrations');
                const docRef = await addDoc(registrationsCollection, formDataObj);
                
                console.log('Registration saved with ID:', docRef.id);
                
                // Show success message
                showSuccessMessage(docRef.id);
                
                // Reset form after delay
                setTimeout(() => {
                    registrationForm.reset();
                }, 3000);
                
            } catch (error) {
                console.error('Error saving registration:', error);
                alert('Error saving registration. Please try again.');
            }
        });
    }
    
    // Function to show success message
    function showSuccessMessage(registrationId) {
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message show';
        successMessage.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="success-text">
                <h3>Registration Successful!</h3>
                <p>Thank you for registering for Hack The Signals!</p>
                <p>Your registration has been saved to our database.</p>
                <p>You will receive a confirmation email shortly.</p>
                <p class="registration-id">Registration ID: <span class="id-value">${registrationId}</span></p>
            </div>
        `;
        
        // Hide the form
        registrationForm.style.display = 'none';
        
        // Add success message to modal
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.appendChild(successMessage);
        }
        
        // Close modal after delay
        setTimeout(() => {
            const modal = document.getElementById('registration-modal');
            if (modal) {
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.style.display = 'none';
                    modal.classList.remove('active');
                    
                    // Remove success message
                    successMessage.remove();
                    
                    // Show the form again
                    registrationForm.style.display = 'block';
                }, 300);
            }
        }, 5000);
    }
});
