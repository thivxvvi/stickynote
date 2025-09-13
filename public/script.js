// public/script.js
document.addEventListener("DOMContentLoaded", () => {
  const messageForm = document.getElementById("messageForm");
  const toInput = document.getElementById("ToInput");
  const messageInput = document.getElementById("messageInput");
  const notesContainer = document.getElementById("notesContainer");

  const MESSAGE_LIMIT = 70; // max characters allowed

  // Fetch existing messages and display them
  async function fetchMessages() {
    const response = await fetch('/messages');
    const messages = await response.json();
    displayMessages(messages);
  }

  // Display messages as sticky notes
  function displayMessages(messages) {
    notesContainer.innerHTML = "";  // Clear previous messages
    messages.forEach(({ to, message }) => {
      const note = document.createElement("div");
      note.className = "note";
      note.innerHTML = `<div class="to">To: ${to}</div><p>${message}</p>`;
      notesContainer.appendChild(note);
    });
  }

  // Handle form submission to post a new message
  messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const to = toInput.value.trim();
    let message = messageInput.value.trim();

    if (message.length > MESSAGE_LIMIT) {
      alert(`Message cannot exceed ${MESSAGE_LIMIT} characters. Currently: ${message.length}`);
      return;
    }

    if (to && message) {
      const response = await fetch('/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message })
      });
      if (response.ok) {
        fetchMessages();  // Refresh messages after posting
        toInput.value = "";
        messageInput.value = "";
      } else {
        alert("Failed to post message.");
      }
    } else {
      alert("Please fill in both fields.");
    }
  });

  // Live character count + limit
  messageInput.addEventListener("input", () => {
    if (messageInput.value.length > MESSAGE_LIMIT) {
      messageInput.value = messageInput.value.substring(0, MESSAGE_LIMIT);
      alert(`Maximum ${MESSAGE_LIMIT} characters allowed.`);
    }
  });

  // Initial fetch of messages
  fetchMessages();

  // Poll for new messages every 10 seconds
  setInterval(fetchMessages, 10000);
});
