let timer = null;
let interval = 0;
let reductionRate = 0;
let reductionTime = 0;
let currentInterval = 0;
let totalTime = 0;
let timeUntilReduction = 0;
let state = "initial"; // States: "initial", "running", "stopped"

// Load the whistle sound
const whistle = new Audio('whistle.wav');

function startStopResetTimer() {
    const button = document.getElementById('startStopButton');

    if (state === "initial") {
        // Start the timer
        console.log("Starting the timer...");
        initializeTimer();
        runTimer();
        state = "running";
        button.innerText = "Stop";
        button.classList.remove("btn-success");
        button.classList.add("btn-danger");
    } else if (state === "running") {
        // Stop the timer
        console.log("Stopping the timer...");
        stopTimer();
        state = "stopped";
        button.innerText = "Reset";
        button.classList.remove("btn-danger");
        button.classList.add("btn-warning");
    } else if (state === "stopped") {
        // Reset the timer
        console.log("Resetting the timer...");
        resetTimer();
        state = "initial";
        button.innerText = "Start";
        button.classList.remove("btn-warning");
        button.classList.add("btn-success");
    }
}

function initializeTimer() {
    // Get input values
    interval = parseFloat(document.getElementById('startInterval').value);
    reductionRate = parseFloat(document.getElementById('reductionRate').value) / 100;
    reductionTime = parseFloat(document.getElementById('reductionTime').value);

    // Initialize variables
    currentInterval = interval;
    totalTime = 0;
    timeUntilReduction = reductionTime;

    // Update the initial display
    document.getElementById('totalRunTime').innerText = formatTime(totalTime);
    document.getElementById('currentInterval').innerText = currentInterval.toFixed(2);
}

function runTimer() {
    if (!currentInterval) return; // Prevent running with invalid input

    // Stop the current whistle if playing and reset it
    whistle.pause();
    whistle.currentTime = 0;

    // Play whistle and display the current interval
    whistle.play().catch((err) => {
        console.error("Audio playback error:", err);
    });
    document.getElementById('currentInterval').innerText = currentInterval.toFixed(2);

    // Set a timeout for the current interval
    timer = setTimeout(() => {
        totalTime += currentInterval;
        document.getElementById('totalRunTime').innerText = formatTime(totalTime);

        // Check if it's time to reduce the interval
        timeUntilReduction -= currentInterval;
        if (timeUntilReduction <= 0) {
            timeUntilReduction = reductionTime;
            currentInterval -= currentInterval * reductionRate; // Reduce the interval
        }

        // Continue the timer
        runTimer();
    }, currentInterval * 1000);
}

function stopTimer() {
    // Stop the timer without resetting variables
    clearTimeout(timer);
    timer = null;
}

function resetTimer() {
    // Stop the timer and reset all variables
    clearTimeout(timer);
    timer = null;
    interval = 0;
    currentInterval = 0;
    totalTime = 0;
    timeUntilReduction = 0;

    // Reset the display
    document.getElementById('currentInterval').innerText = "-";
    document.getElementById('totalRunTime').innerText = "-";

    // Ensure no lingering audio
    whistle.pause();
    whistle.currentTime = 0;
}

// Utility function to format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
}

// Expose the function to the global scope
window.startStopResetTimer = startStopResetTimer;
