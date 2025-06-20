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

const gradientClasses = [
  "bg-gradient-1",
  "bg-gradient-2",
  "bg-gradient-3",
  "bg-gradient-4",
  "bg-gradient-5",
  "bg-gradient-6",
  "bg-gradient-7",
];

document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("classList");
      container.innerHTML = "";

      Object.entries(data).forEach(([lop, kyList], lopIndex) => {
        const lopId = `lop-${lopIndex}`;
        const lopCard = document.createElement("div");
        const gradientClass =
          gradientClasses[lopIndex % gradientClasses.length];
        lopCard.className = `card ${gradientClass}`;

        const lopHeader = document.createElement("div");
        lopHeader.className = `card-header text-white scroll-to-center ${gradientClass}`;
        lopHeader.style.cursor = "pointer";
        lopHeader.addEventListener("click", (e) => {
          if (e.target.tagName.toLowerCase() === "button") {
            return; // cho button xử lý riêng
          }
          const collapseElem = document.getElementById(lopId);
          if (collapseElem.classList.contains("show")) {
            $(collapseElem).collapse("hide");
          } else {
            $(collapseElem).collapse("show");
          }
        });
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
            <button class="btn btn-link collapsed text-white font-weight-bold" data-toggle="collapse" data-target="#${lopId}" aria-expanded="false">
              ${lop}
            </button>
            ${
              showStudentCount
                ? `<span class="blinking text-white font-weight-bold mr-2">> ${studentCount} HS đạt 9+ kì thi tốt nghiệp 🌍</span>`
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
              <button class="chuongbai font-weight-bold btn btn-outline-info text-info btn-sm mb-2 ml-3 scroll-to-center" data-toggle="collapse" data-target="#${chuongId}">
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
                          class="text-dark font-weight-bold scroll-to-center" 
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
    const target = e.target.closest("button.btn-outline-info");

    if (target && target.dataset.toggle === "collapse") {
      const collapseId = target.dataset.target;
      const collapseElement = document.querySelector(collapseId);

      if (!collapseElement.classList.contains("show")) {
        e.preventDefault();

        const correctPassword = "math";
        const storageKey = "collapsePasswordUnlocked";
        const saved = localStorage.getItem(storageKey);
        const now = Date.now();
        const expiredAfter = 24 * 60 * 60 * 1000; // 24 giờ

        if (saved) {
          try {
            const data = JSON.parse(saved);
            if (data.unlocked && now - data.timestamp < expiredAfter) {
              // Đã mở và chưa hết hạn
              $(collapseId).collapse("show");
              return;
            } else {
              // Hết hạn
              localStorage.removeItem(storageKey);
            }
          } catch (err) {
            // Dữ liệu hỏng, xóa luôn
            localStorage.removeItem(storageKey);
          }
        }

        const userPassword = prompt(
          "🔐 Mật khẩu lưu trong 24h không cần nhập lại:"
        );

        if (userPassword === correctPassword) {
          $(collapseId).collapse("show");
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              unlocked: true,
              timestamp: now,
            })
          );
        } else {
          if (userPassword !== null) {
            alert("❌ Sai mật khẩu!");
          }
          document.querySelectorAll(".collapse.show").forEach((el) => {
            $(el).collapse("hide");
          });
          setTimeout(() => {
            location.reload();
          }, 300);
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
    countDown: [
      // <-- thêm createAIPic
      document.getElementById("toggleCountdownBtn"),
      document.getElementById("toggleCountdownBtnMobile"),
    ],
    thinkingTest: [
      // <-- thêm createAIPic
      document.getElementById("toggleThinkingTestBtn"),
      document.getElementById("toggleThinkingTestBtnMobile"),
    ],
    convertHsa: [
      document.getElementById("convertHsaScoreBtn"),
      document.getElementById("convertHsaScoreBtnMobile"),
    ],
    ranking: [document.getElementById("showRankingBtn")],
    simulation: [
      document.getElementById("toggleSimulationBtn"),
      document.getElementById("toggleSimulationBtnMobile"),
    ],
    planet: [
      document.getElementById("togglePlanetBtn"),
      document.getElementById("togglePlanetBtnMobile"),
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
    countDown: document.getElementById("countdownIframeContainer"), // <-- thêm
    thinkingTest: document.getElementById("thinkingTestIframeContainer"), // <-- thêm
    ranking: document.getElementById("rankingIframeContainer"), // <-- thêm
    convertHsa: document.getElementById("convertHsaIframeContainer"), // <-- thêm
    simulation: document.getElementById("simulationIframeContainer"),
    planet: document.getElementById("planetIframeContainer"),
  };

  const defaultTexts = {
    score: "📝 Tra điểm thi",
    temple: "🕯️ Cầu may mắn",
    alarm: "⏰ Đồng hồ",
    game: "🥇 Tower of Hanoi",
    visualgo: "📊 Thuật toán",
    geogebra: "👨🏼 Swap Face",
    mathAi: "📐 Math AI",
    createAIPic: "🤖 Create AI Picture", // <-- thêm
    countDown: "⏳ Đếm ngược kì thi", // <-- thêm
    thinkingTest: "✨ Đánh giá tư duy", // <-- thêm
    ranking: "📊 XẾP HẠNG", // <-- thêm
    convertHsa: "📊 Đổi điểm HSA", // <-- thêm
    simulation: "🎮 Mô phỏng",
    planet: "🌍 Hành tinh",
  };

  const hiddenTexts = {
    score: "Ẩn Điểm thi",
    temple: "Ẩn Chánh điện",
    alarm: "Ẩn Đồng hồ",
    game: "Ẩn Trò chơi",
    visualgo: "Ẩn Thuật toán",
    geogebra: "Ẩn Swap Face",
    mathAi: "Ẩn Math AI",
    createAIPic: "Ẩn Create AI", // <-- thêm
    countDown: "Ẩn Đếm ngược", // <-- thêm
    thinkingTest: "Ẩn Đánh giá", // <-- thêm
    convertHsa: "Ẩn Đổi điểm", // <-- thêm
    simulation: "Ẩn Mô phỏng",
    planet: "Ẩn Hành tinh",
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

  function showLoading() {
    if (loadingIndicator) loadingIndicator.style.display = "block";
  }

  function hideLoading() {
    if (loadingIndicator) loadingIndicator.style.display = "none";
  }

  function showFeedbackPopup() {
    feedbackPopup.style.display = "flex";
    loadFeedbacks();
    feedbackInput.focus();
  }

  function hideFeedbackPopup() {
    feedbackPopup.style.display = "none";
  }

  // Format thời gian ISO thành dd/mm/yy hh:mm:ss
  function formatDateTime(isoString) {
    const date = new Date(isoString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(2);
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${dd}/${mm}/${yy} ${hh}:${mi}:${ss}`;
  }

  async function fetchFeedbacksFromAPI() {
    try {
      const res = await fetch(
        "https://682a9218ab2b5004cb370ec8.mockapi.io/lovemath"
      );
      if (!res.ok) throw new Error("Không lấy được góp ý từ server");
      const data = await res.json();
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async function loadFeedbacks() {
    showLoading();
    feedbackList.innerHTML = ""; // 1. Đọc dữ liệu từ feed.json

    let localFeedbacks = [];
    try {
      const res = await fetch("feed.json");
      if (!res.ok) throw new Error("Không đọc được file feed.json");
      localFeedbacks = await res.json();
    } catch (e) {
      console.error("Lỗi khi đọc feed.json:", e);
    } // 2. Sau khi đọc xong file, gọi MockAPI

    const apiFeedbacks = await fetchFeedbacksFromAPI();

    hideLoading();

    const allFeedbacks = [...localFeedbacks, ...apiFeedbacks];

    if (allFeedbacks.length === 0) {
      feedbackList.innerHTML = "<div>Chưa có góp ý nào.</div>";
      return;
    } // 3. Sắp xếp theo thời gian giảm dần (mới nhất trước)

    allFeedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 4. Hiển thị

    allFeedbacks.forEach((fb) => {
      const div = document.createElement("div");
      const timeStr = fb.createdAt ? formatDateTime(fb.createdAt) : "??";
      div.textContent = `${timeStr}💠${fb.content}`;

      const colorClass = "color" + (Math.floor(Math.random() * 6) + 1);
      div.classList.add(colorClass);

      feedbackList.appendChild(div);
    });
  }

  async function sendFeedback(text) {
    showLoading();
    try {
      const res = await fetch(
        "https://682a9218ab2b5004cb370ec8.mockapi.io/lovemath",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: text,
            createdAt: new Date().toISOString(),
          }),
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

  if (feedbackBtn) feedbackBtn.addEventListener("click", showFeedbackPopup);
  if (feedbackBtnMobile)
    feedbackBtnMobile.addEventListener("click", showFeedbackPopup);

  closeFeedbackBtn.addEventListener("click", hideFeedbackPopup);

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
// ------------

window.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("popupImage");

  // Hiển thị overlay và popup ngay lập tức
  overlay.style.display = "block";
  popup.style.display = "block";

  // Sau 1 giây bắt đầu mờ dần trong 3 giây
  setTimeout(function () {
    overlay.classList.add("fade-out");
    popup.classList.add("fade-out");

    // Sau 3 giây mờ dần thì ẩn hoàn toàn
    setTimeout(function () {
      overlay.style.display = "none";
      popup.style.display = "none";
    }, 2500); // đúng bằng thời gian transition
  }, 100); // đợi 1 giây trước khi bắt đầu mờ dần
});
const videoPopup = document.getElementById("videoPopup");
const closeBtn = document.getElementById("closeVideo");
const gif = document.getElementById("introGif");

// Kiểm tra thời điểm gif đã được xem gần nhất
const lastPlayTime = localStorage.getItem("lastVideoPlayTime");
const now = Date.now();

if (!lastPlayTime || now - parseInt(lastPlayTime) > 3600000) {
  // Hiển thị ảnh GIF phù hợp thiết bị
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  gif.src = isMobile ? "video1.gif" : "video2.gif";

  // Hiện popup
  videoPopup.classList.remove("hidden");

  // Lưu thời điểm bắt đầu hiển thị
  localStorage.setItem("lastVideoPlayTime", now);
} else {
  // Ẩn popup nếu trong 10s kể từ lần xem gần nhất
  videoPopup.classList.add("hidden");
}

// Đóng khi nhấn nút X
closeBtn.addEventListener("click", () => {
  videoPopup.classList.add("hidden");
});

// Đóng video khi vuốt theo bất kỳ hướng nào
let startX = 0;
let startY = 0;

videoPopup.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

videoPopup.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const deltaX = Math.abs(endX - startX);
  const deltaY = Math.abs(endY - startY);

  if (deltaX > 50 || deltaY > 50) {
    videoPopup.classList.add("hidden");
    video.pause();
  }
});

const bubbleContainer = document.getElementById("summerBubbles");

// Sử dụng DocumentFragment để giảm thao tác DOM
const fragment = document.createDocumentFragment();

const totalBubbles = 12;

for (let i = 0; i < totalBubbles; i++) {
  const bubble = document.createElement("div");
  bubble.className = "bubble";

  // Ngẫu nhiên kích thước (10px - 25px)
  const size = Math.random() * 15 + 10;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;

  // Vị trí bên trái (%)
  const left = Math.random() * 100;
  bubble.style.left = `${left}%`;

  // Hiệu ứng mượt: thời gian chạy và delay ngẫu nhiên
  const duration = Math.random() * 4 + 4; // 4s - 8s
  const delay = Math.random() * 3; // 0s - 3s
  bubble.style.animationDuration = `${duration}s`;
  bubble.style.animationDelay = `${delay}s`;

  fragment.appendChild(bubble);
}

bubbleContainer.appendChild(fragment);

const classPopup = document.getElementById("classPopup");
const showClassPopupBtn = document.getElementById("showClassPopupBtn");

function closeClassPopup() {
  classPopup.style.display = "none";
}

// Đóng popup khi click ra ngoài vùng popup
classPopup.addEventListener("click", (e) => {
  if (e.target === classPopup) {
    closeClassPopup();
  }
});

function toggleLinks(id) {
  document.querySelectorAll(".link-buttons").forEach((el) => {
    if (el.id !== id) el.classList.remove("show");
  });
  const element = document.getElementById(id);
  element.classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("classPopup");
  const correctPassword = "math";

  document
    .getElementById("showClassPopupBtn")
    .addEventListener("click", function () {
      const isUnlocked = localStorage.getItem("classPopupUnlocked");

      if (isUnlocked === "true") {
        // Đã nhập mật khẩu rồi, mở popup luôn
        popup.style.display = "flex";
        return;
      }

      // Chưa nhập mật khẩu, hỏi prompt
      const userInput = prompt("🔐 Nhập mật khẩu:");

      if (
        userInput === null ||
        userInput.trim() === "" ||
        userInput !== correctPassword
      ) {
        location.reload(); // Không mở popup
        return;
      }

      // Nhập đúng mật khẩu, mở popup và lưu trạng thái
      popup.style.display = "flex";
      localStorage.setItem("classPopupUnlocked", "true");
    });
});
