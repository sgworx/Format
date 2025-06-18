// — Project Name Editing —
document.getElementById('editProjectBtn').addEventListener('click', () => {
  const span = document.getElementById('projectName');
  const input = document.getElementById('projectInput');
  input.value = span.textContent.replace('…', '');
  span.style.display = 'none';
  document.getElementById('editProjectBtn').style.display = 'none';
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

// — Gallery Upload & Camera Capture —
function loadPreview(file) {
  if (!file) return;
  const img = document.getElementById('previewImage');
  img.src = URL.createObjectURL(file);
  img.style.display = 'block';
  document.getElementById('placeholderText').style.display = 'none';
}
document.getElementById('fileInputGallery').addEventListener('change', e => loadPreview(e.target.files[0]));
document.getElementById('fileInputCamera').addEventListener('change', e => loadPreview(e.target.files[0]));

// — Show Prompt Input —
document.getElementById('forwardButton').addEventListener('click', () => {
  document.querySelectorAll('.footer-button, .middle-dot').forEach(el => el.style.display = 'none');
  document.getElementById('promptArea').style.display = 'flex';
  document.getElementById('container').classList.add('prompt-mode');
});

// — Submit Prompt and Show Output —
document.getElementById('promptForward').addEventListener('click', () => {
  const prompt = document.getElementById('designPrompt').value.trim();
  document.getElementById('outputText').textContent = prompt;

  document.getElementById('promptArea').style.display = 'none';
  document.getElementById('canvasArea').style.display = 'none';
  document.getElementById('mainFooter').style.display = 'none';

  document.getElementById('outputPrompt').style.display = 'flex';
  document.getElementById('outputArea').style.display = 'flex';
  document.getElementById('topBarText').textContent = 'Output';
});

// — Output Image Swiping Logic —
const outputImages = [
  'assets/GeneratedOutput.png',
  'assets/GeneratedOutput2.png',
  'assets/GeneratedOutput3.png'
];
let currentIndex = 0;

const outputImg = document.getElementById('outputImage');
const dots = document.querySelectorAll('.output-pagination .dot');

function updateOutputView() {
  outputImg.src = outputImages[currentIndex];
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

document.getElementById('prevOutput').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + outputImages.length) % outputImages.length;
  updateOutputView();
});

document.getElementById('nextOutput').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % outputImages.length;
  updateOutputView();
});

// Optional: regenerate button does nothing yet
document.getElementById('regenerateBtn').addEventListener('click', () => {
  alert('This would regenerate based on the same prompt.');
});

// Initialize first image
updateOutputView();
