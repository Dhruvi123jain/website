// Database Service for Hack The Signals
// This file contains functions to interact with the Firebase database

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc, getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

// Collection references
const REGISTRATIONS_COLLECTION = 'registrations';
const USERS_COLLECTION = 'users';
const TEAMS_COLLECTION = 'teams';

// ==========================================
// Registration Functions
// ==========================================

/**
 * Save a new registration to the database
 * @param {Object} registrationData - The registration data
 * @returns {Promise<string>} - The ID of the new registration
 */
export async function saveRegistration(registrationData) {
  try {
    // Add timestamp
    registrationData.createdAt = serverTimestamp();
    registrationData.status = 'pending'; // Default status
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, REGISTRATIONS_COLLECTION), registrationData);
    console.log("Registration saved with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving registration: ", error);
    throw error;
  }
}

/**
 * Get all registrations from the database
 * @returns {Promise<Array>} - Array of registration objects
 */
export async function getAllRegistrations() {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, REGISTRATIONS_COLLECTION), orderBy("createdAt", "desc"))
    );
    
    const registrations = [];
    querySnapshot.forEach((doc) => {
      registrations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return registrations;
  } catch (error) {
    console.error("Error getting registrations: ", error);
    throw error;
  }
}

/**
 * Get a registration by ID
 * @param {string} id - The registration ID
 * @returns {Promise<Object>} - The registration object
 */
export async function getRegistrationById(id) {
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      console.log("No such registration!");
      return null;
    }
  } catch (error) {
    console.error("Error getting registration: ", error);
    throw error;
  }
}

/**
 * Update a registration
 * @param {string} id - The registration ID
 * @param {Object} data - The updated data
 * @returns {Promise<void>}
 */
export async function updateRegistration(id, data) {
  try {
    // Add updated timestamp
    data.updatedAt = serverTimestamp();
    
    const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
    await updateDoc(docRef, data);
    console.log("Registration updated: ", id);
  } catch (error) {
    console.error("Error updating registration: ", error);
    throw error;
  }
}

/**
 * Delete a registration
 * @param {string} id - The registration ID
 * @returns {Promise<void>}
 */
export async function deleteRegistration(id) {
  try {
    await deleteDoc(doc(db, REGISTRATIONS_COLLECTION, id));
    console.log("Registration deleted: ", id);
  } catch (error) {
    console.error("Error deleting registration: ", error);
    throw error;
  }
}

/**
 * Get registrations by membership type
 * @param {string} membershipType - The membership type (cs-sps, ieee, non-ieee)
 * @returns {Promise<Array>} - Array of registration objects
 */
export async function getRegistrationsByMembershipType(membershipType) {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION), 
      where("membership-type", "==", membershipType),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const registrations = [];
    
    querySnapshot.forEach((doc) => {
      registrations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return registrations;
  } catch (error) {
    console.error("Error getting registrations by membership type: ", error);
    throw error;
  }
}

/**
 * Get registrations by team name
 * @param {string} teamName - The team name
 * @returns {Promise<Array>} - Array of registration objects
 */
export async function getRegistrationsByTeam(teamName) {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION), 
      where("team-name", "==", teamName),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const registrations = [];
    
    querySnapshot.forEach((doc) => {
      registrations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return registrations;
  } catch (error) {
    console.error("Error getting registrations by team: ", error);
    throw error;
  }
}

/**
 * Get registration statistics
 * @returns {Promise<Object>} - Statistics object
 */
export async function getRegistrationStats() {
  try {
    const querySnapshot = await getDocs(collection(db, REGISTRATIONS_COLLECTION));
    
    let totalRegistrations = 0;
    let csSpsMembers = 0;
    let ieeeMembers = 0;
    let nonIeeeMembers = 0;
    let teams = new Set();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalRegistrations++;
      
      // Count by membership type
      if (data['membership-type'] === 'cs-sps') {
        csSpsMembers++;
      } else if (data['membership-type'] === 'ieee') {
        ieeeMembers++;
      } else if (data['membership-type'] === 'non-ieee') {
        nonIeeeMembers++;
      }
      
      // Count unique teams
      if (data['team-name']) {
        teams.add(data['team-name']);
      }
    });
    
    return {
      totalRegistrations,
      csSpsMembers,
      ieeeMembers,
      nonIeeeMembers,
      uniqueTeams: teams.size
    };
  } catch (error) {
    console.error("Error getting registration stats: ", error);
    throw error;
  }
}

// ==========================================
// Authentication Functions
// ==========================================

/**
 * Register a new admin user
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise<Object>} - The user object
 */
export async function registerAdmin(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Add user to users collection with admin role
    await addDoc(collection(db, USERS_COLLECTION), {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      role: 'admin',
      createdAt: serverTimestamp()
    });
    
    return userCredential.user;
  } catch (error) {
    console.error("Error registering admin: ", error);
    throw error;
  }
}

/**
 * Sign in a user
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise<Object>} - The user object
 */
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
}

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export async function logOut() {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
}

/**
 * Get the current user
 * @returns {Promise<Object>} - The user object
 */
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}

/**
 * Check if the current user is an admin
 * @returns {Promise<boolean>} - True if the user is an admin
 */
export async function isAdmin() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return false;
    }
    
    const q = query(
      collection(db, USERS_COLLECTION), 
      where("uid", "==", user.uid),
      where("role", "==", "admin"),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking admin status: ", error);
    return false;
  }
}

// ==========================================
// Team Functions
// ==========================================

/**
 * Create a new team
 * @param {Object} teamData - The team data
 * @returns {Promise<string>} - The ID of the new team
 */
export async function createTeam(teamData) {
  try {
    // Add timestamp
    teamData.createdAt = serverTimestamp();
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, TEAMS_COLLECTION), teamData);
    console.log("Team created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating team: ", error);
    throw error;
  }
}

/**
 * Get all teams
 * @returns {Promise<Array>} - Array of team objects
 */
export async function getAllTeams() {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, TEAMS_COLLECTION), orderBy("createdAt", "desc"))
    );
    
    const teams = [];
    querySnapshot.forEach((doc) => {
      teams.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return teams;
  } catch (error) {
    console.error("Error getting teams: ", error);
    throw error;
  }
}

/**
 * Get a team by ID
 * @param {string} id - The team ID
 * @returns {Promise<Object>} - The team object
 */
export async function getTeamById(id) {
  try {
    const docRef = doc(db, TEAMS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      console.log("No such team!");
      return null;
    }
  } catch (error) {
    console.error("Error getting team: ", error);
    throw error;
  }
}

/**
 * Get a team by name
 * @param {string} name - The team name
 * @returns {Promise<Object>} - The team object
 */
export async function getTeamByName(name) {
  try {
    const q = query(
      collection(db, TEAMS_COLLECTION), 
      where("name", "==", name),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } else {
      console.log("No such team!");
      return null;
    }
  } catch (error) {
    console.error("Error getting team by name: ", error);
    throw error;
  }
}

export async function getGlimpses() {
    const snapshot = await firebase.database().ref('glimpses').once('value');
    return snapshot.val() || [];
}

export async function setGlimpses(glimpsesArray) {
    await firebase.database().ref('glimpses').set(glimpsesArray);
}