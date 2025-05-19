// document.addEventListener("DOMContentLoaded", () => {
//   const correctPassword = "******"; // Mật khẩu bạn muốn đặt
//   let userInput = prompt("Vui lòng nhập mật khẩu để truy cập trang:");

//   if (userInput !== correctPassword) {
//     alert("Mật khẩu không đúng! Bạn không được phép truy cập.");
//     // Ẩn toàn bộ nội dung trang
//     document.body.innerHTML =
//       "<h2 class='text-center mt-5 text-danger'>Bạn không có quyền truy cập trang này.</h2>";
//     // Hoặc chuyển hướng về trang khác, ví dụ:
//     // window.location.href = "https://example.com/no-access.html";
//   }
// });

document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("classList");
      container.innerHTML = "";

      Object.entries(data).forEach(([lop, kyList], lopIndex) => {
        const lopId = `lop-${lopIndex}`;
        const lopCard = document.createElement("div");
        lopCard.className = "card";

        const lopHeader = document.createElement("div");
        lopHeader.className = "card-header bg-light scroll-to-center";

        // // Danh sách số học sinh cố định ứng với từng lớp
        // const fixedStudentCounts = [30, 50, 40, 200, 150, 150, 200]; // Bạn có thể thêm nữa nếu có nhiều lớp

        // // Lấy số tương ứng theo index lớp (lopIndex)
        // const studentCount = fixedStudentCounts[lopIndex] || 0;

        // Danh sách lớp có số học sinh 9+
        const fixedStudentCounts = {
          "TOÁN 9": 400,
          "TOÁN 12": 600,
        };

        const studentCount = fixedStudentCounts[lop] || 0;

        const showStudentCount = fixedStudentCounts.hasOwnProperty(lop);

        // lopHeader.innerHTML = `
        //   <h5 class="mb-0 d-flex justify-content-between align-items-center">
        //     <button class="btn btn-link collapsed text-dark font-weight-bold" data-toggle="collapse" data-target="#${lopId}" aria-expanded="false">
        //       ${lop}
        //     </button>
        //     <span class="blinking text-danger font-weight-bold mr-2">> ${studentCount} học sinh đạt 9+ trong các kì thi</span>
        //   </h5>
        // `;

        lopHeader.innerHTML = `
          <h5 class="mb-0 d-flex justify-content-between align-items-center">
            <button class="btn btn-link collapsed text-dark font-weight-bold" data-toggle="collapse" data-target="#${lopId}" aria-expanded="false">
              ${lop}
            </button>
            ${
              showStudentCount
                ? `<span class="blinking text-danger font-weight-bold mr-2">> ${studentCount} học sinh đạt 9+ trong kì thi tốt nghiệp</span>`
                : ""
            }
          </h5>
        `;

        const lopCollapse = document.createElement("div");
        lopCollapse.id = lopId;
        lopCollapse.className = "collapse";
        const lopBody = document.createElement("div");
        lopBody.className = "card-body";

        // Xử lý các kỳ học
        Object.entries(kyList).forEach(([ky, chuongList], kyIndex) => {
          const kyId = `${lopId}-ky-${kyIndex}`;
          const kyDiv = document.createElement("div");

          kyDiv.innerHTML = `
  <button class="btn btn-outline-primary btn-sm mb-2 scroll-to-center" data-toggle="collapse" data-target="#${kyId}">
    ${ky}
  </button>
  <div class="collapse" id="${kyId}"></div>
`;

          const chuongContainer = kyDiv.querySelector(`#${kyId}`);

          // Thêm chương vào kỳ
          Object.entries(chuongList).forEach(
            ([chuong, baiList], chuongIndex) => {
              const chuongId = `${kyId}-chuong-${chuongIndex}`;
              const chuongDiv = document.createElement("div");

              chuongDiv.innerHTML = `
 <button class="btn btn-outline-secondary btn-sm mb-2 ml-3 scroll-to-center" data-toggle="collapse" data-target="#${chuongId}">
    ${chuong}
  </button>
              <div class="collapse ml-4" id="${chuongId}">
                <ul class="list-group mb-3">
                  ${baiList
                    .map((bai, baiIndex) => {
                      const lopNumberMatch = lop.match(/\d+/);
                      const lopNumber = lopNumberMatch
                        ? lopNumberMatch[0]
                        : lopIndex + 1;

                      const lopSlug = `toan${lopNumber}`;
                      const kySlug = `ki${kyIndex + 1}`;
                      const chuongSlug = `chuong${chuongIndex + 1}`;

                      // Trích số từ tên bài (vd: "Bài 26" -> 26)
                      const baiNumberMatch = bai.match(/\d+/);
                      const baiNumber = baiNumberMatch
                        ? baiNumberMatch[0]
                        : baiIndex + 1;

                      const baiSlug = `bai${baiNumber}`;

                      return `
  <li class="list-group-item p-2">
    <a href="${lopSlug}/${kySlug}/${chuongSlug}/${baiSlug}/${baiSlug}.html" 
       class="text-dark scroll-to-center" 
       title="${bai}" 
       target="_blank">
      ${bai}
    </a>
  </li>`;
                    })
                    .join("")}
                </ul>
              </div>
            `;

              chuongContainer.appendChild(chuongDiv);
            }
          );

          lopBody.appendChild(kyDiv);
        });

        lopCollapse.appendChild(lopBody);
        lopCard.appendChild(lopHeader);
        lopCard.appendChild(lopCollapse);
        container.appendChild(lopCard);
      });
    })
    .catch((err) => {
      console.error("Lỗi khi tải dữ liệu JSON:", err);
    });

  document.addEventListener("click", function (e) {
    const target = e.target;
    const scrollTarget = target.closest(".scroll-to-center");

    if (scrollTarget) {
      // Tìm ra phần tử nút lớp (TOÁN 6, TOÁN 7, ...)
      const lopButton = scrollTarget
        .closest(".card-header")
        ?.querySelector("button");
      const lopText = lopButton?.textContent?.trim();

      if (lopText === "TOÁN 12" || lopText === "TOÁN 11") {
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }, 300);
      }

      // Trường hợp là link bài học -> mở tab sau khi scroll
      if (scrollTarget.tagName === "A" && scrollTarget.target === "_blank") {
        e.preventDefault();
        const href = scrollTarget.href;
        setTimeout(() => {
          window.open(href, "_blank");
        }, 600);
      }
    }
  });
  // Yêu cầu mật khẩu trước khi mở chương
  document.addEventListener("click", function (e) {
    const target = e.target.closest("button.btn-outline-secondary");

    if (target && target.dataset.toggle === "collapse") {
      const collapseId = target.dataset.target;
      const collapseElement = document.querySelector(collapseId);

      if (!collapseElement.classList.contains("show")) {
        e.preventDefault();

        const correctPassword = "`";
        const userPassword = prompt("🔒 Nhập mật khẩu để mở chương:");

        if (userPassword === correctPassword) {
          $(collapseId).collapse("show");
        } else {
          if (userPassword !== null) {
            alert("❌ Sai mật khẩu!");
          }
          // Đóng tất cả collapse đang mở
          document.querySelectorAll(".collapse.show").forEach((el) => {
            $(el).collapse("hide");
          });

          // Chờ một chút để animation đóng xong rồi reload trang
          setTimeout(() => {
            location.reload();
          }, 300); // 300ms đủ để animation đóng hoàn tất
        }
      }
    }
  });
});

// Hàm chuyển đổi văn bản thành slug (không dùng trong phần link rút gọn này nhưng giữ lại để bạn dùng sau)
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .replace(/[^a-z0-9 ]/g, "") // bỏ ký tự đặc biệt
    .replace(/\s+/g, "-") // khoảng trắng -> gạch ngang
    .replace(/-+/g, "-"); // bỏ trùng gạch
}

// document.addEventListener("DOMContentLoaded", function () {
//   const text =
//     "Nhiều học sinh đạt điểm cao trong các kỳ thi tốt nghiệp được tặng nhiều món quà giá trị cao!";
//   const target = document.getElementById("typing-text");
//   let index = 0;

//   function typeChar() {
//     if (index < text.length) {
//       target.innerHTML += text.charAt(index);
//       index++;
//       setTimeout(typeChar, 40); // tốc độ xuất hiện từng ký tự (ms)
//     }
//   }

//   typeChar();
// });

document.addEventListener("DOMContentLoaded", function () {
  const giftBoxTrigger = document.getElementById("giftBoxTrigger");
  const chatbotPopup = document.getElementById("chatbotPopup");
  const closeChatbotBtn = document.getElementById("closeChatbotBtn");
  const userInput = document.getElementById("userInput");
  const chatArea = document.getElementById("chatArea");

  const apiKey = "AIzaSyDulphYSxx-kkN71idQBlyetg16a9Qpj24";

  function appendMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message");

    if (sender === "Bạn") {
      messageDiv.classList.add("message-user");
    } else {
      messageDiv.classList.add("message-ai");
    }

    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function fetchGeminiResponse(text) {
    fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const reply =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Không có phản hồi.";
        appendMessage("Piu AI", reply);
      })
      .catch((err) => {
        appendMessage("Piu AI", "Đã xảy ra lỗi khi gọi API.");
        console.error("Gemini API Error:", err);
      });
  }

  giftBoxTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    chatbotPopup.style.display =
      chatbotPopup.style.display === "flex" ? "none" : "flex";
    if (chatbotPopup.style.display === "flex") {
      userInput.focus();
    }
  });

  closeChatbotBtn.addEventListener("click", () => {
    chatbotPopup.style.display = "none";
  });

  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && userInput.value.trim() !== "") {
      const userMessage = userInput.value.trim();
      appendMessage("Bạn", userMessage);
      userInput.value = "";
      fetchGeminiResponse(userMessage);
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const classListContainer = document.querySelector(".container.py-4");

  const buttons = {
    score: [
      document.getElementById("toggleIframeBtn"),
      document.getElementById("toggleIframeBtnMobile"),
    ],
    temple: [
      document.getElementById("toggleTempleBtn"),
      document.getElementById("toggleTempleBtnMobile"),
    ],
    alarm: [
      document.getElementById("toggleAlarmBtn"),
      document.getElementById("toggleAlarmBtnMobile"),
    ],
    game: [
      document.getElementById("toggleGameBtn"),
      document.getElementById("toggleGameBtnMobile"),
    ],
    visualgo: [
      document.getElementById("toggleVisualgoBtn"),
      document.getElementById("toggleVisualgoBtnMobile"),
    ],
    geogebra: [
      document.getElementById("toggleGeogebraBtn"),
      document.getElementById("toggleGeogebraBtnMobile"),
    ],
    mathAi: [
      document.getElementById("toggleMathAiBtn"),
      document.getElementById("toggleMathAiBtnMobile"),
    ],
    createAIPic: [
      // <-- thêm createAIPic
      document.getElementById("toggleCreateAIPicBtn"),
      document.getElementById("toggleCreateAIPicBtnMobile"),
    ],
  };

  const containers = {
    score: document.getElementById("iframeContainer"),
    temple: document.getElementById("templeIframeContainer"),
    alarm: document.getElementById("alarmIframeContainer"),
    game: document.getElementById("gameIframeContainer"),
    visualgo: document.getElementById("visualgoIframeContainer"),
    geogebra: document.getElementById("geogebraIframeContainer"),
    mathAi: document.getElementById("mathAiIframeContainer"),
    createAIPic: document.getElementById("createAIPicIframeContainer"), // <-- thêm
  };

  const defaultTexts = {
    score: "Tra điểm thi",
    temple: "Thắp hương",
    alarm: "Đồng hồ",
    game: "Tower of Hanoi",
    visualgo: "Thuật toán",
    geogebra: "Swap Face",
    mathAi: "Math AI",
    createAIPic: "Tạo ảnh AI", // <-- thêm
  };

  const hiddenTexts = {
    score: "Ẩn Điểm thi",
    temple: "Ẩn Chánh điện",
    alarm: "Ẩn Đồng hồ",
    game: "Ẩn Trò chơi",
    visualgo: "Ẩn Visualgo",
    geogebra: "Ẩn Swap Face",
    mathAi: "Ẩn Math AI",
    createAIPic: "Ẩn Tạo ảnh AI", // <-- thêm
  };

  function toggleSnowEffect(show) {
    document
      .querySelectorAll(".snow, canvas, .noel-container")
      .forEach((el) => {
        el.style.display = show ? "block" : "none";
      });
  }

  function toggleSection(section) {
    Object.keys(containers).forEach((key) => {
      const isCurrent = key === section;
      const container = containers[key];
      const btnList = buttons[key];

      container.style.display = isCurrent
        ? container.style.display === "block"
          ? "none"
          : "block"
        : "none";

      const isVisible = container.style.display === "block";

      btnList.forEach((btn) => {
        if (btn) {
          btn.textContent =
            isCurrent && isVisible ? hiddenTexts[key] : defaultTexts[key];
        }
      });
    });

    const isVisible = containers[section].style.display === "block";
    classListContainer.style.display = isVisible ? "none" : "block";
    toggleSnowEffect(
      section === "temple" || section === "game" ? !isVisible : true
    );
  }

  Object.keys(buttons).forEach((key) => {
    buttons[key].forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", () => toggleSection(key));
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuToggleBtn");
  const dropdownMenu = document.getElementById("mobileDropdownMenu");

  menuBtn.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });

  // Click ngoài menu sẽ đóng menu
  document.addEventListener("click", (e) => {
    if (!menuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove("show");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const feedbackBtn = document.getElementById("toggleFeedbackBtn");
  const feedbackBtnMobile = document.getElementById("toggleFeedbackBtnMobile");
  const feedbackPopup = document.getElementById("feedbackPopup");
  const closeFeedbackBtn = document.getElementById("closeFeedbackBtn");
  const feedbackInput = document.getElementById("feedbackInput");
  const feedbackList = document.getElementById("feedbackList");
  const loadingIndicator = document.getElementById("loadingIndicator");

  // Hiển thị loading
  function showLoading() {
    if (loadingIndicator) loadingIndicator.style.display = "block";
  }

  // Ẩn loading
  function hideLoading() {
    if (loadingIndicator) loadingIndicator.style.display = "none";
  }

  // Hiển thị popup
  function showFeedbackPopup() {
    feedbackPopup.style.display = "flex";
    loadFeedbacks();
    feedbackInput.focus();
  }

  // Ẩn popup
  function hideFeedbackPopup() {
    feedbackPopup.style.display = "none";
  }

  // Lấy góp ý từ API
  async function fetchFeedbacksFromAPI() {
    try {
      const res = await fetch(
        "https://682a9218ab2b5004cb370ec8.mockapi.io/lovemath"
      );
      if (!res.ok) throw new Error("Không lấy được góp ý từ server");
      const data = await res.json();
      return data.map((item) => item.content);
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  // Hiển thị danh sách góp ý
  async function loadFeedbacks() {
    showLoading();
    feedbackList.innerHTML = "";
    const feedbacks = await fetchFeedbacksFromAPI();
    hideLoading();

    if (feedbacks.length === 0) {
      feedbackList.innerHTML = "<div>Chưa có góp ý nào.</div>";
      return;
    }

    feedbacks.forEach((fb) => {
      const div = document.createElement("div");
      div.textContent = fb;

      // Gán class màu ngẫu nhiên từ 1 đến 6
      const colorClass = "color" + (Math.floor(Math.random() * 6) + 1);
      div.classList.add(colorClass);

      feedbackList.prepend(div);
    });
  }

  // Gửi góp ý
  async function sendFeedback(text) {
    showLoading();
    try {
      const res = await fetch(
        "https://682a9218ab2b5004cb370ec8.mockapi.io/lovemath",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text }),
        }
      );
      if (!res.ok) throw new Error("Không thể gửi góp ý");
      return true;
    } catch (e) {
      console.error(e);
      alert("Lỗi khi gửi góp ý. Vui lòng thử lại sau.");
      return false;
    } finally {
      hideLoading();
    }
  }

  // Mở popup
  if (feedbackBtn) feedbackBtn.addEventListener("click", showFeedbackPopup);
  if (feedbackBtnMobile)
    feedbackBtnMobile.addEventListener("click", showFeedbackPopup);

  // Đóng popup
  closeFeedbackBtn.addEventListener("click", hideFeedbackPopup);

  // Gửi góp ý khi nhấn Enter
  feedbackInput.addEventListener("keydown", async function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = feedbackInput.value.trim();
      if (text.length === 0) return;

      const sent = await sendFeedback(text);
      if (sent) {
        await loadFeedbacks();
        feedbackInput.value = "";
      }
    }
  });
});

// Cảnh báo khi mở DevTools
// Chặn chuột phải
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// Chặn F12, Ctrl+U, Ctrl+Shift+I/C
document.addEventListener("keydown", function (e) {
  if (
    e.keyCode === 123 || // F12
    (e.ctrlKey && (e.key === "u" || e.key === "s")) ||
    (e.ctrlKey &&
      e.shiftKey &&
      (e.key === "I" || e.key === "C" || e.key === "J"))
  ) {
    e.preventDefault();
  }
});

// Phát hiện DevTools (chênh lệch kích thước)
setInterval(function () {
  if (
    window.outerWidth - window.innerWidth > 160 ||
    window.outerHeight - window.innerHeight > 160
  ) {
    document.body.innerHTML =
      "<h1 style='color:red;text-align:center;'>Đừng mở DevTools nữa!</h1>";
  }
}, 1000);

// ------------
// Hiển thị overlay và popup ngay khi bắt đầu tải trang
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("popupImage").style.display = "block";
});

// Khi trang tải xong thì ẩn overlay và popup
window.addEventListener("load", function () {
  setTimeout(function () {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popupImage").style.display = "none";
  }, 100); // Delay 1s để giữ hiệu ứng 1 chút
});

// Cho phép tắt khi click thủ công vào overlay hoặc ảnh
document.getElementById("overlay").addEventListener("click", function () {
  this.style.display = "none";
  document.getElementById("popupImage").style.display = "none";
});
document.getElementById("popupImage").addEventListener("click", function () {
  this.style.display = "none";
  document.getElementById("overlay").style.display = "none";
});

const bubbleContainer = document.getElementById("summerBubbles");

for (let i = 0; i < 40; i++) {
  const bubble = document.createElement("div");
  bubble.className = "bubble";

  // Ngẫu nhiên kích thước và vị trí
  const size = Math.random() * 20 + 10; // từ 10px đến 30px
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${Math.random() * 100}%`;

  // Ngẫu nhiên thời gian trễ và tốc độ
  bubble.style.animationDuration = `${Math.random() * 5 + 4}s`;
  bubble.style.animationDelay = `${Math.random() * 5}s`;

  bubbleContainer.appendChild(bubble);
}
