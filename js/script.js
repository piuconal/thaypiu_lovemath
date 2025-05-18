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
          "TOÁN 9": 200,
          "TOÁN 12": 300,
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
