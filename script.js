// ---------------------------------------------
// ProductGrader data (sample dataset)
// Replace/expand this with real products later.
// ---------------------------------------------
const PRODUCTS = [
  { name: "iPhone 14", grade: "A", reason: "Long OS support, good reliability, decent repair network." },
  { name: "iPhone 15", grade: "A-", reason: "Great camera; price/performance slightly lower than 14 at current street price." },
  { name: "Galaxy S23", grade: "A-", reason: "Strong features, good longevity. Slightly higher cost of ownership." },
  { name: "Galaxy A55", grade: "B+", reason: "Great value; midrange performance; plastic frame but good battery life." },
  { name: "ThinkPad X1 Carbon Gen 10", grade: "A", reason: "Excellent keyboard, serviceability, and durability." },
  { name: "MacBook Air M2 13\"", grade: "A", reason: "Top efficiency, great resale value; limited ports." },
  { name: "Toyota Tacoma 2007", grade: "B", reason: "Reliable powertrain; watch for frame rust and mpg." },
  { name: "Toyota Tacoma 2016", grade: "B+", reason: "Very reliable; ride quality ok; resale is excellent but prices run high." }
];

// Map a letter grade to your CSS class names
function gradeToClass(g) {
  const up = g.toUpperCase();
  if (up === "A+") return "grade-a-plus";
  if (up.startsWith("A")) return "grade-a";
  if (up.startsWith("B")) return "grade-b";
  if (up.startsWith("C")) return "grade-c";
  if (up.startsWith("D")) return "grade-d";
  return "grade-f";
}

// ---------------------------------------------
// Home page logic (index.html)
// ---------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const searchBox = document.getElementById("searchBox");
  const aboutBtn  = document.getElementById("aboutBtn");

  // --- Search button click -> go to results.html with query
  if (searchBtn && searchBox) {
    searchBtn.addEventListener("click", () => {
      const query = (searchBox.value || "").trim();
      if (query) {
        window.location.href = `results.html?search=${encodeURIComponent(query)}`;
      } else {
        alert("Please type something first!");
      }
    });

    // --- Enter key inside the search input
    searchBox.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        const query = (searchBox.value || "").trim();
        if (query) {
          window.location.href = `results.html?search=${encodeURIComponent(query)}`;
        } else {
          alert("Please type something first!");
        }
      }
    });
  }

  // --- About button popup
if (aboutBtn) {
  aboutBtn.addEventListener("click", () => {
    alert(`Welcome to ProductGrader! 
This tool will soon let users paste an Amazon product link to instantly see if it’s a good deal — graded from A+ to F− based on value, reliability, and long-term worth.

Note: This prototype currently supports iPhone models only while the full system is being developed.`);
  });
}

  // -------------------------------------------
  // Results page logic (results.html)
  // -------------------------------------------
  const resultsRoot = document.getElementById("resultsApp");
  if (resultsRoot) {
    const params = new URLSearchParams(window.location.search);
    const query = (params.get("search") || "").trim();

    const title = document.getElementById("resultsTitle");
    if (title) {
      title.textContent = query ? `Results for “${query}”` : "Results";
    }

    const listEl = document.getElementById("resultsList");
    if (!listEl) return;

    if (!query) {
      listEl.innerHTML = `<p class="empty">No search term. Try going back and typing a product name.</p>`;
      return;
    }

    // Basic filter: case-insensitive substring match
    const q = query.toLowerCase();
    const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(q));

    if (matches.length) {
      listEl.innerHTML = matches.map(p => {
        const gradeClass = gradeToClass(p.grade);
        return `
          <div class="result-item">
            <div class="grade-box ${gradeClass}">${p.grade}</div>
            <div class="result-details">
              <h3>${p.name}</h3>
              <p>${p.reason}</p>
            </div>
          </div>
        `;
      }).join("");
    } else {
      // No direct matches: show empty state + suggestions
      const suggestions = PRODUCTS.slice(0, 5).map(p => `
        <div class="result-item">
          <div class="grade-box ${gradeToClass(p.grade)}">${p.grade}</div>
          <div class="result-details">
            <h3>${p.name}</h3>
            <p>${p.reason}</p>
          </div>
        </div>
      `).join("");

      listEl.innerHTML = `
        <p class="empty">No exact matches for “${escapeHtml(query)}”. Try a shorter name (e.g., “Tacoma” or “iPhone”).</p>
        <div class="section-label">Popular items</div>
        ${suggestions}
      `;
    }
  }
}); // ✅ closes the DOMContentLoaded listener properly

// Small helper so user input doesn’t inject HTML
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
