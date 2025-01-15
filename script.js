const darkModeSwitch = document.getElementById('darkmodeswitch');
const pumpbutton = document.getElementById('pumpbtn');


document.body.classList.remove('dark-mode');
darkModeSwitch.classList.remove('active');

const dateInput = document.getElementById('calendar');
const today = new Date().toISOString().split('T')[0]; // Gets the current date in yyyy-mm-dd format
dateInput.value = today;

dateInput.addEventListener('click', function() {
    this.showPicker(); // This will programmatically open the date picker
});

// Get the dark mode switch button

// Add an event listener for the click event
darkModeSwitch.addEventListener('click', () => {
    // Check if the button is currently active
    if (darkModeSwitch.classList.contains('active')) {
        // If it's active, remove 'dark-mode' from the body and 'active' from the button
        document.body.classList.remove('dark-mode');
        darkModeSwitch.classList.remove('active');
    } else {
        // If it's not active, add 'dark-mode' to the body and 'active' to the button
        document.body.classList.add('dark-mode');
        darkModeSwitch.classList.add('active');
    }
});




pumpbutton.addEventListener('click', () => {
    // Check if the button is currently active
    if (pumpbutton.classList.contains('active')) {
        pumpbutton.classList.remove('active');
    } else {
        pumpbutton.classList.add('active');
    }
});


