// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo');

  // — Project Name Editing —
  const editProjectBtn = document.getElementById('editProjectBtn');
  const projectName = document.getElementById('projectName');
  const projectInput = document.getElementById('projectInput');
  const projectNameContainer = document.querySelector('.project-name');
  const finalizeButton = document.getElementById('finalizeButton');
  const instructionsView = document.getElementById('instructionsView');
  const instructionsImage = document.getElementById('instructionsImage');
  const threedContainer = document.querySelector('.threed-output-container');
  const instructionsPaginationDots = document.querySelectorAll('#instructionsView .dot');
  let originalProjectName = '';

  if (logo) {
    logo.addEventListener('click', () => {
      // Show capture view, hide others
      if (canvasWrapper) canvasWrapper.style.display = 'flex';
      if (outputArea) outputArea.style.display = 'none';
      if (nextStepLayout) nextStepLayout.style.display = 'none';

      // Reset top bar
      if (topBarText) topBarText.textContent = 'Capture';
      if (backButton) backButton.style.display = 'none';
      if (projectNameContainer) projectNameContainer.style.display = 'flex';
      if (finalizeButton) finalizeButton.style.display = 'none';
      promptAreaTop.style.display = 'none';
      
      // Cancel project name editing if active
      if (projectInput.style.display === 'inline') {
        projectInput.style.display = 'none';
        projectName.style.display = 'inline';
        editProjectBtn.style.display = 'inline';
      }

      // Reset footer
      if (footerCaptureControls) footerCaptureControls.style.display = 'flex';
      if (promptArea) promptArea.style.display = 'none';
      
      // Reset canvas
      if (previewImage) {
          previewImage.src = '';
          previewImage.style.display = 'none';
      }
      if (placeholderText) placeholderText.style.display = 'block';

      // Reset state variables
      currentOutputIndex = 0;
      currentProductIndex = 0;
      updateOutputView();
    });
  }

  if (editProjectBtn) {
    editProjectBtn.addEventListener('click', () => {
      projectInput.value = projectName.textContent.replace('…', '');
      projectName.style.display = 'none';
      editProjectBtn.style.display = 'none';
      projectInput.style.display = 'inline';
      projectInput.focus();
      if (projectNameContainer) {
        projectNameContainer.style.display = 'none';
      }
      if (finalizeButton) {
        finalizeButton.style.display = 'flex';
      }
    });
  }

  if (projectInput) {
    projectInput.addEventListener('blur', function() {
      const newName = this.value.trim();
      if (newName) projectName.textContent = newName;
      this.style.display = 'none';
      projectName.style.display = 'inline';
      editProjectBtn.style.display = 'inline';
      if (projectNameContainer) {
        projectNameContainer.style.display = 'flex';
      }
      if (finalizeButton) {
        finalizeButton.style.display = 'none';
      }
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
  const designPrompt = document.getElementById('designPrompt');

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
  const productImages = [...outputImages]; // Now only 3 images

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
  const diagramsImage = document.getElementById('diagramsImage');
  const backButton = document.getElementById('backButton');
  const productPaginationDots = document.querySelectorAll('#nextStepLayout .output-pagination .dot');
  const addOutputView = document.getElementById('addOutputView');
  const toggleSwitchContainer = document.querySelector('.toggle-switch-container');

  if (chooseButton && outputArea && nextStepLayout && selectedOutputPreview && outputImg) {
    chooseButton.addEventListener('click', () => {
      // Hide the main output area
      outputArea.style.display = 'none';
      
      // Show the next step layout
      nextStepLayout.style.display = 'flex';
      
      // Update the top bar text and show the back button
      if (topBarText) {
        topBarText.textContent = 'Project 4 Stool';
      }
      if (backButton) {
        backButton.style.display = 'flex';
      }
      if (projectNameContainer) {
        projectNameContainer.style.display = 'none';
      }
      if (finalizeButton) {
        finalizeButton.style.display = 'flex';
      }

      // Set the chosen image in the preview and make it visible.
      // This image will now stay the same while navigating the product views.
      selectedOutputPreview.src = outputImages[currentOutputIndex];
      selectedOutputPreview.style.visibility = 'visible';

      // Always start the product view at the first item (3D model).
      currentProductIndex = 0;
      updateProductPreview();
    });
  }

  if (backButton) {
    backButton.addEventListener('click', () => {
      nextStepLayout.style.display = 'none';
      outputArea.style.display = 'flex';
      finalizeButton.style.display = 'none';
      if (topBarText) {
        topBarText.textContent = 'Output';
      }
      if (backButton) {
        backButton.style.display = 'none';
      }
      if (projectNameContainer) {
        projectNameContainer.style.display = 'flex';
      }
    });
  }

  function updateProductPreview() {
    // Hide all views first
    if (threedContainer) threedContainer.style.display = 'none';
    if (instructionsView) instructionsView.style.display = 'none';
    if (addOutputView) addOutputView.style.display = 'none';
    if (modelViewer) modelViewer.style.display = 'none';
    if (analysisImage) analysisImage.style.display = 'none';
    if (diagramsImage) diagramsImage.style.display = 'none';
    if (toggleSwitchContainer) toggleSwitchContainer.style.display = 'none';
    
    // Set the correct header thumbnail
    if (currentProductIndex === 3) {
      selectedOutputPreview.src = 'assets/ComfyUI_00257_.png'; // Thumbnail for the 4th output
    } else {
      selectedOutputPreview.src = 'assets/ComfyUI_00259_.png'; // Default thumbnail for outputs 1-3
    }

    // Show the correct view based on index
    switch (currentProductIndex) {
      case 0: // 3D Model & Analysis Toggle
        if (threedContainer) threedContainer.style.display = 'flex';
        if (toggleSwitchContainer) toggleSwitchContainer.style.display = 'block';
        // Show either model or analysis based on toggle
        if (autoRotateToggle.checked) {
          if (modelViewer) modelViewer.style.display = 'block';
        } else {
          if (analysisImage) analysisImage.style.display = 'block';
        }
        break;
      case 1: // Instructions
        if (instructionsView) instructionsView.style.display = 'flex';
        break;
      case 2: // Diagrams Image
        if (threedContainer) threedContainer.style.display = 'flex';
        if (diagramsImage) diagramsImage.style.display = 'block';
        break;
      case 3: // Add Output
        if (addOutputView) addOutputView.style.display = 'flex';
        break;
    }
    
    // Update dots
    productPaginationDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentProductIndex);
    });
  }

  // Add event listeners to each product pagination dot
  productPaginationDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentProductIndex = index;
      updateProductPreview();
    });
  });

  autoRotateToggle.addEventListener('change', () => {
    // Only update if we are on the first product view
    if (currentProductIndex === 0) {
      updateProductPreview();
    }
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

  if (finalizeButton) {
    finalizeButton.addEventListener('click', () => {
      currentProductIndex = (currentProductIndex + 1) % productImages.length;
      updateProductPreview();
    });
  }
});