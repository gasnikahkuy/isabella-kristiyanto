//Post wishes
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyD2FZQHsK5rmi6Dom6azwHGXZkiuwwuvcqvslApzpoZ71j4QE6QEWvj69C3GxigOIL/exec'; // Replace with actual URL
          
// Format ISO timestamp to a more readable format
function formatTimestamp(timestamp) {
  // Check if timestamp is already in a readable format
  if (typeof timestamp === 'string' && timestamp.includes('/')) {
    return timestamp;
  }
  
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return timestamp; // Return original if parsing fails
    }
    
    const options = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric',
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric',
      hour12: true
    };
    
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    console.error("Error formatting timestamp:", e);
    return timestamp;
  }
}

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

async function postMessage() {
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  if (!name || !message) return alert("Please fill both fields!");
  
  try {
    const response = await fetch(SHEET_URL, {
      method: 'POST',
      body: new URLSearchParams({ name, message })
    });
    
    if (response.ok) {
      document.getElementById('name').value = '';
      document.getElementById('message').value = '';
      loadMessages();
    } else {
      alert("Error submitting your message. Please try again.");
    }
  } catch (error) {
    console.error("Error posting message:", error);
    alert("Error submitting your message. Please try again.");
  }
}

window.onload = loadMessages;