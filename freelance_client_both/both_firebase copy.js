import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to fetch client details
async function fetchClientDetails(clientId) {
  try {
    console.log(`Fetching details for client with ID: ${clientId}`);
    
    const clientRef = doc(db, "users", clientId);
    const clientSnap = await getDoc(clientRef);

    if (!clientSnap.exists()) {
      console.error(`No such client found with ID: ${clientId}`);
      return;
    }

    const clientData = clientSnap.data();
    console.log('Client data:', clientData);

    // Update the client card in the sidebar
    renderClientCard(clientData);
  } catch (error) {
    console.error("Error fetching client details: ", error);
  }
}

// Function to dynamically render the client card in the sidebar
function renderClientCard(client) {
  const container = document.getElementById('client-card-container');

  const card = document.createElement('div');
  card.className = 'card mb-4';

  const cardHeader = document.createElement('div');
  cardHeader.className = 'card-header text-center text-white';
  cardHeader.style.backgroundColor = '#ff5722';
  cardHeader.textContent = 'Client Details';

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body text-center';

  const clientImage = document.createElement('img');
  clientImage.className = 'img-fluid rounded-circle mb-3';
  clientImage.style.width = '120px';
  clientImage.style.height = '120px';
  clientImage.src = client.profileImageUrl || '../img/client.png'; // Default image if none provided
  clientImage.alt = client.name || 'Client Photo';

  const clientName = document.createElement('h5');
  clientName.className = 'card-title';
  clientName.textContent = client.name || 'Client Name';

  const clientLocation = document.createElement('p');
  clientLocation.className = 'card-text';
  clientLocation.textContent = `Based in: ${client.basedOn || 'City, Country'}`;

  const clientAbout = document.createElement('p');
  clientAbout.className = 'card-text';
  clientAbout.textContent = `About: ${client.aboutUs || 'A brief description about the client and their professional background.'}`;

  const clientEmail = document.createElement('p');
  clientEmail.className = 'card-text';
  clientEmail.innerHTML = `<strong>Email:</strong> ${client.email || 'client@example.com'}`;

  const socialLinksDiv = document.createElement('div');
  socialLinksDiv.className = 'social-links';

  const linkedinLink = document.createElement('a');
  linkedinLink.href = client.linkedin || '#';
  linkedinLink.target = '_blank';
  linkedinLink.className = 'btn btn-sm me-2';
  linkedinLink.style.borderColor = '#ff5722';
  linkedinLink.textContent = 'LinkedIn';
  linkedinLink.style.display = client.linkedin ? 'inline-block' : 'none';

  const twitterLink = document.createElement('a');
  twitterLink.href = client.twitter || '#';
  twitterLink.target = '_blank';
  twitterLink.className = 'btn btn-sm';
  twitterLink.style.borderColor = '#ff5722';
  twitterLink.textContent = 'Twitter';
  twitterLink.style.display = client.twitter ? 'inline-block' : 'none';

  socialLinksDiv.appendChild(linkedinLink);
  socialLinksDiv.appendChild(twitterLink);

  cardBody.appendChild(clientImage);
  cardBody.appendChild(clientName);
  cardBody.appendChild(clientLocation);
  cardBody.appendChild(clientAbout);
  cardBody.appendChild(clientEmail);
  cardBody.appendChild(socialLinksDiv);

  card.appendChild(cardHeader);
  card.appendChild(cardBody);

  container.appendChild(card);
}

// Function to fetch and display freelancers who applied for a specific job
async function fetchFreelancersApplied(jobId) {
  try {
    console.log(`Attempting to fetch job with ID: ${jobId}`);

    const jobRef = doc(db, "jobs", jobId);
    const jobSnap = await getDoc(jobRef);

    if (!jobSnap.exists()) {
      console.error(`No such job found with ID: ${jobId}`);
      return;
    }
    console.log(`Job found: ${jobSnap.id}`);

    const jobData = jobSnap.data();

    // Fetch and display client details
    const clientId = jobData.postedBy; 
    if (clientId) {
      fetchClientDetails(clientId);
    } else {
      console.error("Client ID not found in job document");
    }

    // Update the job description
    if (jobData.description) {
      document.getElementById('descriptionCollapse').querySelector('.accordion-body').textContent = jobData.description;
    } else {
      document.getElementById('descriptionCollapse').querySelector('.accordion-body').textContent = 'No description available for this job.';
    }

    const applicationsRef = collection(db, "jobs", jobId, "applications");
    const applicationsSnap = await getDocs(applicationsRef);
    
    const freelancerContainer = document.getElementById('freelancers-container');
    freelancerContainer.innerHTML = ''; // Clear existing freelancers

    if (applicationsSnap.empty) {
      console.log('No applications found for this job.');
      freelancerContainer.innerHTML = '<p>No freelancers have applied for this job yet.</p>';
      return;
    }

    console.log(`Found ${applicationsSnap.size} applications for this job.`);

    for (const application of applicationsSnap.docs) {
      const freelancerId = application.id;
      console.log(`Attempting to fetch freelancer with ID: ${freelancerId}`);

      const freelancerRef = doc(db, "freelancer", freelancerId);
      const freelancerSnap = await getDoc(freelancerRef);

      if (freelancerSnap.exists()) {
        const freelancerData = freelancerSnap.data();
        console.log(`Freelancer data found for ID: ${freelancerId}`, freelancerData);
        renderFreelancerCard(freelancerData, freelancerId, jobId);
      } else {
        console.warn(`No freelancer found for ID: ${freelancerId}`);
        const missingFreelancerDiv = document.createElement('div');
        missingFreelancerDiv.className = 'alert alert-warning';
        missingFreelancerDiv.textContent = `Freelancer data missing for ID: ${freelancerId}`;
        freelancerContainer.appendChild(missingFreelancerDiv);
      }
    }
  } catch (error) {
    console.error("Error fetching applied freelancers: ", error);
  }
}

// Function to dynamically render a freelancer card
function renderFreelancerCard(freelancerData, freelancerId, jobId) {
  const freelancerContainer = document.getElementById('freelancers-container');

  // Create the card element
  const card = document.createElement('div');
  card.className = 'col-md-6 mb-4';

  const innerCard = document.createElement('div');
  innerCard.className = 'card h-100';

  // Card body
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body text-center';

  // Freelancer name
  const freelancerName = document.createElement('h5');
  freelancerName.className = 'card-title';
  freelancerName.textContent = freelancerData.firstName || 'Freelancer Name';

  // Freelancer skills
  const freelancerSkills = document.createElement('p');
  freelancerSkills.className = 'card-text';
  freelancerSkills.textContent = `Skills: ${freelancerData.skills || 'Skills not provided'}`;

  // Freelancer rating (example)
  const freelancerRating = document.createElement('p');
  freelancerRating.className = 'card-text';
  freelancerRating.textContent = 'Rating: ★★★★☆'; // Placeholder rating

  // Buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'd-flex justify-content-center';

  const portfolioButton = document.createElement('button');
  portfolioButton.className = 'btn me-2';
  portfolioButton.style.borderColor = '#ff5722';
  portfolioButton.textContent = 'See Portfolio';

  const hireButton = document.createElement('button');
  hireButton.className = 'btn btn-success';
  hireButton.textContent = 'Hire';
  hireButton.addEventListener('click', () => {
    hireFreelancer(freelancerId, jobId);
  });

  buttonContainer.appendChild(portfolioButton);
  buttonContainer.appendChild(hireButton);

  // Append elements to the card body
  cardBody.appendChild(freelancerName);
  cardBody.appendChild(freelancerSkills);
  cardBody.appendChild(freelancerRating);
  cardBody.appendChild(buttonContainer);

  // Append card body to inner card
  innerCard.appendChild(cardBody);

  // Append inner card to outer card
  card.appendChild(innerCard);

  // Append the card to the freelancer container
  freelancerContainer.appendChild(card);
}

// Function to hire a freelancer and add a "todo" document
async function hireFreelancer(freelancerId, jobId) {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error('User not authenticated.');
      return;
    }

    const uid = user.uid; // Client user ID
    const combinedId = `${uid}_${freelancerId}`; // Unique ID for the "todo" document

    // Fetch the current To-Do list items from the page
    const todoItems = Array.from(document.querySelectorAll('#todo-list .list-group-item')).map(item => ({
      task: item.textContent.trim(),
      completed: false,  // Set the initial completed status to false
    }));

    // Create a "todo" document in Firestore
    const todoRef = doc(db, "todo", combinedId);
    await setDoc(todoRef, {
      clientId: uid,
      freelancerId: freelancerId,
      jobId: jobId,
      todoList: todoItems, // Store the to-do list items with completed status
      createdAt: new Date(),
    });

    console.log(`Successfully added todo document for client ${uid} and freelancer ${freelancerId}`);
    alert('Freelancer hired and To-Do list saved successfully!');

  } catch (error) {
    console.error("Error hiring freelancer and saving To-Do list: ", error);
  }
}


// Fetch job details and freelancers on page load
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id'); // Fetch job ID from URL

  if (jobId) {
    fetchFreelancersApplied(jobId);
  } else {
    console.error("Job ID not found in URL");
  }
});
