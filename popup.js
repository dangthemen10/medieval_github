// State management
let isEnabled = false;

// DOM elements
let toggleSwitch;
let statusText;

// Load saved state from chrome storage
function loadState() {
  chrome.storage.sync.get(['medievalEnabled'], function (result) {
    isEnabled = result.medievalEnabled || false;
    updateUI();
  });
}

// Save state to chrome storage
function saveState() {
  chrome.storage.sync.set({ medievalEnabled: isEnabled });
}

// Update UI based on current state
function updateUI() {
  if (isEnabled) {
    toggleSwitch.classList.add('active');
    statusText.classList.add('active');
    statusText.classList.remove('inactive');
    statusText.textContent = '⚔️ Medieval mode is active! ⚔️';
  } else {
    toggleSwitch.classList.remove('active');
    statusText.classList.remove('active');
    statusText.classList.add('inactive');
    statusText.textContent = '🏰 Medieval mode is disabled';
  }
}

// Toggle functionality
function toggleMedieval() {
  isEnabled = !isEnabled;
  updateUI();
  saveState();

  // Send message to background script (sẽ forward đến content script)
  chrome.runtime.sendMessage({
    action: 'toggleMedieval',
    enabled: isEnabled,
  });
}

// Initialize popup
function initializePopup() {
  // Get DOM elements
  toggleSwitch = document.getElementById('toggleSwitch');
  statusText = document.getElementById('statusText');

  // Event listeners
  toggleSwitch.addEventListener('click', toggleMedieval);

  // Load initial state
  loadState();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePopup);
} else {
  initializePopup();
}
