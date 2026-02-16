const API = "https://users-service-dev.apps-crc.testing";

const output = document.getElementById("output");
const currentUserDiv = document.getElementById("currentUser");
const roleBadge = document.getElementById("roleBadge");

const toastEl = document.getElementById("toast");
const toastBody = document.getElementById("toastBody");
const toast = new bootstrap.Toast(toastEl);

function showToast(msg, type = "primary") {
  toastEl.className = "toast text-bg-" + type + " border-0";
  toastBody.textContent = msg;
  toast.show();
}

function setOutput(data) {
  output.textContent = JSON.stringify(data, null, 2);
}

function updateSessionUI(user, token) {
  if (!user || !token) {
    currentUserDiv.innerHTML = "Not logged in.";
    roleBadge.textContent = "role: n/a";
    document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");
    return;
  }

  currentUserDiv.innerHTML = `
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Role:</strong> ${user.role}</p>
    <p><strong>ID:</strong> ${user.id}</p>
  `;

  roleBadge.textContent = "role: " + user.role;

  if (user.role === "admin") {
    document.querySelectorAll(".admin-only").forEach(el => el.style.display = "block");
  }
}

function loadSession() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  updateSessionUI(user, token);
}

async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = options.headers || {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(url, { ...options, headers });
}

/* SIGNUP */
document.getElementById("signupForm").addEventListener("submit", async e => {
  e.preventDefault();
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();

  const res = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  setOutput(data);

  showToast(res.ok ? "Signup successful" : data.message, res.ok ? "success" : "danger");
});

/* LOGIN */
document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  setOutput(data);

  if (res.ok && data.accessToken) {
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    updateSessionUI(data.user, data.accessToken);
    showToast("Login successful", "success");
  } else {
    showToast(data.message || "Login failed", "danger");
  }
});

/* GET USERS */
document.getElementById("getUsersBtn").addEventListener("click", async () => {
  const res = await authFetch(`${API}/users`);
  const data = await res.json();
  setOutput(data);

  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";

  if (Array.isArray(data)) {
    data.forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>${u.full_name || ""}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  showToast(res.ok ? "Users loaded" : "Failed to load users", res.ok ? "info" : "danger");
});

/* UPDATE USER */
document.getElementById("updateBtn").addEventListener("click", async () => {
  const id = updateId.value.trim();
  const email = updateEmail.value.trim();
  const password = updatePassword.value.trim();

  const payload = {};
  if (email) payload.email = email;
  if (password) payload.password = password;

  if (!id) return showToast("User ID required", "warning");
  if (!Object.keys(payload).length) return showToast("Nothing to update", "warning");

  const res = await authFetch(`${API}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  setOutput(data);

  showToast(res.ok ? "User updated" : data.message, res.ok ? "success" : "danger");
});

/* DELETE USER */
document.getElementById("deleteForm").addEventListener("submit", async e => {
  e.preventDefault();
  const id = deleteId.value.trim();
  if (!id) return showToast("User ID required", "warning");

  const res = await authFetch(`${API}/users/${id}`, { method: "DELETE" });
  const data = await res.json();
  setOutput(data);

  showToast(res.ok ? "User deleted" : data.message, res.ok ? "success" : "danger");
});

/* INIT */
loadSession();
