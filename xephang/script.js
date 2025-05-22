const sheetId = "1mhysCQlDk9PEnwlkOEuVAETEtNcRBZQOOiu3uhXMGxc";
const sheetName = "Học kì 1";
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

fetch(url)
  .then((response) => response.text())
  .then((csv) => {
    const rows = csv.trim().split("\n");
    const names = rows[0]
      .split(",")
      .slice(1, 38)
      .map((name) => name.replace(/"/g, "").trim());
    const scores = rows[1]
      .split(",")
      .slice(1, 38)
      .map((score) =>
        parseFloat(score.replace(/"/g, "").trim().replace(",", "."))
      );

    const combined = names.map((name, i) => ({
      name,
      score: scores[i],
      colIndex: i,
    }));
    combined.sort((a, b) => b.score - a.score);

    const listContainer = document.getElementById("score-list");
    const topContainer = document.querySelector(".top");

    function getScoreClass(colIndex) {
      if (colIndex >= 0 && colIndex <= 6) return "score-yellow";
      if (colIndex >= 7 && colIndex <= 18) return "score-green";
      if (colIndex === 19) return "score-blue";
      return "score-teal";
    }

    // Hiển thị danh sách điểm
    combined.forEach((item) => {
      const li = document.createElement("li");
      li.classList.add(getScoreClass(item.colIndex));
      li.innerHTML = `${item.name}<span>${item.score.toFixed(2) / 100}</span>`;
      listContainer.appendChild(li);
    });

    // Tìm 3 mức điểm khác nhau đầu tiên
    const topLevels = [];
    const seenScores = new Set();

    for (let i = 0; i < combined.length && topLevels.length < 3; i++) {
      if (!seenScores.has(combined[i].score)) {
        topLevels.push(combined[i].score);
        seenScores.add(combined[i].score);
      }
    }

    // Hiển thị Top 3
    topLevels.forEach((score, idx) => {
      const sameScorePeople = combined.filter((item) => item.score === score);
      const div = document.createElement("div");
      div.className = `top${idx + 1}`;

      // Thêm ảnh cho mỗi Top
      const img = document.createElement("img");
      img.src = `top${idx + 1}.png`; // ví dụ ảnh nằm trong thư mục 'images/'
      img.alt = `Top ${idx + 1}`;
      img.style.width = "40px"; // bạn có thể chỉnh kích thước theo ý
      img.style.display = "block";
      img.style.margin = "0 auto 5px";
      div.appendChild(img);

      const title = document.createElement("div");
      title.innerHTML = `<strong>${score.toFixed(2) / 100}</strong>`;
      div.appendChild(title);

      sameScorePeople.forEach((person) => {
        const p = document.createElement("div");
        p.textContent = person.name;
        div.appendChild(p);
      });

      topContainer.appendChild(div);
    });
  });
