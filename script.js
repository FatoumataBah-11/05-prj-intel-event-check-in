// script.js

// --- Global variables ---
let attendeeCount = 0;
const goal = 50;

let teamCounts = {
    water: 0,
    zero: 0,
    power: 0,
};

let attendees = [];

// --- DOM elements ---
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");

const attendeeCountEl = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

const waterCountEl = document.getElementById("waterCount");
const zeroCountEl = document.getElementById("zeroCount");
const powerCountEl = document.getElementById("powerCount");

const attendeeListContainer = document.createElement("div");
attendeeListContainer.classList.add("attendee-list");
document.querySelector(".container").appendChild(attendeeListContainer);

// --- Add Clear All Button ---
const clearBtn = document.createElement("button");
clearBtn.textContent = "Clear All";
clearBtn.classList.add("clear-btn");
document.querySelector(".container").appendChild(clearBtn);

clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all check-ins?")) {
        clearAll();
    }
});

// --- Load saved data from localStorage on page load ---
window.addEventListener("load", () => {
    const savedCount = localStorage.getItem("attendeeCount");
    const savedTeams = localStorage.getItem("teamCounts");
    const savedAttendees = localStorage.getItem("attendees");

    if (savedCount) attendeeCount = parseInt(savedCount, 10);
    if (savedTeams) teamCounts = JSON.parse(savedTeams);
    if (savedAttendees) attendees = JSON.parse(savedAttendees);

    updateAttendance();
    updateTeams();
    updateProgress();
    renderAttendeeList();
});

// --- Event Listener for form submit ---
form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get values
    const name = nameInput.value.trim();
    const team = teamSelect.value;

    if (!name || !team) {
        return; // don’t proceed if empty
    }

    // Update totals
    attendeeCount++;
    teamCounts[team]++;
    attendees.push({ name, team });

    // Update DOM
    updateAttendance();
    updateTeams();
    updateProgress();
    showGreeting(name, team);
    renderAttendeeList();

    // Save progress
    saveProgress();

    // Reset form
    form.reset();
});

// --- Functions ---
function updateAttendance() {
    attendeeCountEl.textContent = attendeeCount;
}

function updateTeams() {
    waterCountEl.textContent = teamCounts.water;
    zeroCountEl.textContent = teamCounts.zero;
    powerCountEl.textContent = teamCounts.power;
}

function updateProgress() {
    const percent = Math.min((attendeeCount / goal) * 100, 100);
    progressBar.style.width = percent + "%";

    // Celebration if goal reached
    if (attendeeCount === goal) {
        celebrate();
        clearAll(); // clear everything once goal reached
    }
}

function showGreeting(name, team) {
    let teamLabel = "";
    if (team === "water") teamLabel = "Team Water Wise 🌊";
    if (team === "zero") teamLabel = "Team Net Zero 🌿";
    if (team === "power") teamLabel = "Team Renewables ⚡";

    greeting.textContent = `Welcome, ${name}! Thanks for representing ${teamLabel}! 🎉`;
}

function celebrate() {
    // Figure out the winning team
    let winningTeam = Object.keys(teamCounts).reduce((a, b) =>
        teamCounts[a] > teamCounts[b] ? a : b
    );

    let winningLabel = "";
    if (winningTeam === "water") winningLabel = "Team Water Wise 🌊";
    if (winningTeam === "zero") winningLabel = "Team Net Zero 🌿";
    if (winningTeam === "power") winningLabel = "Team Renewables ⚡";

    alert(
        `🎊 Goal reached! ${attendeeCount} attendees checked in! The leading team is: ${winningLabel}! All records will now reset.`
    );
}

function clearAll() {
    // Reset everything
    attendeeCount = 0;
    teamCounts = { water: 0, zero: 0, power: 0 };
    attendees = [];

    // Update DOM
    updateAttendance();
    updateTeams();
    updateProgress();
    greeting.textContent = "";
    attendeeListContainer.innerHTML = "";

    // Clear storage
    localStorage.clear();
}

function saveProgress() {
    localStorage.setItem("attendeeCount", attendeeCount);
    localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
    localStorage.setItem("attendees", JSON.stringify(attendees));
}

function renderAttendeeList() {
    attendeeListContainer.innerHTML = "<h3>Attendee List</h3>";
    const list = document.createElement("ul");

    attendees.forEach((person) => {
        let teamLabel = "";
        if (person.team === "water") teamLabel = "Team Water Wise 🌊";
        if (person.team === "zero") teamLabel = "Team Net Zero 🌿";
        if (person.team === "power") teamLabel = "Team Renewables ⚡";

        const li = document.createElement("li");
        li.textContent = `${person.name} — ${teamLabel}`;
        list.appendChild(li);
    });

    attendeeListContainer.appendChild(list);
}
