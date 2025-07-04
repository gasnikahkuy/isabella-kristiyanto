//Post wishes
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyD2FZQHsK5rmi6Dom6azwHGXZkiuwwuvcqvslApzpoZ71j4QE6QEWvj69C3GxigOIL/exec';

// Format timestamp
function formatTimestamp(timestamp) {
  if (typeof timestamp === 'string' && timestamp.includes('/')) return timestamp;
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: true
    });
  } catch (e) {
    console.error("Error formatting timestamp:", e);
    return timestamp;
  }
}

// ✅ Don't remove this
async function loadMessages() {
  try {
    const res = await fetch(SHEET_URL);
    const data = await res.json();
    const container = document.getElementById('messages');
    container.innerHTML = '';
    data.reverse().forEach(entry => {
      container.innerHTML += `
        <div class="message-box">
          <div class="name">${entry.name} <span class="time">${formatTimestamp(entry.timestamp)}</span></div>
          <div>${entry.message}</div>
        </div>`;
    });
  } catch (error) {
    console.error("Error loading messages:", error);
  }
}

// ✅ This is your modified function with RSVP
async function postMessage() {
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  const rsvp = document.querySelector('input[name="rsvp"]:checked')?.value;

  if (!name || !message || !rsvp) {
    return alert("Please fill all fields and confirm your attendance.");
  }

  try {
    const response = await fetch(SHEET_URL, {
      method: 'POST',
      body: new URLSearchParams({ name, message, rsvp })
    });

    if (response.ok) {
      document.getElementById('name').value = '';
      document.getElementById('message').value = '';
      document.querySelectorAll('input[name="rsvp"]').forEach(el => el.checked = false);
      loadMessages(); // ✅ This line is calling the function above
    } else {
      alert("Error submitting your message. Please try again.");
    }
  } catch (error) {
    console.error("Error posting message:", error);
    alert("Error submitting your message. Please try again.");
  }
}

window.onload = loadMessages;

// Auto-fill the name field from URL ?to=Name
window.onload = () => {
  loadMessages();

  const params = new URLSearchParams(window.location.search);
  const guestName = params.get('to');
  if (guestName) {
    document.getElementById('name').value = decodeURIComponent(guestName.replace(/\+/g, ' '));
  }
};