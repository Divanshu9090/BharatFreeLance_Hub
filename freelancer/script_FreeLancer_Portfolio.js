import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
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

// Function to populate the portfolio page
async function populatePortfolio(user) {
  const userId = user.uid;
  const docRef = doc(db, "freelancer", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    // Populate Freelancer Name Box
    document.querySelector('.freelancer-banner h1').textContent = `${data.firstName} ${data.lastName}`;

    // Populate Freelancer Details
    document.querySelector('#freelancer-full-name').textContent = `${data.firstName} ${data.lastName}`;
    document.querySelector('.text-center.text-muted').textContent = data.designation;
    document.querySelector('.list-group-item.bg-orange-light:nth-of-type(1) strong').nextSibling.textContent = data.skills;
    document.querySelector('.list-group-item.bg-orange-light:nth-of-type(2) p').textContent = data.aboutMe;

    // Social Links
    document.getElementById('linkedin').href = data.linkedin || "#";
    document.getElementById('twitter').href = data.twitter || "#";
    document.getElementById('github').href = data.github || "#";

    // Populate Projects
    const projectsContainer = document.querySelector('.projects-container .row');
    data.projects.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = 'col-md-6 mb-3';
      projectCard.innerHTML = `
        <div class="card mb-3">
          <div class="card-body">
            <img src="../img/proj def.webp" alt="Project Image" class="card-img-top" />
            <h5 class="card-title text-orange">${project.title}</h5>
            <p class="card-text text-muted">${project.description}</p>
            <a href="${project.twitter || '#'}" class="btn btn-orange">View Project</a>
          </div>
        </div>
      `;
      projectsContainer.appendChild(projectCard);
    });

    // Populate Experience
    const experienceContainer = document.querySelector('.experience-container ul');
    data.experiences.forEach(experience => {
      const experienceItem = document.createElement('li');
      experienceItem.className = 'list-group-item bg-orange-light';
      experienceItem.innerHTML = `
        <strong>${experience.role}</strong> at ${experience.company}, ${experience.duration}
        <p class="text-muted">Details about your role...</p>
      `;
      experienceContainer.appendChild(experienceItem);
    });

    // Populate Rates
    document.querySelector('.rates-container .card.mb-3:nth-of-type(1) .card-text').textContent = `$${data.hourlyRate}/hour`;
    // document.querySelector('.rates-container .card.mb-3:nth-of-type(2) .card-text').textContent = `Starting at $${data.projectRate}/project`;
    document.getElementById('project-rate').textContent = `Starting at $${data.projectRate}/project`;

    // Populate Reviews (If applicable)
    // Uncomment and adjust if reviews are available in the data
    // const reviewsContainer = document.querySelector('.reviews-container .row');
    // data.reviews.forEach(review => {
    //   const reviewCard = document.createElement('div');
    //   reviewCard.className = 'col-md-6 mb-3';
    //   reviewCard.innerHTML = `
    //     <div class="card mb-3 review-card">
    //       <div class="card-body">
    //         <h5 class="card-title text-orange">${review.clientName}</h5>
    //         <div class="star-rating mb-2">
    //           <!-- Generate star rating dynamically based on review rating -->
    //         </div>
    //         <p class="card-text review-content">${review.content}</p>
    //       </div>
    //     </div>
    //   `;
    //   reviewsContainer.appendChild(reviewCard);
    // });
  } else {
    console.log("No such document!");
  }
}

// Listen to auth state changes
onAuthStateChanged(auth, user => {
  if (user) {
    populatePortfolio(user);
  } else {
    console.log("No user is signed in.");
  }
});
