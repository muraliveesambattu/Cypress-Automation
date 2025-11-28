const API_URL = "/users"; // relative URL (served from same host)

// Load users on page load
window.onload = function () {
  fetchUsers();
};

function fetchUsers() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((users) => {
      const container = document.getElementById("users");
      container.innerHTML = "";

      users.forEach((user) => {
        const div = document.createElement("div");
        div.className = "user-card";
        div.innerHTML = `
          <p><strong>${user.name}</strong> (${user.email})</p>
          <button onclick="deleteUser(${user.id})">Delete</button>
        `;
        container.appendChild(div);
      });
    });
}

function createUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) {
    alert("Please enter name and email");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  })
    .then((res) => res.json())
    .then(() => {
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";

      fetchUsers();
    });
}

function deleteUser(id) {
  fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  }).then(() => fetchUsers());
}
