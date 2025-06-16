// PROJECT EDIT
document.getElementById('editProjectBtn').addEventListener('click', function () {
  const span = document.getElementById('projectName');
  const input = document.getElementById('projectInput');
  input.value = span.textContent.replace('...', '');
  span.style.display = 'none';
  this.style.display = 'none';
  input.style.display = 'inline';
  input.focus();
});
document.getElementById('projectInput').addEventListener('blur', function () {
  const newName = this.value.trim();
  if (newName) document.getElementById('projectName').textContent = newName;
  this.style.display = 'none';
  document.getElementById('projectName').style.display = 'inline';
  document.getElementById('editProjectBtn').style.display = 'inline';
});

// GALLERY & CAMERA
document.getElementById('fileInputGallery').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const img = document.getElementById('previewImage');
  img.src = URL.createObjectURL(file);
  img.style.display = 'block';
  document.getElementById('placeholderText').style.display = 'none';
});
document.getElementById('fileInputCamera').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const img = document.getElementById('previewImage');
  img.src = URL.createObjectURL(file);
  img.style.display = 'block';
  document.getElementById('placeholderText').style.display = 'none';
});

// FORWARD → SHOW PROMPT
document.getElementById('forwardButton').addEventListener('click', () => {
  document.getElementById('mainFooter').style.display = 'none';
  document.getElementById('promptArea').style.display = 'flex';
  document.querySelector('.container').classList.add('prompt-mode');
});

// SUBMIT PROMPT → SHOW OUTPUT
document.getElementById('promptForward').addEventListener('click', () => {
  // grab & echo the user’s prompt
  const userPrompt = document.getElementById('designPrompt').value.trim();
  document.getElementById('outputText').textContent = userPrompt;

  // hide prompt UI
  document.getElementById('promptArea').style.display = 'none';

  // reveal output pane
  document.getElementById('outputArea').style.display = 'flex';
});
