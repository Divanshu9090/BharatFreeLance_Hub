// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

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

// Function to dynamically add a job posting to the page
function addJobToPage(jobData, jobId) {
  const jobListingSection = document.querySelector(".job-listings-section");

  const applied = jobData.applied || false;
  const approved = jobData.approved || false;

  const newJobListing = document.createElement("div");
  newJobListing.className = "job-listing";
  newJobListing.setAttribute("data-type", jobData.projectType);
  newJobListing.setAttribute("data-listing", jobData.listingType);
  newJobListing.setAttribute("data-applied", applied);
  newJobListing.setAttribute("data-approved", approved);

  newJobListing.innerHTML = `
    <h3>${jobData.jobTitle}</h3>
    <p><strong>Project Type:</strong> ${jobData.projectType.replace("-", " ")}</p>
    <p><strong>Skills:</strong> ${jobData.skills}</p>
    <p><strong>Listing Type:</strong> ${jobData.listingType.replace("-", " ")}</p>
    <p><strong>Language:</strong> ${jobData.language}</p>
    <p>${jobData.description}</p>
    <a href="#" class="btn btn-primary apply-btn" ${applied ? 'data-applied="true" disabled' : ''}>${applied ? 'Applied' : 'Apply Now'}</a>
  `;

  jobListingSection.appendChild(newJobListing);

  const applyButton = newJobListing.querySelector(".apply-btn");
  
  if (!applied) {
    // Initial event listener for "Apply Now"
    applyButton.addEventListener("click", async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("No user is logged in.");
          return;
        }

        // Update the sub-collection "applications" under the job document
        const applicationData = {
          freelancerId: user.uid,
          appliedAt: new Date(),
          status: "applied" // Optionally, manage status
        };

        // Add the freelancer application to the "applications" sub-collection of the job
        await setDoc(doc(db, "jobs", jobId, "applications", user.uid), applicationData);

        // Update button to "See Details"
        applyButton.dataset.applied = "true";
        applyButton.textContent = "See Details";
        applyButton.classList.remove("btn-primary");
        applyButton.classList.add("btn-secondary");
        applyButton.disabled = false; // Ensure it's enabled

        // Show success message
        const alertDiv = document.createElement("div");
        alertDiv.className = "alert alert-success mt-3";
        alertDiv.role = "alert";
        alertDiv.innerText = "Successfully applied";
        newJobListing.appendChild(alertDiv);

        // Remove existing event listeners to prevent multiple bindings
        const newApplyButton = applyButton.cloneNode(true);
        applyButton.parentNode.replaceChild(newApplyButton, applyButton);

        // Add new event listener for "See Details"
        newApplyButton.addEventListener("click", () => {
          window.location.href = `../freelance_client_both/both.html?id=${jobId}`;
        });

      } catch (error) {
        console.error("Error applying to job: ", error.message);
      }
    });
  } else {
    // If already applied, set up the "See Details" functionality
    applyButton.addEventListener("click", () => {
      window.location.href = `../freelance_client_both/both.html?id=${jobId}`;
    });
  }
}

// Fetch and display jobs posted by the logged-in user
async function fetchJobPosts() {
  const jobListingSection = document.querySelector(".job-listings-section");
  jobListingSection.innerHTML = ''; // Clear existing listings if any
  try {
    const querySnapshot = await getDocs(collection(db, "jobs"));
    querySnapshot.forEach((doc) => {
      const jobData = doc.data();
      addJobToPage(jobData, doc.id);
    });
  } catch (error) {
    console.error("Error fetching job posts: ", error.message);
  }
}

// Monitor auth state and fetch jobs when the user logs in
onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchJobPosts();
  } else {
    console.log("User is not authenticated");
    window.location.href = "./freelancer_sign.html";
  }
});
