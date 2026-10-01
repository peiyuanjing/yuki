const restaurants = {
  igniv: {name: 'IGNIV Zürich', satLunch: false},
  august: {name: 'Boucherie AuGust', satLunch: true},
  oldinn: {name: 'Old Inn', satLunch: false},
  fujiya: {name: 'Fujiya of Japan', satLunch: false},
  seam: {name: 'Kappo SEAM', satLunch: true}
};
const days = [
  {key:"15", label:"Thursday, October 15"},
  {key:"16", label:"Friday, October 16"},
  {key:"17", label:"Saturday, October 17"}
];
const lunch = ["12:00","12:15","12:30"];
const dinner = ["18:15","18:30","18:45"];

let selectedRestaurant = null;
let selectedDay = null;
let selectedTime = null;

const picker = document.querySelector("#picker");
const pickedCopy = document.querySelector("#picked-copy");
const dates = document.querySelector("#dates");
const timeBlock = document.querySelector("#time-block");
const times = document.querySelector("#times");
const finalBox = document.querySelector("#final");
const summary = document.querySelector("#summary");
const copyButton = document.querySelector("#copy");
const copyStatus = document.querySelector("#copy-status");

function makeChoice(text, active, handler) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice" + (active ? " active" : "");
  button.textContent = text;
  button.addEventListener("click", handler);
  return button;
}

function renderDates() {
  dates.replaceChildren();
  days.forEach(day => {
    dates.appendChild(makeChoice(day.label, selectedDay === day.key, () => {
      selectedDay = day.key;
      selectedTime = null;
      copyStatus.textContent = "";
      renderDates();
      renderTimes();
    }));
  });
}

function renderTimes() {
  times.replaceChildren();
  timeBlock.classList.remove("hidden");
  const restaurant = restaurants[selectedRestaurant];
  const available = selectedDay === "17" && !restaurant.satLunch ? dinner : [...lunch, ...dinner];

  available.forEach(time => {
    const meal = lunch.includes(time) ? "Lunch" : "Dinner";
    times.appendChild(makeChoice(`${meal} · ${time}`, selectedTime === time, () => {
      selectedTime = time;
      copyStatus.textContent = "";
      renderTimes();
      renderFinal();
    }));
  });
  renderFinal();
}

function renderFinal() {
  if (!selectedRestaurant || !selectedDay || !selectedTime) {
    finalBox.classList.add("hidden");
    return;
  }
  const day = days.find(d => d.key === selectedDay);
  summary.innerHTML = `<strong>${restaurants[selectedRestaurant].name}</strong><br>${day.label}, 2026 · ${selectedTime}`;
  finalBox.classList.remove("hidden");
}

document.querySelectorAll(".choose").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".restaurant-card");
    selectedRestaurant = card.dataset.id;
    selectedDay = null;
    selectedTime = null;
    document.querySelectorAll(".restaurant-card").forEach(c => c.classList.toggle("selected", c === card));
    pickedCopy.textContent = `You picked ${restaurants[selectedRestaurant].name}. Now tell me when.`;
    picker.classList.remove("hidden");
    timeBlock.classList.add("hidden");
    finalBox.classList.add("hidden");
    copyStatus.textContent = "";
    renderDates();
    picker.scrollIntoView({behavior:"smooth", block:"start"});
  });
});

copyButton.addEventListener("click", async () => {
  const day = days.find(d => d.key === selectedDay);
  const message = `I made my choice ♡\nRestaurant: ${restaurants[selectedRestaurant].name}\nDate: ${day.label}, 2026\nTime: ${selectedTime}\n\nYour turn now, PJ :)`;
  try {
    await navigator.clipboard.writeText(message);
    copyStatus.textContent = "Copied ♡ Now paste it into WeChat.";
  } catch (error) {
    window.prompt("Copy this and send it to PJ:", message);
    copyStatus.textContent = "Ready to send ♡";
  }
});
