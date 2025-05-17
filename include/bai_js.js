// Kiểm tra nếu đang dùng thiết bị di động
function isMobileDevice() {
  return window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
  document.getElementById("mobile-warning").style.display = "block";
}

function loadPDF(filename) {
  document.getElementById("pdfFrame").src = filename;
  document.getElementById("pdfFrame").style.display = "block";
  document.getElementById("imageList").style.display = "none";
  document.getElementById("imageModal").style.display = "none";
}

function showImages() {
  const container = document.getElementById("imageList");
  container.innerHTML = "";
  document.getElementById("pdfFrame").style.display = "none";
  container.style.display = "flex";

  fetch("dapan_list.json")
    .then((response) => response.json())
    .then((images) => {
      images.sort(); // sắp xếp theo tên tăng dần

      images.forEach(function (name) {
        const div = document.createElement("div");
        div.className = "image-container";

        const img = document.createElement("img");
        img.src = "dapan/" + name;
        img.alt = name;
        img.onclick = () => openModal("dapan/" + name);

        const caption = document.createElement("div");
        caption.textContent = name.replace(/\.[^/.]+$/, ""); // bỏ đuôi file
        caption.style.marginTop = "5px";
        caption.style.fontWeight = "bold";

        div.appendChild(img);
        div.appendChild(caption);
        container.appendChild(div);
      });
    })
    .catch((error) => {
      container.innerHTML = "<p>Lỗi khi tải danh sách ảnh.</p>";
      console.error(error);
    });
}

function openModal(imageSrc) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  modalImg.src = imageSrc;
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  modal.style.display = "none";
}
function toggleMenu() {
  const navMenu = document.getElementById("navMenu");
  navMenu.classList.toggle("show");
}
