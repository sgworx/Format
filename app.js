// Editable project name
document.getElementById('editProjectBtn').addEventListener('click', () => {
  const span  = document.getElementById('projectName');
  const input = document.getElementById('projectInput');
  input.value = span.textContent.replace('…','');
  span.style.display = 'none';
  document.getElementById('editProjectBtn').style.display = 'none';
  input.style.display = 'inline';
  input.focus();
});

document.getElementById('projectInput').addEventListener('blur', function() {
  const newName = this.value.trim();
  if (newName) document.getElementById('projectName').textContent = newName;
  this.style.display = 'none';
  document.getElementById('projectName').style.display = 'inline';
  document.getElementById('editProjectBtn').style.display = 'inline';
});

// Load preview image
function loadPreview(file) {
  if (!file) return;
  const img = document.getElementById('previewImage');
  img.src = URL.createObjectURL(file);
  img.style.display = 'block';
  document.getElementById('placeholderText').style.display = 'none';
}

document.getElementById('fileInputGallery').addEventListener('change', e => loadPreview(e.target.files[0]));
document.getElementById('fileInputCamera').addEventListener('change', e => loadPreview(e.target.files[0]));

// Show prompt input
document.getElementById('forwardButton').addEventListener('click', () => {
  document.getElementById('promptArea').style.display = 'flex';
  document.getElementById('mainFooter').style.display = 'none';
});

// Show output screen
document.getElementById('promptForward').addEventListener('click', () => {
  const userPrompt = document.getElementById('designPrompt').value.trim();
  document.getElementById('outputText').textContent = userPrompt;
  document.getElementById('promptArea').style.display = 'none';
  document.getElementById('canvasArea').style.display = 'none';
  document.getElementById('outputPrompt').style.display = 'block';
  document.getElementById('outputArea').style.display = 'flex';
});

// Carousel logic
const images = [
  "assets/GeneratedOutput.png",
  "assets/GeneratedOutput2.png",
  "assets/GeneratedOutput3.png"
];

let current = 0;
const image = document.getElementById('outputImage');
const dots = document.querySelectorAll('.dot');

function showImage(index) {
  image.src = images[index];
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

document.getElementById('prevBtn').addEventListener('click', () => {
  current = (current - 1 + images.length) % images.length;
  showImage(current);
});

document.getElementById('nextBtn').addEventListener('click', () => {
  current = (current + 1) % images.length;
  showImage(current);
});

showImage(0);
