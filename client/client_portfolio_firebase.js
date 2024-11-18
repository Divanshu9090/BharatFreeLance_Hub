// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

// Firebase configuration (reuse the existing configuration from your previous file)
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Fetch and display client data
const fetchClientData = async () => {
  try {
    const user = auth.currentUser;

    if (user) {
      // Get client document from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const clientData = docSnap.data();

        // Update the portfolio page with the retrieved data
        document.querySelector('.freelancer-banner h1').textContent = `${clientData.name}'s Details`;
        document.querySelector('.text-center.text-orange').textContent = clientData.name;
        document.querySelector('.text-center.text-muted').textContent = clientData.basedOn;
        document.querySelector('.list-group-item.bg-orange-light strong').nextSibling.textContent = clientData.aboutUs;

        // Social Links
        if (clientData.linkedin) {
          document.querySelector('.fab.fa-linkedin-in').parentElement.href = clientData.linkedin;
        }
        if (clientData.twitter) {
          document.querySelector('.fab.fa-twitter').parentElement.href = clientData.twitter;
        }

        // Load and display profile image if available
        if (clientData.profileImageUrl) {
          document.querySelector('.img-fluid.rounded-circle.mx-auto.d-block.mb-3').src = clientData.profileImageUrl;
        }
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("No user is signed in.");
    }
  } catch (error) {
    console.error("Error fetching client data:", error);
  }
};

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      fetchClientData();
    } else {
      window.location.href = './client_signin.html'; // Redirect to sign-in page if not signed in
    }
  });
});
