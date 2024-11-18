// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChL4PXmR5RHmNnlVc6PiocbEsq3ygpD3E",
  authDomain: "bharatfreelance-hub-538c2.firebaseapp.com",
  projectId: "bharatfreelance-hub-538c2",
  storageBucket: "bharatfreelance-hub-538c2.appspot.com",
  messagingSenderId: "297970426246",
  appId: "1:297970426246:web:fc266f818611f1c14a8c07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Reference to the form element
const bioDataForm = document.getElementById('bioDataForm');

// Handle form submission
bioDataForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Collect form data
  const name = document.getElementById('name').value;
  const basedOn = document.getElementById('basedOn').value;
  const aboutUs = document.getElementById('aboutUs').value;
  const email = document.getElementById('email').value;
  const website = document.getElementById('website').value;
  const linkedin = document.getElementById('linkedin').value;
  const twitter = document.getElementById('twitter').value;
  const aadhaarNumber = document.getElementById('aadhaarNumber').value;
  const gstinNumber = document.getElementById('gstinNumber').value;

  // Upload profile image if provided
  const profileImageFile = document.getElementById('profileImage').files[0];
  let profileImageUrl = '';

  if (profileImageFile) {
    const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}/${profileImageFile.name}`);
    await uploadBytes(storageRef, profileImageFile);
    profileImageUrl = await getDownloadURL(storageRef);
  }

  // Data to save in Firestore
  const clientData = {
    name,
    basedOn,
    aboutUs,
    email,
    website,
    linkedin,
    twitter,
    verification: {
      aadhaarNumber,
      gstinNumber
    },
    profileImageUrl
  };

  try {
    // Save the data to the 'users' collection
    await setDoc(doc(db, "users", auth.currentUser.uid), clientData);
    alert('Client details saved successfully');
    // Redirect to Client_Portfolio.html after successful save
    window.location.href = './client_homepage.html';
  } catch (error) {
    console.error("Error saving document: ", error);
    document.getElementById('verificationError').innerText = "Failed to save client details. Please try again.";
  }
});

// Handle cancel button
const cancelBtn = document.getElementById('cancelButton');
cancelBtn.addEventListener('click', () => {
  window.location.href = './index.html';
});
