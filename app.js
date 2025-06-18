// --- Project Name Editing ---
document.getElementById('editProjectBtn').addEventListener('click', () => {
  const span = document.getElementById('projectName');
  const input = document.getElementById('projectInput');
  input.value = span.textContent.replace('…', '');
  span.style.display = 'none';
  document.getElementById('editProjectBtn').style.display = 'none';
  input.style.display = 'inline';
  input.focus();
});

document.getElementById('projectInput').addEventListener('blur', function() {
  const newName = this.value.trim();
  if (newName) {
    document.getElementById('projectName').textContent = newName;
  }
  this.style.display = 'none';
  document.getElementById('projectName').style.display = 'inline';
  document.getElementById('editProjectBtn').style.display = 'inline';
});

// --- Gallery Upload ---
document.getElementById('fileInputGallery').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const img = document.getElementById('previewImage');
  img.src = URL.createObjectURL(file);
  img.style.display = 'block';
  document.getElementById('placeholderText').style.display = 'none';
});

// --- Camera Capture ---
document.getElementById('fileInputCamera').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const img = document.getElementById('previewImage');
  img.src = URL.createObjectURL(file);
  img.style.display = 'block';
  document.getElementById('placeholderText').style.display = 'none';
});

// --- Step 2: Show Prompt Input (hide gallery/camera) ---
document.getElementById('forwardButton').addEventListener('click', () => {
  // hide gallery/camera row
  document.getElementById('mainFooter').style.display = 'none';
  // show prompt area
  const promptArea = document.getElementById('promptArea');
  promptArea.style.display = 'flex';
  // reserve room for on‐screen keyboard
  document.getElementById('container').classList.add('prompt-mode');
});

// --- Step 3: Submit Prompt & Reveal Generated Output ---
document.getElementById('promptForward').addEventListener('click', () => {
  // show the output block
  document.getElementById('outputArea').style.display = 'flex';
});
