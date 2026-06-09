// frontend/js/main.js

// ── Toast ──────────────────────────────────────────────
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('toast-exit'); setTimeout(() => toast.remove(), 300); }, 3500);
}

// ── Navbar ─────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 20);
});
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu?.classList.toggle('open');
});

// ── Smooth-scroll nav links ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
    }
  });
});

// ── Active nav highlight ───────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === `#${current}`); });
});

// ── Auth state ─────────────────────────────────────────
function updateNavAuth() {
  const loginBtn  = document.getElementById('navLoginBtn');
  const signupBtn = document.getElementById('navSignupBtn');
  const userMenu  = document.getElementById('navUserMenu');
  const userName  = document.getElementById('navUserName');
  const adminLink = document.getElementById('navAdminLink');

  if (!api.isLoggedIn()) {
    loginBtn?.classList.remove('hidden');
    signupBtn?.classList.remove('hidden');
    userMenu?.classList.add('hidden');
    return;
  }
  loginBtn?.classList.add('hidden');
  signupBtn?.classList.add('hidden');
  userMenu?.classList.remove('hidden');
  const u = api.user();
  if (userName) userName.textContent = u?.name?.split(' ')[0] || 'User';
  if (adminLink) adminLink.classList.toggle('hidden', !api.isAdmin());
}

document.getElementById('navLogoutBtn')?.addEventListener('click', () => {
  api.clearSession();
  updateNavAuth();
  showToast('Logged out successfully', 'info');
});

// ── Auth Modal ─────────────────────────────────────────
let authMode = 'login';
let authRole = 'user';
const modalOverlay = document.getElementById('authModal');

function openAuthModal(mode = 'login', role = 'user') {
  authMode = mode;
  authRole = role;
  document.getElementById('loginForm')?.classList.toggle('hidden', mode !== 'login');
  document.getElementById('registerForm')?.classList.toggle('hidden', mode !== 'register');
  document.getElementById('modalTitle').textContent = mode === 'login' ? (role === 'admin' ? 'Admin Login' : 'Welcome Back') : 'Join Now';
  document.getElementById('modalSub').textContent   = mode === 'login' ? (role === 'admin' ? 'Sign in as administrator' : 'Sign in to your account') : 'Create your free account';
  modalOverlay?.classList.remove('hidden');
}

document.getElementById('navLoginBtn')?.addEventListener('click', () => openAuthModal('login', 'user'));
document.getElementById('navAdminLoginBtn')?.addEventListener('click', () => openAuthModal('login', 'admin'));


function closeAuthModal() { modalOverlay?.classList.add('hidden'); }

document.getElementById('navLoginBtn')?.addEventListener('click', () => openAuthModal('login'));
document.getElementById('navSignupBtn')?.addEventListener('click', () => openAuthModal('register'));
document.querySelector('#authModal .modal-close')?.addEventListener('click', closeAuthModal);
modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeAuthModal(); });
document.getElementById('switchToRegister')?.addEventListener('click', e => { e.preventDefault(); openAuthModal('register'); });
document.getElementById('switchToLogin')?.addEventListener('click', e => { e.preventDefault(); openAuthModal('login'); });
document.getElementById('heroJoinBtn')?.addEventListener('click', () => openAuthModal('register'));

// Login form submit
document.getElementById('loginFormEl')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('[type=submit]');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  try {
    const data = await api.login({
      email:    document.getElementById('loginEmail').value.trim(),
      password: document.getElementById('loginPassword').value
    });
    if (authRole === 'admin' && data.user.role !== 'admin') {
      throw new Error('Admin login required (credentials must be for an admin account)');
    }
    api.saveSession(data.token, data.user);
    closeAuthModal();
    updateNavAuth();
    showToast(`Welcome back, ${data.user.name}!`, 'success');
    if (data.user.role === 'admin') {
      setTimeout(() => window.location.href = 'admin.html', 700);
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.textContent = 'Sign In';
    btn.disabled = false;
  }
});

// Register form submit
document.getElementById('registerFormEl')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('[type=submit]');
  const pw  = document.getElementById('regPassword').value;
  const cpw = document.getElementById('regConfirm').value;
  if (pw !== cpw) return showToast('Passwords do not match', 'error');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  try {
    const data = await api.register({
      name:     document.getElementById('regName').value.trim(),
      email:    document.getElementById('regEmail').value.trim(),
      password: pw
    });
    api.saveSession(data.token, data.user);
    closeAuthModal();
    updateNavAuth();
    showToast('Account created successfully!', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.textContent = 'Create Account';
    btn.disabled = false;
  }
});

// ── Gallery ────────────────────────────────────────────
async function loadGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  try {
    const { images } = await api.getImages();
    if (!images.length) { renderDefaultGallery(grid); return; }
    grid.innerHTML = images.map(img => `
      <div class="gallery-item">
        <img src="http://localhost:5000${img.image_path}" alt="${img.caption || 'Gym'}" loading="lazy">
        <div class="gallery-overlay"><span class="gallery-caption">${img.caption || 'Gym'}</span></div>
      </div>`).join('');
  } catch { renderDefaultGallery(grid); }
}

function renderDefaultGallery(grid) {
  const placeholders = [
    { label: 'Weight Room', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop' },
    { label: 'Cardio Zone', img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&auto=format&fit=crop' },
    { label: 'Boxing Ring',  img: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&auto=format&fit=crop' },
    { label: 'Yoga Studio',  img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop' },
    { label: 'Free Weights', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop' },
    { label: 'Group Class',  img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&auto=format&fit=crop' },
  ];
  grid.innerHTML = placeholders.map(p => `
    <div class="gallery-item">
      <img src="${p.img}" alt="${p.label}" loading="lazy">
      <div class="gallery-overlay"><span class="gallery-caption">${p.label}</span></div>
    </div>`).join('');
}

// ── Timings ────────────────────────────────────────────
async function loadTimings() {
  const tbody  = document.getElementById('timingsBody');
  const status = document.getElementById('gymStatus');
  if (!tbody) return;
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const now  = new Date();
  const todayName = days[now.getDay() === 0 ? 6 : now.getDay() - 1];
  let timings;
  try {
    const res = await api.getTimings();
    timings = res.timings;
  } catch {
    timings = days.map(d => ({ day: d, open_time: d === 'Sunday' ? null : '06:00:00', close_time: d === 'Sunday' ? null : '22:00:00', is_closed: d === 'Sunday' ? 1 : 0 }));
  }
  tbody.innerHTML = timings.map(t => {
    const isToday  = t.day === todayName;
    const isClosed = t.is_closed == 1;
    const fmt = (s) => { if (!s) return ''; const [h,m] = s.split(':'); const hr = +h; return `${hr > 12 ? hr-12 : hr || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`; };
    return `<tr class="${isToday ? 'today' : ''} ${isClosed ? 'closed-row' : ''}">
      <td>${t.day}${isToday ? '<span class="today-badge">Today</span>' : ''}</td>
      <td>${isClosed ? '—' : fmt(t.open_time)}</td>
      <td>${isClosed ? '<span style="color:var(--grey2)">Closed</span>' : fmt(t.close_time)}</td>
    </tr>`;
  }).join('');

  // Status box
  const todayTiming = timings.find(t => t.day === todayName);
  if (status && todayTiming) {
    const isClosed = todayTiming.is_closed == 1;
    if (isClosed) {
      status.querySelector('.status-dot').className   = 'status-dot closed';
      status.querySelector('.status-text').className  = 'status-text closed';
      status.querySelector('.status-text').textContent = 'Closed Today';
      status.querySelector('.status-detail').textContent = 'See you tomorrow!';
    } else {
      const [ch, cm] = (todayTiming.close_time || '22:00:00').split(':');
      const closeHr = +ch;
      const closeAMPM = `${closeHr > 12 ? closeHr - 12 : closeHr}:${cm} ${closeHr >= 12 ? 'PM' : 'AM'}`;
      const nowMins = now.getHours() * 60 + now.getMinutes();
      const closeMins = closeHr * 60 + +cm;
      const isOpen = nowMins < closeMins;
      status.querySelector('.status-dot').className   = `status-dot ${isOpen ? 'open' : 'closed'}`;
      status.querySelector('.status-text').className  = `status-text ${isOpen ? 'open' : 'closed'}`;
      status.querySelector('.status-text').textContent = isOpen ? `Open Now` : 'Closed Now';
      status.querySelector('.status-detail').textContent = isOpen ? `Open until ${closeAMPM}` : 'Opens tomorrow at 6:00 AM';
    }
  }
}

// ── Reviews ────────────────────────────────────────────
let selectedRating = 0;

async function loadReviews() {
  const grid    = document.getElementById('reviewsGrid');
  const avgNum  = document.getElementById('avgRating');
  const total   = document.getElementById('totalReviews');
  const starsEl = document.getElementById('avgStars');
  if (!grid) return;
  try {
    const { reviews, stats } = await api.getReviews();
    if (avgNum) avgNum.textContent = stats.average;
    if (total)  total.textContent  = `${stats.total} Reviews`;
    if (starsEl) starsEl.innerHTML = renderStarsHTML(parseFloat(stats.average));
    if (!reviews.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">⭐</div><div class="empty-text">No reviews yet — be the first!</div></div>`;
      return;
    }
    grid.innerHTML = reviews.map(r => `
      <div class="review-card">
        ${api.isAdmin() ? `<button class="review-delete-btn" onclick="deleteReview(${r.id})" title="Delete">✕</button>` : ''}
        <div class="review-header">
          <span class="reviewer-name">${escapeHtml(r.user_name)}</span>
          <span class="review-date">${new Date(r.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
        </div>
        <div class="review-stars">${renderStarsHTML(r.rating)}</div>
        <div class="review-text">${escapeHtml(r.review)}</div>
      </div>`).join('');
  } catch (err) {
    grid.innerHTML = `<p style="color:var(--grey3);font-family:var(--font-sub)">Could not load reviews.</p>`;
  }
}

function renderStarsHTML(rating) {
  return Array.from({length:5}, (_,i) => `<span class="star-icon ${i < Math.round(rating) ? '' : 'empty'}">★</span>`).join('');
}

// Star picker
document.querySelectorAll('.star-btn').forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    selectedRating = idx + 1;
    document.querySelectorAll('.star-btn').forEach((b, i) => b.classList.toggle('active', i < selectedRating));
  });
});

document.getElementById('reviewFormEl')?.addEventListener('submit', async e => {
  e.preventDefault();
  if (!api.isLoggedIn()) return openAuthModal('login');
  if (!selectedRating) return showToast('Please select a rating', 'error');
  const btn = e.target.querySelector('[type=submit]');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  try {
    await api.createReview({ rating: selectedRating, review: document.getElementById('reviewText').value.trim() });
    showToast('Review submitted!', 'success');
    document.getElementById('reviewText').value = '';
    selectedRating = 0;
    document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
    loadReviews();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.textContent = 'Submit Review';
    btn.disabled = false;
  }
});

async function deleteReview(id) {
  if (!confirm('Delete this review?')) return;
  try { await api.deleteReview(id); showToast('Review deleted', 'success'); loadReviews(); }
  catch (err) { showToast(err.message, 'error'); }
}

// ── Enquiry Form ───────────────────────────────────────
document.getElementById('enquiryFormEl')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('[type=submit]');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  try {
    await api.submitEnquiry({
      name:    document.getElementById('enqName').value.trim(),
      email:   document.getElementById('enqEmail').value.trim(),
      phone:   document.getElementById('enqPhone').value.trim(),
      message: document.getElementById('enqMessage').value.trim()
    });
    showToast('Enquiry sent! We\'ll contact you soon.', 'success');
    e.target.reset();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.textContent = 'Send Enquiry';
    btn.disabled = false;
  }
});

// ── ML / Fitness Advisor ───────────────────────────────
async function loadFitnessGoals() {
  const sel = document.getElementById('fitnessGoal');
  if (!sel) return;
  try {
    const { goals } = await api.getFitnessGoals();
    if (goals && goals.length > 0) {
      sel.innerHTML = `<option value="">Select goal</option>` + goals.map(g => `<option value="${g}">${g}</option>`).join('');
    }
  } catch (err) {
    console.error('Error loading fitness goals:', err);
    sel.innerHTML = `<option value="">Select goal</option><option value="Weight Gain">Weight Gain</option><option value="Weight Loss">Weight Loss</option><option value="Endurance">Endurance</option><option value="General Fitness">General Fitness</option>`;
  }
}

document.getElementById('mlFormEl')?.addEventListener('submit', async e => {
  e.preventDefault();
  if (!api.isLoggedIn()) return openAuthModal('login');
  const btn    = e.target.querySelector('[type=submit]');
  const result = document.getElementById('mlResult');
  btn.innerHTML = '<span class="spinner"></span> Analysing...';
  btn.disabled  = true;
  try {
    const body = {
      weight:       parseFloat(document.getElementById('mlWeight').value),
      height:       parseFloat(document.getElementById('mlHeight').value) / 100,
      age:          parseInt(document.getElementById('mlAge').value),
      sex:          document.getElementById('mlSex').value,
      fitness_goal: document.getElementById('fitnessGoal').value,
      hypertension: document.getElementById('mlHypertension').checked,
      diabetes:     document.getElementById('mlDiabetes').checked
    };
    const data = await api.getRecommend(body);
    result.innerHTML = `
      <div class="bmi-display">
        <div><div class="bmi-num">${data.bmi}</div><div class="bmi-category">${data.bmi_category}</div></div>
        <div style="flex:1;font-size:.85rem;color:var(--grey3);font-family:var(--font-sub);line-height:1.5">BMI Score<br><small>Healthy range: 18.5 – 24.9</small></div>
      </div>
      <div class="result-section"><div class="result-label">🏋️ Exercises</div><div class="result-text">${escapeHtml(data.exercises)}</div></div>
      <div class="result-section"><div class="result-label">🥗 Diet Plan</div><div class="result-text">${escapeHtml(data.diet?.substring(0,200))}${data.diet?.length > 200 ? '...' : ''}</div></div>
      <div class="result-section"><div class="result-label">🛠 Equipment</div><div class="result-text">${escapeHtml(data.equipment)}</div></div>
      <div class="result-section"><div class="result-label">💡 Recommendation</div><div class="result-text">${escapeHtml(data.recommendation?.substring(0,250))}${data.recommendation?.length > 250 ? '...' : ''}</div></div>`;
  } catch (err) {
    result.innerHTML = `<div class="ml-placeholder"><div class="icon">⚠️</div><p>ML service unavailable.<br>Make sure Flask is running on port 5001.</p></div>`;
  } finally {
    btn.textContent = 'Get My Plan';
    btn.disabled = false;
  }
});

// ── Helpers ────────────────────────────────────────────
function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Init ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateNavAuth();
  loadGallery();
  loadTimings();
  loadReviews();
  loadFitnessGoals();
});
