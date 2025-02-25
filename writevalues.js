// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvoNTfgTCUj1k729S9SJerlOMWILV3dFs",
  authDomain: "ecopond-86c76.firebaseapp.com",
  databaseURL: "https://ecopond-86c76-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ecopond-86c76",
  storageBucket: "ecopond-86c76.firebasestorage.app",
  messagingSenderId: "246216522666",
  appId: "1:246216522666:web:0825096c9d5f68f8e8c9d3",
  measurementId: "G-BNCT04K830"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Get the database instance

// Function to activate a button and update Firebase values with dynamic duration
function activateButton(button, duration, dbPath, value, controlNodePath) {
  button.classList.add("active"); // Add active state

  // Update the numerical value (e.g., feedTime, drainPercent, refillPercent)
  set(ref(database, dbPath), value);

  // Set the ControlNode to 1 (start the process)
  set(ref(database, controlNodePath), 1);

  setTimeout(() => {
      button.classList.remove("active"); // Remove active state

      // Set the ControlNode back to 0 (process done)
      set(ref(database, controlNodePath), 0);
  }, duration);
}

// 🐟 Start Feeding
document.getElementById("start-feed").addEventListener("click", function () {
  const feedTime = parseInt(document.getElementById("feed-time").value);
  activateButton(this, feedTime, "fishTank/feedTime", feedTime, "ControlNodes/Feeding");
});

// 💧 Start Draining
document.getElementById("start-drain").addEventListener("click", function () {
  const drainPercent = parseInt(document.getElementById("drain-time").value);
  const drainDuration = drainPercent * 1000; // Adjust duration based on percentage
  activateButton(this, drainDuration, "fishTank/drainPercent", drainPercent, "ControlNodes/Drain");
});

// 🚰 Start Refilling
document.getElementById("start-Refill").addEventListener("click", function () {
  console.log("Refill");
  const refillPercent = parseInt(document.getElementById("Refill").value);
  const refillDuration = refillPercent * 1000; // Adjust duration based on percentage
  activateButton(this, refillDuration, "fishTank/refillPercent", refillPercent, "ControlNodes/Refill");
});
