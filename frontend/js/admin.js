// frontend/js/admin.js

// ── Auth Guard ─────────────────────────────────────────
if (!api.isLoggedIn() || !api.isAdmin()) {
  window.location.href = 'index.html';
}

const adminUser = api.user();

// ── Toast (shared) ─────────────────────────────────────
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
  toast.innerHTML = `<span>${icons[type]||'ℹ'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('toast-exit'); setTimeout(()=>toast.remove(),300); }, 3500);
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Topbar setup ───────────────────────────────────────
document.getElementById('adminNameDisplay').textContent = adminUser?.name || 'Admin';
document.getElementById('adminAvatar').textContent = (adminUser?.name||'A')[0].toUpperCase();
document.getElementById('topbarDate').textContent = new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
document.getElementById('logoutBtn').addEventListener('click', () => { api.clearSession(); window.location.href='index.html'; });

// ── Navigation ─────────────────────────────────────────
let activePanel = 'dashboard';
function setPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`panel-${name}`)?.classList.add('active');
  document.querySelector(`.nav-item[data-panel="${name}"]`)?.classList.add('active');
  document.getElementById('topbarTitle').textContent = name.charAt(0).toUpperCase() + name.slice(1);
  activePanel = name;
}
document.querySelectorAll('.nav-item[data-panel]').forEach(item => {
  item.addEventListener('click', () => setPanel(item.dataset.panel));
});

// ── Confirm Modal ──────────────────────────────────────
let confirmCallback = null;
function showConfirm(message, onConfirm) {
  document.getElementById('confirmMessage').textContent = message;
  document.getElementById('confirmModal').classList.remove('hidden');
  confirmCallback = onConfirm;
}
document.getElementById('confirmYes').addEventListener('click', () => {
  document.getElementById('confirmModal').classList.add('hidden');
  confirmCallback?.();
});
document.getElementById('confirmNo').addEventListener('click', () => {
  document.getElementById('confirmModal').classList.add('hidden');
});

// ── Dashboard stats ────────────────────────────────────
async function loadDashboard() {
  try {
    const [usersRes, reviewsRes, enquiriesRes, imagesRes] = await Promise.allSettled([
      api.getUsers(), api.getReviews(), api.getEnquiries(), api.getImages()
    ]);
    if (usersRes.status==='fulfilled')    document.getElementById('statUsers').textContent    = usersRes.value.users?.length || 0;
    if (reviewsRes.status==='fulfilled')  document.getElementById('statReviews').textContent  = reviewsRes.value.reviews?.length || 0;
    if (enquiriesRes.status==='fulfilled')document.getElementById('statEnquiries').textContent= enquiriesRes.value.enquiries?.length || 0;
    if (imagesRes.status==='fulfilled')   document.getElementById('statImages').textContent   = imagesRes.value.images?.length || 0;
  } catch {}
}

// ── Users panel ────────────────────────────────────────
async function loadUsers() {
  const tbody = document.getElementById('usersBody');
  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--grey3)"><span class="spinner"></span></td></tr>`;
  try {
    const { users } = await api.getUsers();
    if (!users.length) { tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">👤</div><div class="empty-text">No users yet</div></div></td></tr>`; return; }
    tbody.innerHTML = users.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${escapeHtml(u.name)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td><span class="badge badge-${u.role}">${u.role}</span></td>
        <td>${new Date(u.created_at).toLocaleDateString('en-IN')}</td>
        <td>${u.role!=='admin' ? `<button class="action-btn btn-danger" onclick="deleteUser(${u.id},'${escapeHtml(u.name)}')">✕</button>` : '—'}</td>
      </tr>`).join('');
  } catch (err) { showToast(err.message,'error'); }
}
async function deleteUser(id, name) {
  showConfirm(`Delete user "${name}"? This cannot be undone.`, async () => {
    try { await api.deleteUser(id); showToast('User deleted','success'); loadUsers(); loadDashboard(); }
    catch(err){ showToast(err.message,'error'); }
  });
}

// ── Reviews panel ──────────────────────────────────────
async function loadAdminReviews() {
  const tbody = document.getElementById('reviewsBody');
  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;color:var(--grey3)"><span class="spinner"></span></td></tr>`;
  try {
    const { reviews } = await api.getReviews();
    if (!reviews.length) { tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">⭐</div><div class="empty-text">No reviews yet</div></div></td></tr>`; return; }
    tbody.innerHTML = reviews.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${escapeHtml(r.user_name)}</td>
        <td><span class="badge-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span></td>
        <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(r.review)}</td>
        <td>${new Date(r.created_at).toLocaleDateString('en-IN')}</td>
        <td><button class="action-btn btn-danger" onclick="deleteAdminReview(${r.id})">✕</button></td>
      </tr>`).join('');
  } catch (err) { showToast(err.message,'error'); }
}
async function deleteAdminReview(id) {
  showConfirm('Delete this review?', async () => {
    try { await api.deleteReview(id); showToast('Review deleted','success'); loadAdminReviews(); loadDashboard(); }
    catch(err){ showToast(err.message,'error'); }
  });
}

// ── Enquiries panel ────────────────────────────────────
async function loadEnquiries() {
  const tbody = document.getElementById('enquiriesBody');
  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--grey3)"><span class="spinner"></span></td></tr>`;
  try {
    const { enquiries } = await api.getEnquiries();
    if (!enquiries.length) { tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">📩</div><div class="empty-text">No enquiries yet</div></div></td></tr>`; return; }
    tbody.innerHTML = enquiries.map(e => `
      <tr>
        <td>${e.id}</td>
        <td>${escapeHtml(e.name)}</td>
        <td>${escapeHtml(e.email)}</td>
        <td>${escapeHtml(e.phone)||'—'}</td>
        <td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(e.message)}</td>
        <td>${new Date(e.created_at).toLocaleDateString('en-IN')}</td>
        <td><button class="action-btn btn-danger" onclick="deleteEnquiry(${e.id})">✕</button></td>
      </tr>`).join('');
  } catch (err) { showToast(err.message,'error'); }
}
async function deleteEnquiry(id) {
  showConfirm('Delete this enquiry?', async () => {
    try { await api.deleteEnquiry(id); showToast('Enquiry deleted','success'); loadEnquiries(); loadDashboard(); }
    catch(err){ showToast(err.message,'error'); }
  });
}

// ── Images panel ───────────────────────────────────────
async function loadImages() {
  const grid = document.getElementById('imagesGrid');
  grid.innerHTML = `<div style="text-align:center;padding:40px;color:var(--grey3)"><span class="spinner"></span></div>`;
  try {
    const { images } = await api.getImages();
    if (!images.length) { grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🖼</div><div class="empty-text">No images uploaded yet</div></div>`; return; }
    grid.innerHTML = images.map(img => `
      <div class="img-item">
        <img src="http://localhost:5000${img.image_path}" alt="${escapeHtml(img.caption||'Gym Image')}">
        ${img.caption ? `<div class="img-caption">${escapeHtml(img.caption)}</div>` : ''}
        <button class="img-delete" onclick="deleteImage(${img.id})" title="Delete image">✕</button>
      </div>`).join('');
  } catch (err) { showToast(err.message,'error'); }
}
async function deleteImage(id) {
  showConfirm('Delete this image?', async () => {
    try { await api.deleteImage(id); showToast('Image deleted','success'); loadImages(); loadDashboard(); }
    catch(err){ showToast(err.message,'error'); }
  });
}

const uploadZone  = document.getElementById('uploadZone');
const fileInput   = document.getElementById('fileInput');
uploadZone?.addEventListener('click', () => fileInput.click());
uploadZone?.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
uploadZone?.addEventListener('drop', e => {
  e.preventDefault(); uploadZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) handleUpload(file);
});
fileInput?.addEventListener('change', () => { if (fileInput.files[0]) handleUpload(fileInput.files[0]); });

async function handleUpload(file) {
  if (!file.type.startsWith('image/')) return showToast('Only image files allowed','error');
  const caption = document.getElementById('imageCaption').value.trim();
  const fd = new FormData();
  fd.append('image', file);
  fd.append('caption', caption);
  const btn = document.getElementById('uploadBtn');
  btn.innerHTML = '<span class="spinner"></span> Uploading...';
  btn.disabled = true;
  try {
    const res = await api.uploadImage(fd);
    if (!res.success) throw new Error(res.message);
    showToast('Image uploaded!','success');
    document.getElementById('imageCaption').value = '';
    fileInput.value = '';
    loadImages(); loadDashboard();
  } catch(err){ showToast(err.message,'error'); }
  finally { btn.textContent='Upload Image'; btn.disabled=false; }
}

// ── Timings panel ──────────────────────────────────────
const dayOrder = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
let timingsData = [];
async function loadAdminTimings() {
  const wrap = document.getElementById('timingsEditor');
  wrap.innerHTML = `<div style="text-align:center;padding:40px;color:var(--grey3)"><span class="spinner"></span></div>`;
  try {
    const { timings } = await api.getTimings();
    timingsData = timings;
    const todayName = dayOrder[new Date().getDay()===0 ? 6 : new Date().getDay()-1];
    wrap.innerHTML = timings.map(t => {
      const fmt24 = (s) => s ? s.substring(0,5) : '';
      return `<div class="timing-row">
        <div class="timing-day ${t.day===todayName?'today':''}">${t.day}${t.day===todayName?' ★':''}</div>
        <input class="timing-input" type="time" id="open_${t.day}" value="${fmt24(t.open_time)}" ${t.is_closed==1?'disabled':''}>
        <input class="timing-input" type="time" id="close_${t.day}" value="${fmt24(t.close_time)}" ${t.is_closed==1?'disabled':''}>
        <div class="toggle-closed">
          <input type="checkbox" id="closed_${t.day}" ${t.is_closed==1?'checked':''} onchange="toggleClosed('${t.day}',this.checked)">
          <label for="closed_${t.day}">Closed</label>
        </div>
        <button class="btn btn-outline btn-sm" onclick="saveTiming('${t.day}')">Save</button>
      </div>`;
    }).join('');
  } catch(err){ showToast(err.message,'error'); }
}
function toggleClosed(day, closed) {
  document.getElementById(`open_${day}`).disabled  = closed;
  document.getElementById(`close_${day}`).disabled = closed;
}
async function saveTiming(day) {
  try {
    await api.updateTiming(day, {
      open_time:  document.getElementById(`open_${day}`).value  || null,
      close_time: document.getElementById(`close_${day}`).value || null,
      is_closed:  document.getElementById(`closed_${day}`).checked
    });
    showToast(`${day} timing saved!`,'success');
  } catch(err){ showToast(err.message,'error'); }
}

// ── Panel change → reload data ─────────────────────────
document.querySelectorAll('.nav-item[data-panel]').forEach(item => {
  item.addEventListener('click', () => {
    const p = item.dataset.panel;
    if (p==='users')     loadUsers();
    if (p==='reviews')   loadAdminReviews();
    if (p==='enquiries') loadEnquiries();
    if (p==='images')    loadImages();
    if (p==='timings')   loadAdminTimings();
  });
});

// ── Init ───────────────────────────────────────────────
setPanel('dashboard');
loadDashboard();
