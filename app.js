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
  if (newName) {
    document.getElementById('projectName').textContent = newName;
  }
  this.style.display = 'none';
  document.getElementById('projectName').style.display = 'inline';
  document.getElementById('editProjectBtn').style.display = 'inline';
});

// Handle gallery image upload
document.getElementById('fileInputGallery').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    const img = document.getElementById('previewImage');
    img.src = URL.createObjectURL(file);
    img.style.display = 'block';
    document.getElementById('placeholderText').style.display = 'none';
  }
});

// Handle camera photo capture
document.getElementById('fileInputCamera').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    const img = document.getElementById('previewImage');
    img.src = URL.createObjectURL(file);
    img.style.display = 'block';
    document.getElementById('placeholderText').style.display = 'none';
  }
});

// Forward button shows prompt input
document.getElementById('forwardButton').addEventListener('click', function () {
  document.getElementById('promptArea').style.display = 'block';
});
