/* ==========================================================
   CineVault — js/app.js
   Movie Discovery App — Lê Văn Thành Đạt - 231A010884
   ========================================================== */

/* ---------------------------------------------------------
   DỮ LIỆU PHIM
--------------------------------------------------------- */
const MOVIES = [
  {
    id: 1,
    title: "Sweet Home",
    year: 2020,
    genres: ["Kinh dị", "Hành động"],
    poster: "images/sweet-home.jpg",
    director: "Lee Eung-bok",
    cast: "Song Kang, Lee Jin-wook, Lee Si-young",
    description: "Một chàng trai ẩn dật buộc phải đối mặt với những con quái vật sinh ra từ ham muốn đen tối của con người, khi cả toà chung cư rơi vào đại dịch biến dị kinh hoàng."
  },
  {
    id: 2,
    title: "Be Melodramatic",
    year: 2019,
    genres: ["Tâm lý", "Hài"],
    poster: "images/be-melodramatic.jpg",
    director: "Lee Byeong-heon",
    cast: "Chun Woo-hee, Jeon Yeo-been, Han Ji-eun",
    description: "Ba cô gái trẻ cùng sống chung ở Seoul trải qua tình yêu, sự nghiệp và tình bạn đầy biến động khi bước sang tuổi ba mươi."
  },
  {
    id: 3,
    title: "Hai Phượng",
    year: 2019,
    genres: ["Hành động"],
    poster: "images/hai-phuong.jpg",
    director: "Lê Văn Kiệt",
    cast: "Ngô Thanh Vân, Phan Thanh Nhiên, Mai Cát Vi",
    description: "Một người mẹ đơn thân từng có quá khứ giang hồ phải một mình chiến đấu với đường dây buôn người để cứu con gái bị bắt cóc."
  },
  {
    id: 4,
    title: "Địa Đạo: Mặt Trời Trong Bóng Tối",
    year: 2025,
    genres: ["Chiến tranh", "Lịch sử"],
    poster: "images/dia-dao.jpg",
    director: "Bùi Thạc Chuyên",
    cast: "Thái Hoà, Quang Tuấn, Hồ Thu Anh",
    description: "Câu chuyện về những chiến sĩ du kích sống và chiến đấu trong lòng địa đạo Củ Chi giữa mưa bom bão đạn của chiến tranh."
  },
  {
    id: 5,
    title: "Bố Già",
    year: 2021,
    genres: ["Hài", "Tâm lý"],
    poster: "images/bo-gia.jpg",
    director: "Vũ Ngọc Đãng, Trấn Thành",
    cast: "Trấn Thành, Tuấn Trần, NSND Ngọc Giàu",
    description: "Câu chuyện cảm động, hài hước về tình cha con trong một gia đình lao động nghèo giữa lòng Sài Gòn."
  },
  {
    id: 6,
    title: "The Shawshank Redemption",
    year: 1994,
    genres: ["Chính kịch"],
    poster: "images/shawshank.jpg",
    director: "Frank Darabont",
    cast: "Tim Robbins, Morgan Freeman",
    description: "Hành trình gần hai thập kỷ của một người đàn ông bị kết án oan, âm thầm tìm kiếm hy vọng và tự do sau song sắt nhà tù Shawshank."
  },
  {
    id: 7,
    title: "Mưa Đỏ",
    year: 2025,
    genres: ["Chiến tranh", "Lịch sử"],
    poster: "images/mua-do.jpg",
    director: "Đặng Thái Huyền",
    cast: "Đỗ Nhật Hoàng, Lê Hoàng Long, Trần Gia Huy",
    description: "Khắc hoạ 81 ngày đêm khốc liệt bảo vệ Thành cổ Quảng Trị trong mùa hè đỏ lửa năm 1972."
  },
  {
    id: 8,
    title: "The Godfather",
    year: 1972,
    genres: ["Tội phạm", "Chính kịch"],
    poster: "images/godfather.jpg",
    director: "Francis Ford Coppola",
    cast: "Marlon Brando, Al Pacino, James Caan",
    description: "Câu chuyện về gia tộc mafia Corleone quyền lực bậc nhất nước Mỹ và cuộc chuyển giao quyền lực đầy sóng gió giữa các thế hệ."
  }
];

/* ---------------------------------------------------------
   STATE
--------------------------------------------------------- */
let activeGenres = new Set();
let searchTerm = "";
const RATING_KEY = "cinevault_ratings";
const ratings = JSON.parse(localStorage.getItem(RATING_KEY) || "{}");

/* ---------------------------------------------------------
   ELEMENTS
--------------------------------------------------------- */
const movieGrid   = document.getElementById("movieGrid");
const genreList   = document.getElementById("genreList");
const searchInput = document.getElementById("searchInput");
const resetBtn    = document.getElementById("resetBtn");
const resultCount = document.getElementById("resultCount");
const emptyState  = document.getElementById("emptyState");
const toast       = document.getElementById("toast");

/* ---------------------------------------------------------
   HÀM TIỆN ÍCH
--------------------------------------------------------- */
function debounce(fn, delay = 350) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

function starsHTML(movieId, rating, size = "small") {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star ${i <= rating ? "filled" : ""}" data-value="${i}">★</span>`;
  }
  return html;
}

/* ---------------------------------------------------------
   SINH DANH SÁCH THỂ LOẠI (tự động, không hard-code)
--------------------------------------------------------- */
function renderGenreFilters() {
  const genreSet = new Set();
  MOVIES.forEach(m => m.genres.forEach(g => genreSet.add(g)));

  genreList.innerHTML = "";
  [...genreSet].sort().forEach(genre => {
    const count = MOVIES.filter(m => m.genres.includes(genre)).length;
    const label = document.createElement("label");
    label.className = "genre-item";
    label.innerHTML = `
      <input type="checkbox" value="${genre}">
      <span>${genre}</span>
      <span class="genre-count">${count}</span>
    `;
    const checkbox = label.querySelector("input");
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) activeGenres.add(genre);
      else activeGenres.delete(genre);
      renderMovies();
    });
    genreList.appendChild(label);
  });
}

/* ---------------------------------------------------------
   LỌC PHIM (kết hợp thể loại + tìm kiếm)
--------------------------------------------------------- */
function getFilteredMovies() {
  return MOVIES.filter(movie => {
    const matchGenre = activeGenres.size === 0 ||
      movie.genres.some(g => activeGenres.has(g));
    const matchSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGenre && matchSearch;
  });
}

/* ---------------------------------------------------------
   RENDER DANH SÁCH PHIM
--------------------------------------------------------- */
function renderMovies() {
  const filtered = getFilteredMovies();
  resultCount.textContent = filtered.length;
  emptyState.hidden = filtered.length !== 0;
  movieGrid.innerHTML = "";

  filtered.forEach(movie => {
    const rating = ratings[movie.id] || 0;
    const card = document.createElement("article");
    card.className = "movie-card fade show";
    card.innerHTML = `
      <div class="movie-poster-wrap">
        <img src="${movie.poster}" alt="Poster phim ${movie.title}" loading="lazy">
        <div class="movie-overlay">
          <div class="overlay-actions">
            <button class="btn-view" data-id="${movie.id}">Xem chi tiết</button>
            <button class="btn-rate" data-id="${movie.id}">Đánh giá</button>
          </div>
        </div>
      </div>
      <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <p class="movie-year">${movie.year}</p>
        <div class="movie-genres">
          ${movie.genres.map(g => `<span class="genre-tag">${g}</span>`).join("")}
        </div>
        <div class="card-stars" data-id="${movie.id}">${starsHTML(movie.id, rating)}</div>
      </div>
    `;
    movieGrid.appendChild(card);
  });

  attachCardEvents();
}

/* ---------------------------------------------------------
   SỰ KIỆN TRÊN CARD (xem chi tiết / đánh giá nhanh)
--------------------------------------------------------- */
function attachCardEvents() {
  document.querySelectorAll(".btn-view").forEach(btn => {
    btn.addEventListener("click", () => openModal(Number(btn.dataset.id)));
  });

  document.querySelectorAll(".btn-rate").forEach(btn => {
    btn.addEventListener("click", () => openModal(Number(btn.dataset.id), true));
  });

  document.querySelectorAll(".card-stars").forEach(starWrap => {
    starWrap.querySelectorAll(".star").forEach(star => {
      star.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = Number(starWrap.dataset.id);
        const value = Number(star.dataset.value);
        setRating(id, value);
        renderMovies();
        showToast("Đã lưu đánh giá của bạn!");
      });
    });
  });
}

function setRating(id, value) {
  ratings[id] = value;
  localStorage.setItem(RATING_KEY, JSON.stringify(ratings));
}

/* ---------------------------------------------------------
   MODAL CHI TIẾT PHIM
--------------------------------------------------------- */
const modalOverlay   = document.getElementById("modalOverlay");
const modalClose     = document.getElementById("modalClose");
const modalPoster    = document.getElementById("modalPoster");
const modalTitle     = document.getElementById("modalTitle");
const modalYear      = document.getElementById("modalYear");
const modalGenres    = document.getElementById("modalGenres");
const modalDirector  = document.getElementById("modalDirector");
const modalCast      = document.getElementById("modalCast");
const modalDesc      = document.getElementById("modalDesc");
const modalStars     = document.getElementById("modalStars");

function openModal(id) {
  const movie = MOVIES.find(m => m.id === id);
  if (!movie) return;

  modalPoster.src = movie.poster;
  modalPoster.alt = `Poster phim ${movie.title}`;
  modalTitle.textContent = movie.title;
  modalYear.textContent = movie.year;
  modalDirector.textContent = movie.director;
  modalCast.textContent = movie.cast;
  modalDesc.textContent = movie.description;
  modalGenres.innerHTML = movie.genres.map(g => `<span class="genre-tag">${g}</span>`).join("");

  modalStars.dataset.id = id;
  modalStars.innerHTML = starsHTML(id, ratings[id] || 0);
  modalStars.querySelectorAll(".star").forEach(star => {
    star.addEventListener("click", () => {
      setRating(id, Number(star.dataset.value));
      modalStars.innerHTML = starsHTML(id, ratings[id] || 0);
      renderMovies();
      showToast("Đã lưu đánh giá của bạn!");
    });
  });

  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* ---------------------------------------------------------
   TÌM KIẾM (debounce 350ms)
--------------------------------------------------------- */
const handleSearch = debounce((value) => {
  searchTerm = value.trim();
  renderMovies();
}, 350);

searchInput.addEventListener("input", (e) => handleSearch(e.target.value));

/* ---------------------------------------------------------
   XOÁ BỘ LỌC
--------------------------------------------------------- */
resetBtn.addEventListener("click", () => {
  activeGenres.clear();
  searchTerm = "";
  searchInput.value = "";
  document.querySelectorAll(".genre-item input").forEach(cb => cb.checked = false);
  renderMovies();
});

/* ---------------------------------------------------------
   DARK / LIGHT MODE (lưu vào localStorage)
--------------------------------------------------------- */
const THEME_KEY = "cinevault_theme";
const themeToggle = document.getElementById("themeToggle");
const themeLabel  = document.getElementById("themeLabel");

function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");
  themeLabel.textContent = theme === "dark" ? "Sáng" : "Tối";
}

const savedTheme = localStorage.getItem(THEME_KEY) || "light";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark-mode");
  const newTheme = isDark ? "light" : "dark";
  applyTheme(newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
});

/* ---------------------------------------------------------
   FADE IN ON SCROLL (hero, sidebar...)
--------------------------------------------------------- */
const fadeEls = document.querySelectorAll(".fade");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => io.observe(el));

/* ---------------------------------------------------------
   KHỞI TẠO
--------------------------------------------------------- */
renderGenreFilters();
renderMovies();
// Lấy phần tử thẻ <a> (nút bấm) và thẻ <img> (ảnh) dựa theo ID của bạn
const btnBai35 = document.getElementById('link35');
const imgBai35 = document.getElementById('thumb35');

if (btnBai35 && imgBai35) {
    btnBai35.addEventListener('click', function(e) {
        // Lệnh này giúp chặn hành vi nhảy trang mặc định của thẻ <a> có href="#"
        e.preventDefault(); 
        
        // Bật/tắt class ẩn ảnh
        imgBai35.classList.toggle('hidden-image');
    });
}
