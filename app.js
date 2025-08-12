// Using Luxon library
const { DateTime } = luxon;

let dobDateTime = null;
let liveTimer = null;

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Custom date picker
  flatpickr("#date-input", {
    dateFormat: "Y-m-d",
    maxDate: "today",
    allowInput: true,
    clickOpens: true,
    onChange: (dates, dateStr) => {
      document.getElementById("date-input").value = dateStr;
    }
  });

  // Button click
  document.getElementById("calc-age-btn").addEventListener("click", processAge);
  // Press Enter
  document.getElementById("date-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      processAge();
    }
  });

  resetDisplay();
});

// Error handling
function showError(message) {
  document.getElementById("error-message").textContent = message;
  document.getElementById("output-block").style.display = "none";
}
function clearError() {
  document.getElementById("error-message").textContent = "";
}

// Update the age output
function showAgeParts(ageObj) {
  for (let key in ageObj) {
    document.getElementById(key).textContent = ageObj[key];
  }
  document.getElementById("output-block").style.display = "flex";
}

// Reset to default
function resetDisplay() {
  ["years", "months", "days", "hours", "minutes", "seconds"].forEach(id => {
    document.getElementById(id).textContent = "-";
  });
  document.getElementById("output-block").style.display = "none";
}

// Core calculation
function calculateAgeLive() {
  if (!dobDateTime) return resetDisplay();

  const now = DateTime.local();
  if (dobDateTime > now) {
    resetDisplay();
    showError("Not Born Yet!");
    return;
  }

  let years = Math.floor(now.diff(dobDateTime, "years").years);
  let tempDate = dobDateTime.plus({ years });

  let months = Math.floor(now.diff(tempDate, "months").months);
  tempDate = tempDate.plus({ months });

  let days = Math.floor(now.diff(tempDate, "days").days);
  tempDate = tempDate.plus({ days });

  let hours = Math.floor(now.diff(tempDate, "hours").hours);
  tempDate = tempDate.plus({ hours });

  let minutes = Math.floor(now.diff(tempDate, "minutes").minutes);
  tempDate = tempDate.plus({ minutes });

  let seconds = Math.floor(now.diff(tempDate, "seconds").seconds);

  showAgeParts({ years, months, days, hours, minutes, seconds });
}

// Validate input
function validateDateInput(dateStr) {
  if (!dateStr) {
    showError("Please pick or enter your birthdate.");
    return false;
  }
  const dt = DateTime.fromFormat(dateStr.trim(), "yyyy-MM-dd");
  if (!dt.isValid) {
    showError("Invalid date format! Use YYYY-MM-DD or pick from the calendar.");
    return false;
  }
  if (dt > DateTime.local().startOf("day")) {
    showError("Not Born Yet!");
    return false;
  }
  clearError();
  return dt.startOf("day");
}

// Start real-time ticking
function startClock() {
  if (liveTimer) clearInterval(liveTimer);
  liveTimer = setInterval(calculateAgeLive, 1000);
}

// Process when user clicks calculate
function processAge() {
  const inputVal = document.getElementById("date-input").value;
  const birthDT = validateDateInput(inputVal);

  if (!birthDT) {
    resetDisplay();
    if (liveTimer) clearInterval(liveTimer);
    return;
  }

  dobDateTime = birthDT;
  calculateAgeLive();
  startClock();
}
