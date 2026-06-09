// frontend/js/api.js — Centralised API client
const API_BASE = 'http://localhost:5000/api';
const ML_BASE  = 'http://localhost:5001/api';

const api = {
  token: () => localStorage.getItem('gym_token'),
  user:  () => { try { return JSON.parse(localStorage.getItem('gym_user')); } catch { return null; } },

  headers(extra = {}) {
    const h = { 'Content-Type': 'application/json', ...extra };
    const t = this.token();
    if (t) h['Authorization'] = `Bearer ${t}`;
    return h;
  },

  async request(url, options = {}) {
    try {
      const res = await fetch(url, { headers: this.headers(), ...options });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      return data;
    } catch (err) {
      throw err;
    }
  },

  // Auth
  register: (body) => api.request(`${API_BASE}/auth/register`, { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => api.request(`${API_BASE}/auth/login`,    { method: 'POST', body: JSON.stringify(body) }),
  getMe:    ()     => api.request(`${API_BASE}/auth/me`),

  // Reviews
  getReviews:    ()     => api.request(`${API_BASE}/reviews`),
  createReview:  (body) => api.request(`${API_BASE}/reviews`, { method: 'POST', body: JSON.stringify(body) }),
  deleteReview:  (id)   => api.request(`${API_BASE}/reviews/${id}`, { method: 'DELETE' }),

  // Enquiries
  submitEnquiry:  (body) => api.request(`${API_BASE}/enquiries`, { method: 'POST', body: JSON.stringify(body) }),
  getEnquiries:   ()     => api.request(`${API_BASE}/enquiries`),
  deleteEnquiry:  (id)   => api.request(`${API_BASE}/enquiries/${id}`, { method: 'DELETE' }),

  // Images
  getImages: ()          => api.request(`${API_BASE}/images`),
  uploadImage: (formData) => {
    const headers = {};
    const t = api.token();
    if (t) headers['Authorization'] = `Bearer ${t}`;
    return fetch(`${API_BASE}/images`, { method: 'POST', headers, body: formData }).then(r => r.json());
  },
  deleteImage: (id)      => api.request(`${API_BASE}/images/${id}`, { method: 'DELETE' }),

  // Timings
  getTimings:    ()          => api.request(`${API_BASE}/timings`),
  updateTiming:  (day, body) => api.request(`${API_BASE}/timings/${day}`, { method: 'PUT', body: JSON.stringify(body) }),

  // Admin
  getUsers:    ()   => api.request(`${API_BASE}/admin/users`),
  deleteUser:  (id) => api.request(`${API_BASE}/admin/users/${id}`, { method: 'DELETE' }),

  // ML
  getBMI:       (body) => api.request(`${ML_BASE}/bmi`,      { method: 'POST', body: JSON.stringify(body) }),
  getRecommend: (body) => api.request(`${ML_BASE}/recommend`, { method: 'POST', body: JSON.stringify(body) }),
  getFitnessGoals: ()  => api.request(`${ML_BASE}/fitness-goals`),

  // Auth helpers
  saveSession(token, user) { localStorage.setItem('gym_token', token); localStorage.setItem('gym_user', JSON.stringify(user)); },
  clearSession()           { localStorage.removeItem('gym_token'); localStorage.removeItem('gym_user'); },
  isLoggedIn()             { return !!this.token(); },
  isAdmin()                { const u = this.user(); return u && u.role === 'admin'; }
};
