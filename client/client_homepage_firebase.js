import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Firebase configuration
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

// Handle form submission for job posting
const jobForm = document.getElementById('jobForm');
jobForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const jobTitle = document.getElementById('jobTitle').value.trim();
  const projectType = document.getElementById('projectType').value.trim();
  const skills = document.getElementById('skills').value.trim();
  const listingType = document.getElementById('listingType').value.trim();
  const language = document.getElementById('Language').value.trim();
  const description = document.getElementById('description').value.trim();

  const user = auth.currentUser;
  if (!user) {
    alert('You must be signed in to post a job.');
    return;
  }

  const jobData = {
    jobTitle,
    projectType,
    skills,
    listingType,
    language,
    description,
    postedBy: user.uid,
    createdAt: new Date()
  };

  try {
    const docId = `${user.uid}_${Date.now()}`;
    await setDoc(doc(db, "jobs", docId), jobData);
    alert('Job posted successfully');

    addJobToPage(jobData, docId);

    $('#addJobModal').modal('hide');
    jobForm.reset();
  } catch (error) {
    console.error("Error posting job: ", error.message);
    alert("Failed to post job. Please try again.");
  }
});

// Fetch and display jobs posted by the logged-in user
const fetchUserJobs = async (user) => {
  try {
    const jobsRef = collection(db, "jobs");
    const q = query(jobsRef, where("postedBy", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const jobListingSection = document.querySelector(".job-listings-section");
    jobListingSection.innerHTML = '';

    const heading = document.createElement('h2');
    heading.textContent = 'Post a Job';
    jobListingSection.appendChild(heading);

    querySnapshot.forEach((doc) => {
      const jobData = doc.data();
      addJobToPage(jobData, doc.id);
    });
  } catch (error) {
    console.error("Error fetching jobs: ", error);
    alert("Failed to fetch jobs. Please try again later.");
  }
};

function addJobToPage(jobData, jobId) {
  const jobListingSection = document.querySelector(".job-listings-section");
  const newJobListing = document.createElement("div");
  newJobListing.className = "job-listing";
  newJobListing.innerHTML = `
    <h3>${jobData.jobTitle}</h3>
    <p><strong>Project Type:</strong> ${jobData.projectType.replace("-", " ")}</p>
    <p><strong>Skills:</strong> ${jobData.skills}</p>
    <p><strong>Listing Type:</strong> ${jobData.listingType.replace("-", " ")}</p>
    <p><strong>Language:</strong> ${jobData.language}</p>
    <p>${jobData.description}</p>
    <a href="../freelance_client_both/both copy.html?id=${jobId}" class="btn btn-primary">See Details</a>
  `;
  jobListingSection.appendChild(newJobListing);
}


// Monitor auth state and fetch jobs when the user logs in
onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchUserJobs(user);
  } else {
    document.querySelector(".job-listings-section").innerHTML = '<h2>Post a Job</h2>';
  }
});
