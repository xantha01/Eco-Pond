// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

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
const database = getDatabase(app);

// Reference to the database path
const dbRef = ref(database, "sensorData");

// Fetch and display real-time data
onValue(dbRef, (snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    document.getElementById("airQuality").innerText = data.airQuality;
    document.getElementById("tds").innerText = data.tds;
    document.getElementById("temperature").innerText = data.temperature;
    document.getElementById("turbidity").innerText = data.turbidity;
  } else {
    console.log("No data available");
  }
}, (error) => {
  console.error("Error fetching data:", error);
});
