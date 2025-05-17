// Kiểm tra nếu đang dùng thiết bị di động
function isMobileDevice() {
  return window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
  document.getElementById("mobile-warning").style.display = "block";
}

function loadPDF(file) {
  document.getElementById("pdfFrame").src = file;
}
