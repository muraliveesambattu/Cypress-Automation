const API_BASE_URL = "/api/items";

// DOM Elements
const itemForm = document.getElementById("item-form");
const itemIdInput = document.getElementById("item-id");
const itemNameInput = document.getElementById("item-name");
const itemDescriptionInput = document.getElementById("item-description");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formTitle = document.getElementById("form-title");
const itemsContainer = document.getElementById("items-container");
const loadingDiv = document.getElementById("loading");
const noItemsDiv = document.getElementById("no-items");

let editingItemId = null;

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  loadItems();
  setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
  itemForm.addEventListener("submit", handleFormSubmit);
  cancelBtn.addEventListener("click", resetForm);
}

// Load all items
async function loadItems() {
  try {
    loadingDiv.style.display = "block";
    itemsContainer.innerHTML = "";
    noItemsDiv.style.display = "none";

    const response = await fetch(API_BASE_URL);
    const result = await response.json();

    if (result.success) {
      if (result.data.length === 0) {
        loadingDiv.style.display = "none";
        noItemsDiv.style.display = "block";
      } else {
        displayItems(result.data);
      }
    } else {
      showError("Failed to load items: " + result.error);
    }
  } catch (error) {
    showError("Error loading items: " + error.message);
  } finally {
    loadingDiv.style.display = "none";
  }
}

// Display items
function displayItems(items) {
  itemsContainer.innerHTML = "";
  items.forEach((item) => {
    console.log(item, "item");
    const itemCard = createItemCard(item);
    itemsContainer.appendChild(itemCard);
  });
}

// Create item card element
function createItemCard(item) {
  const card = document.createElement("div");
  card.className = "item-card";
  card.setAttribute("data-id", item.id);

  const createdDate = new Date(item.created_at).toLocaleString();
  const updatedDate = new Date(item.updated_at).toLocaleString();

  card.innerHTML = `
        <div class="item-header">
            <div>
                <div class="item-name">${escapeHtml(item.name)}</div>
            </div>
        </div>
        ${
          item.description
            ? `<div class="item-description">${escapeHtml(
                item.description
              )}</div>`
            : ""
        }
        <div class="item-meta">
            Created: ${createdDate}<br>
            Updated: ${updatedDate}
        </div>
        <div class="item-actions">
            <button class="btn-edit" onclick="editItem(${
              item.id
            })">Edit</button>
            <button class="btn-delete" onclick="deleteItem(${
              item.id
            })">Delete</button>
        </div>
    `;

  return card;
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();

  const name = itemNameInput.value.trim();
  const description = itemDescriptionInput.value.trim();

  if (!name) {
    showError("Name is required");
    return;
  }

  try {
    if (editingItemId) {
      // Update existing item
      await updateItem(editingItemId, name, description);
      showSuccess("Item updated successfully!");
    } else {
      // Create new item
      await createItem(name, description);
      showSuccess("Item created successfully!");
    }

    resetForm();
    loadItems();
  } catch (error) {
    showError("Error: " + error.message);
  }
}

// Create item
async function createItem(name, description) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description }),
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

// Update item
async function updateItem(id, name, description) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description }),
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

// Edit item
async function editItem(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const result = await response.json();

    if (result.success) {
      const item = result.data;
      editingItemId = item.id;
      itemIdInput.value = item.id;
      itemNameInput.value = item.name;
      itemDescriptionInput.value = item.description || "";
      formTitle.textContent = "Edit Item";
      submitBtn.textContent = "Update Item";
      cancelBtn.style.display = "inline-block";

      // Scroll to form
      document
        .querySelector(".form-section")
        .scrollIntoView({ behavior: "smooth" });
    } else {
      showError("Failed to load item: " + result.error);
    }
  } catch (error) {
    showError("Error loading item: " + error.message);
  }
}

// Delete item
async function deleteItem(id) {
  if (!confirm("Are you sure you want to delete this item?")) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.success) {
      showSuccess("Item deleted successfully!");
      loadItems();
    } else {
      showError("Failed to delete item: " + result.error);
    }
  } catch (error) {
    showError("Error deleting item: " + error.message);
  }
}

// Reset form
function resetForm() {
  editingItemId = null;
  itemIdInput.value = "";
  itemForm.reset();
  formTitle.textContent = "Create New Item";
  submitBtn.textContent = "Create Item";
  cancelBtn.style.display = "none";
}

// Show success message
function showSuccess(message) {
  showMessage(message, "success");
}

// Show error message
function showError(message) {
  showMessage(message, "error");
}

// Show message
function showMessage(message, type) {
  // Remove existing message if any
  const existingMessage = document.querySelector(".message");
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;

  const formSection = document.querySelector(".form-section");
  formSection.insertBefore(messageDiv, formSection.firstChild);

  // Auto-hide after 3 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Make functions globally available for onclick handlers
window.editItem = editItem;
window.deleteItem = deleteItem;
