// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // — Project Name Editing —
  const editProjectBtn = document.getElementById('editProjectBtn');
  const projectName = document.getElementById('projectName');
  const projectInput = document.getElementById('projectInput');
  let originalProjectName = '';

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
  const footerCaptureControls = document.getElementById('footerCaptureControls');

  if (forwardButton && promptArea && footerCaptureControls) {
    forwardButton.addEventListener('click', () => {
      footerCaptureControls.style.display = 'none';
      promptArea.style.display = 'flex';
    });
  }

  // — Submit Prompt and Show Output —
  const promptForward = document.getElementById('promptForward');
  const promptAreaTop = document.getElementById('promptAreaTop');
  const designPromptTop = document.getElementById('designPromptTop');
  const canvasWrapper = document.getElementById('canvasWrapper');
  const outputArea = document.getElementById('outputArea');
  const topBarText = document.getElementById('topBarText');

  if (promptForward) {
    promptForward.addEventListener('click', () => {
      if (canvasWrapper) canvasWrapper.style.display = 'none';
      if (outputArea) outputArea.style.display = 'flex';
      if (topBarText) topBarText.textContent = 'Output';
      
      // Copy the prompt text to the top prompt and hide bottom prompt
      if (designPromptTop && designPrompt) {
        designPromptTop.value = designPrompt.value;
        promptArea.style.display = 'none';
      }
      
      // Initialize the output view
      updateOutputView();
    });
  }

  // — Output Image Swiping Logic —
  const outputImages = [
    'assets/ComfyUI_00257_.png',
    'assets/ComfyUI_00259_.png',
    'assets/ComfyUI_00258_.png'
  ];
  const productImages = [...outputImages, outputImages[0]]; // 4 images for the product view

  let currentOutputIndex = 0;
  let currentProductIndex = 0;

  const outputImg = document.getElementById('outputImage');
  const dots = document.querySelectorAll('#outputArea .dot');

  function updateOutputView() {
    if (outputImg && outputImages[currentOutputIndex]) {
      outputImg.src = outputImages[currentOutputIndex];
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentOutputIndex));
    }
  }

  const prevOutput = document.getElementById('prevOutput');
  const nextOutput = document.getElementById('nextOutput');

  if (prevOutput) {
    prevOutput.addEventListener('click', () => {
      currentOutputIndex = (currentOutputIndex - 1 + outputImages.length) % outputImages.length;
      updateOutputView();
    });
  }

  if (nextOutput) {
    nextOutput.addEventListener('click', () => {
      currentOutputIndex = (currentOutputIndex + 1) % outputImages.length;
      updateOutputView();
    });
  }

  // — Choose Button Logic —
  const chooseButton = document.getElementById('chooseButton');
  const nextStepLayout = document.getElementById('nextStepLayout');
  const selectedOutputPreview = document.getElementById('selectedOutputPreview');
  const modelViewer = document.getElementById('modelViewer');
  const autoRotateToggle = document.getElementById('autoRotateToggle');
  const analysisImage = document.getElementById('analysisImage');
  const backButton = document.getElementById('backButton');
  const productPaginationDots = document.querySelectorAll('#nextStepLayout .dot');

  if (chooseButton && outputArea && nextStepLayout && selectedOutputPreview && outputImg) {
    chooseButton.addEventListener('click', () => {
      // Hide the main output area
      outputArea.style.display = 'none';
      
      // Show the next step layout
      nextStepLayout.style.display = 'flex';
      
      // Update the top bar text and show the back button
      if (topBarText) {
        topBarText.textContent = 'Stool';
      }
      if (backButton) {
        backButton.style.display = 'flex';
      }
      if (projectName && editProjectBtn) {
        originalProjectName = projectName.textContent;
        projectName.textContent = 'Project 4';
        editProjectBtn.style.display = 'none';
      }

      // Sync the index and update the product preview
      currentProductIndex = currentOutputIndex;
      updateProductPreview();
    });
  }

  if (backButton) {
    backButton.addEventListener('click', () => {
      nextStepLayout.style.display = 'none';
      outputArea.style.display = 'flex';
      if (topBarText) {
        topBarText.textContent = 'Output';
      }
      if (backButton) {
        backButton.style.display = 'none';
      }
      if (projectName && editProjectBtn) {
        projectName.textContent = originalProjectName;
        editProjectBtn.style.display = 'inline';
      }
    });
  }

  if (autoRotateToggle && modelViewer && analysisImage) {
    autoRotateToggle.addEventListener('change', () => {
      if (autoRotateToggle.checked) {
        modelViewer.style.display = 'none';
        analysisImage.style.display = 'block';
      } else {
        modelViewer.style.display = 'block';
        analysisImage.style.display = 'none';
      }
    });
    // Set initial state based on checkbox
    if (autoRotateToggle.checked) {
      modelViewer.style.display = 'none';
      analysisImage.style.display = 'block';
    } else {
      modelViewer.style.display = 'block';
      analysisImage.style.display = 'none';
    }
  }

  function updateProductPreview() {
    if (selectedOutputPreview) {
      selectedOutputPreview.src = productImages[currentProductIndex];
    }
    productPaginationDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentProductIndex);
    });
  }

  productPaginationDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentProductIndex = index;
        updateProductPreview();
    });
  });

  // — Initialize view —
  updateOutputView();

  // --- Keyboard handling for prompt input ---
  const designPromptInput = document.getElementById('designPrompt');
  const container = document.getElementById('container');

  if (designPromptInput && container) {
    designPromptInput.addEventListener('focus', () => {
      container.classList.add('keyboard-active');
    });

    designPromptInput.addEventListener('blur', () => {
      container.classList.remove('keyboard-active');
    });
  }
});