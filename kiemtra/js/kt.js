let countdownValue = 50;
let countdownInterval;

function startCountdown() {
  countdownInterval = setInterval(() => {
    countdownValue--;
    document.getElementById("countdown").textContent = countdownValue;
    if (countdownValue <= 0) {
      closePopup();
    }
  }, 1000);
}

function startNow() {
  clearInterval(countdownInterval);
  closePopup();
}

function closePopup() {
  const popup = document.getElementById("countdownPopup");
  popup.style.display = "none";
}

window.onload = function () {
  document.getElementById("countdownPopup").style.display = "flex";
  startCountdown();
};

let timeLeft = 46 * 60; // 46 phút
const alarm = document.getElementById("alarmSound");

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timer").textContent =
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");

  if (timeLeft > 0) {
    timeLeft--;
  } else {
    clearInterval(timerInterval);
    showTimeoutPopup();
  }
}

function showTimeoutPopup() {
  document.getElementById("timeoutPopup").style.display = "flex";
  alarm.play();
}

function closeTimeoutPopup() {
  document.getElementById("timeoutPopup").style.display = "none";
  alarm.pause();
  alarm.currentTime = 0;
}

const timerInterval = setInterval(updateTimer, 1000);
updateTimer(); // Gọi ngay lần đầu
