// Tạo thẻ caption và thêm vào modal bằng JS
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const imageList = document.getElementById("imageList");

const captionDiv = document.createElement("div");
captionDiv.id = "modal-caption";
captionDiv.style.color = "#fff";
captionDiv.style.fontSize = "20px";
captionDiv.style.fontWeight = "bold";
captionDiv.style.textAlign = "center";
captionDiv.style.marginBottom = "10px";
captionDiv.style.userSelect = "none";

// Thêm caption vào trước ảnh trong modal
modal.querySelector(".modal-content").insertBefore(captionDiv, modalImg);

// Tạo danh sách ảnh
const images = [];
for (let i = 1; i <= totalImages; i++) {
  const img = new Image();
  img.src = `./list_ques/c${i}.png`;
  img.alt = `Bài tập ${i}`;
  images.push(img);

  const container = document.createElement("div");
  container.className = "image-item";
  container.tabIndex = 0;

  img.style.cursor = "pointer";
  const caption = document.createElement("div");
  caption.className = "image-caption";
  caption.innerText = img.alt;

  container.appendChild(img);
  container.appendChild(caption);
  imageList.appendChild(container);
}

let currentIndex = -1;

images.forEach((img, index) => {
  img.addEventListener("click", () => {
    currentIndex = index;
    showImage(index);
  });
});

function showImage(index) {
  if (index < 0 || index >= images.length) return;
  modal.style.display = "flex";
  modalImg.src = images[index].src;
  modalImg.alt = images[index].alt;
  captionDiv.textContent = images[index].alt;
  modal.focus();
}

// ESC để đóng, mũi tên để chuyển
modal.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.style.display = "none";
    modalImg.src = "";
    captionDiv.textContent = "";
    return;
  }
  if (e.key === "ArrowRight") {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }
  if (e.key === "ArrowLeft") {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  }
});

// Click ra ngoài ảnh để đóng
modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target === modalImg) {
    modal.style.display = "none";
    modalImg.src = "";
    captionDiv.textContent = "";
  }
});

// Vuốt để chuyển ảnh trên mobile
let touchStartX = 0;
modal.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});
modal.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].screenX;
  const diffX = touchEndX - touchStartX;
  if (Math.abs(diffX) > 50) {
    if (diffX < 0) {
      currentIndex = (currentIndex + 1) % images.length;
    } else {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
    }
    showImage(currentIndex);
  }
});
