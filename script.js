// Password protection
const ADMIN_PASSWORD = 'safari'; // Safari Resort password

function checkPassword() {
  const input = document.getElementById('password-input').value;
  if (input === ADMIN_PASSWORD) {
    document.getElementById('password-overlay').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
  } else {
    alert('Incorrect password!');
  }
}

// EmailJS submit (commented for PHP)
// document.getElementById('bookingForm').addEventListener('submit', function(e) {
  // e.preventDefault();
  // emailjs.sendForm('safaribooking ', 'safaribookingid', this)
    // .then(function() {
      // alert('Booking submitted successfully! Check your email.');
      // this.reset();
    // }, function(error) {
      // alert('Failed to send: ' + JSON.stringify(error));
    // });
  // });

// Payment upload preview/validation
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('bookingForm');
  const fileInput = document.getElementById('paymentScreenshot');
  const preview = document.getElementById('imagePreview');
  const uploadArea = document.querySelector('.upload-area');
  const errorDiv = document.getElementById('uploadError');
  const removeBtn = document.getElementById('removeImageBtn');
  
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  // Preview
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const type = file.type;
      if (!allowedTypes.includes(type)) {
        showError('Only JPG, PNG allowed');
        e.target.value = '';
        return;
      }
      if (file.size > maxSize) {
        showError('File too large (max 2MB)');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = 'block';
        removeBtn.style.display = 'block';
        clearError();
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Remove image
  removeBtn.addEventListener('click', function() {
    preview.src = '';
    preview.style.display = 'none';
    fileInput.value = '';
    removeBtn.style.display = 'none';
    clearError();
  });
  
  function showError(msg) {
    if (errorDiv) errorDiv.textContent = msg;
    if (preview) preview.style.display = 'none';
    if (removeBtn) removeBtn.style.display = 'none';
  }
  
  function clearError() {
    if (errorDiv) errorDiv.textContent = '';
  }
  
  // Drag drop
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
    uploadArea.addEventListener(event, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  ['dragenter', 'dragover'].forEach(event => {
    uploadArea.addEventListener(event, highlight, false);
  });
  
  ['dragleave', 'drop'].forEach(event => {
    uploadArea.addEventListener(event, unhighlight, false);
  });
  
  function highlight(e) {
    uploadArea.classList.add('highlight');
  }
  
  function unhighlight(e) {
    uploadArea.classList.remove('highlight');
  }
  
  uploadArea.addEventListener('drop', handleDrop, false);
  
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    fileInput.files = files;
    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);
  }
});

// Room selection feature
let roomCount = 0;
function addRoom() {
  roomCount++;
  const roomList = document.getElementById('roomList');
  const roomDiv = document.createElement('div');
  roomDiv.className = 'room-selection';
  roomDiv.id = `room-${roomCount}`;
  roomDiv.innerHTML = `
    <select name="roomType${roomCount}" required>
      <option value="">Room Type</option>
      <option value="deluxe">Deluxe Room</option>
      <option value="cottage">Cottage Room</option>
      <option value="mud">Mud Room</option>
    </select>
    <button type="button" onclick="removeRoom('room-${roomCount}')">Remove</button>
  `;
  roomList.appendChild(roomDiv);
}

function removeRoom(roomId) {
  const roomDiv = document.getElementById(roomId);
  roomDiv.remove();
}

// PHP form submit - add loading
document.getElementById('bookingForm').addEventListener('submit', function() {
  const submitBtn = this.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;
});

