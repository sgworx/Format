// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // — Project Name Editing —
  const editProjectBtn = document.getElementById('editProjectBtn');
  const projectName = document.getElementById('projectName');
  const projectInput = document.getElementById('projectInput');

  if (editProjectBtn) {
    editProjectBtn.addEventListener('click', () => {
      projectInput.value = projectName.textContent.replace('…', '');
      projectName.style.display = 'none';
      editProjectBtn.style.display = 'none';
      projectInput.style.display = 'inline';
      projectInput.focus();
    });
  }

  if (projectInput) {
    projectInput.addEventListener('blur', function() {
      const newName = this.value.trim();
      if (newName) projectName.textContent = newName;
      this.style.display = 'none';
      projectName.style.display = 'inline';
      editProjectBtn.style.display = 'inline';
    });
  }

  // — Gallery Upload & Camera Capture —
  function loadPreview(file) {
    if (!file) return;
    const previewImage = document.getElementById('previewImage');
    const placeholderText = document.getElementById('placeholderText');
    if (previewImage && file) {
      previewImage.src = URL.createObjectURL(file);
      previewImage.style.display = 'block';
      if (placeholderText) placeholderText.style.display = 'none';
    }
  }

  const fileInputGallery = document.getElementById('fileInputGallery');
  const fileInputCamera = document.getElementById('fileInputCamera');

  if (fileInputGallery) {
    fileInputGallery.addEventListener('change', e => loadPreview(e.target.files[0]));
  }
  if (fileInputCamera) {
    fileInputCamera.addEventListener('change', e => loadPreview(e.target.files[0]));
  }

  // — Show Prompt Input —
  const forwardButton = document.getElementById('forwardButton');
  const promptArea = document.getElementById('promptArea');
  const container = document.getElementById('container');
  const mainFooter = document.getElementById('mainFooter');

  if (forwardButton) {
    forwardButton.addEventListener('click', () => {
      // Hide the footer buttons
      const footerButtons = document.querySelectorAll('.footer-button');
      footerButtons.forEach(btn => btn.style.display = 'none');
      
      // Hide the middle dot
      const middleDot = document.querySelector('.middle-dot');
      if (middleDot) middleDot.style.display = 'none';
      
      // Show prompt area
      if (promptArea) promptArea.style.display = 'flex';
      
      // Hide main footer
      if (mainFooter) mainFooter.style.display = 'none';
      
      // Add prompt mode class
      if (container) container.classList.add('prompt-mode');
    });
  }

  // — Submit Prompt and Show Output —
  const promptForward = document.getElementById('promptForward');
  const designPrompt = document.getElementById('designPrompt');
  const outputText = document.getElementById('outputText');
  const canvasArea = document.getElementById('canvasArea');
  const outputPrompt = document.getElementById('outputPrompt');
  const outputArea = document.getElementById('outputArea');
  const topBarText = document.getElementById('topBarText');

  if (promptForward) {
    promptForward.addEventListener('click', () => {
      const prompt = designPrompt.value.trim();
      if (outputText) outputText.textContent = prompt || 'Design Prompt...';

      if (promptArea) promptArea.style.display = 'none';
      if (canvasArea) canvasArea.style.display = 'none';

      if (outputPrompt) outputPrompt.style.display = 'flex';
      if (outputArea) outputArea.style.display = 'flex';
      if (topBarText) topBarText.textContent = 'Output';
    });
  }

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
    if (outputImg && outputImages[currentIndex]) {
      outputImg.src = outputImages[currentIndex];
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }
  }

  const prevOutput = document.getElementById('prevOutput');
  const nextOutput = document.getElementById('nextOutput');

  if (prevOutput) {
    prevOutput.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + outputImages.length) % outputImages.length;
      updateOutputView();
    });
  }

  if (nextOutput) {
    nextOutput.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % outputImages.length;
      updateOutputView();
    });
  }

  // — Choose Button Logic —
  const chooseButton = document.getElementById('chooseButton');
  const nextStepLayout = document.getElementById('nextStepLayout');
  const selectedOutputPreview = document.getElementById('selectedOutputPreview');

  if (chooseButton && outputArea && nextStepLayout && selectedOutputPreview && outputImg) {
    chooseButton.addEventListener('click', () => {
      // Copy the current output image to the small preview
      selectedOutputPreview.src = outputImg.src;
      
      // Add minimized class to start transition
      outputArea.classList.add('minimized');
      
      // Show the next step layout
      nextStepLayout.style.display = 'flex';
      
      // Update the top bar text
      if (topBarText) {
        topBarText.textContent = 'Preview';
      }
      
      // Hide the original output pagination and navigation
      const outputPagination = document.querySelector('.output-pagination');
      const navButtons = document.querySelectorAll('.nav-btn');
      
      if (outputPagination) {
        outputPagination.style.display = 'none';
      }
      
      navButtons.forEach(btn => {
        btn.style.display = 'none';
      });
      
      // Hide the choose button after selection
      chooseButton.style.display = 'none';
    });
  }

  // — Regenerate placeholder —
  const regenerateBtn = document.getElementById('regenerateBtn');
  if (regenerateBtn) {
    regenerateBtn.addEventListener('click', () => {
      alert('This would regenerate based on the same prompt.');
    });
  }

  // — Initialize view —
  updateOutputView();
});