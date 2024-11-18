import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
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

let hourlyRate = 0;
let projectRate = 0;

// Function to fetch and display the pricing details
async function fetchPricingDetails(user) {
    const userId = user.uid;
    const docRef = doc(db, "freelancer", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();

        // Update the hourly and project rate display
        hourlyRate = data.hourlyRate;
        projectRate = data.projectRate;
        document.getElementById('hourly-rate-text').textContent = `$${hourlyRate}/hour`;
        document.getElementById('project-rate-text').textContent = `Starting at $${projectRate}/project`;
    } else {
        console.log("No such document!");
    }
}

// Function to calculate and update the total price based on hours worked
function updateTotalPrice() {
    const hoursWorked = document.getElementById('hours').value;
    const totalPrice = hoursWorked * hourlyRate;
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

// Function to handle payment logic
async function handlePayment(type) {
    let amount;
    if (type === 'hourly') {
        const hoursWorked = document.getElementById('hours').value;
        if (hoursWorked > 0) {
            amount = hoursWorked * hourlyRate;
        } else {
            alert('Please enter the number of hours worked.');
            return;
        }
    } else if (type === 'project') {
        amount = projectRate;
    }

    if (amount > 0) {
        // Logic to handle payment (this could be an API call to a payment gateway)
        alert(`Payment of $${amount.toFixed(2)} successful for ${type === 'hourly' ? 'hourly work' : 'project'}.`);

        // Save payment record to Firestore
        const user = auth.currentUser;
        if (user) {
            try {
                const paymentRef = doc(db, "payments", `${user.uid}_${Date.now()}`);
                await setDoc(paymentRef, {
                    userId: user.uid,
                    amount: amount,
                    type: type,
                    date: new Date()
                });
                console.log("Payment recorded successfully.");
            } catch (error) {
                console.error("Error recording payment: ", error);
            }
        }
    }
}

// Listen to auth state changes
onAuthStateChanged(auth, user => {
    if (user) {
        fetchPricingDetails(user);
    } else {
        console.log("No user is signed in.");
    }
});

// Event listener for the hours input to update the total price
document.getElementById('hours').addEventListener('input', updateTotalPrice);

// Event listeners for the Pay buttons
document.getElementById('pay-hourly').addEventListener('click', () => handlePayment('hourly'));
document.getElementById('pay-project').addEventListener('click', () => handlePayment('project'));
