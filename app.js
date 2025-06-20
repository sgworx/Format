// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  function createCircularMs() {
    const circle = document.querySelector('.add-output-circle');
    if (!circle) return;

    // Clear existing children to prevent duplication
    while (circle.firstChild) {
      circle.removeChild(circle.firstChild);
    }

    const numMs = 12;
    const radius = 100; // Corresponds to half the width/height of add-output-circle

    for (let i = 0; i < numMs; i++) {
      const angle = (i / numMs) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const mChar = document.createElement('div');
      mChar.classList.add('m-char');
      
      // We position from the center, so translate by -50% to center the character itself
      mChar.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      
      circle.appendChild(mChar);
    }
  }

  createCircularMs();

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
  const addOutputCircle = document.querySelector('.add-output-circle');
  const addOutputCameraInput = document.getElementById('addOutputCameraInput');

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
      updateProjectView();
      updatePagination();
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

  // Array of 3D models for the composition view
  const compositionModels = [
    'assets/Hy3D_00004_.glb',
    'assets/Hy3D_00001_.glb',
    'assets/Hy3D_00002_.glb',
    'assets/Hy3D_00003_.glb'
  ];

  function updateProductPreview() {
    // Hide all views first
    if (threedContainer) threedContainer.style.display = 'none';
    if (instructionsView) instructionsView.style.display = 'none';
    if (addOutputView) addOutputView.style.display = 'none';
    if (compositionView) compositionView.style.display = 'none';
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

  // Handle transition to composition view
  if (finalizeButton) {
    finalizeButton.addEventListener('click', () => {
      // Only transition to composition view if we're on the 4th output (index 3)
      if (currentProductIndex === 3) {
        // Hide other views but keep the container
        if (threedContainer) threedContainer.style.display = 'none';
        if (instructionsView) instructionsView.style.display = 'none';
        if (addOutputView) addOutputView.style.display = 'none';
        if (modelViewer) modelViewer.style.display = 'none';
        if (analysisImage) analysisImage.style.display = 'none';
        if (diagramsImage) diagramsImage.style.display = 'none';
        if (toggleSwitchContainer) toggleSwitchContainer.style.display = 'none';
        if (selectedOutputPreview) selectedOutputPreview.style.display = 'none';

        // Show composition view
        if (compositionView) {
          compositionView.style.display = 'block';
          initializeInteractiveComposition();
        }
      }
    });
  }

  function initializeInteractiveComposition() {
    const compositionViewer = document.getElementById('compositionViewer');
    if (!compositionViewer) return;

    // Create container for multiple models
    const modelContainer = document.createElement('div');
    modelContainer.className = 'model-container';
    compositionViewer.appendChild(modelContainer);

    // Create and position each model
    compositionModels.forEach((modelUrl, index) => {
      const modelViewer = document.createElement('model-viewer');
      modelViewer.src = modelUrl;
      modelViewer.classList.add('interactive-model');
      modelViewer.setAttribute('camera-controls', '');
      modelViewer.setAttribute('auto-rotate', '');
      modelViewer.setAttribute('interaction-prompt', 'none');
      modelViewer.style.position = 'absolute';
      
      // Set initial positions in a circular arrangement
      const angle = (index / compositionModels.length) * 2 * Math.PI;
      const radius = 200; // Adjust based on your needs
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      modelViewer.style.transform = `translate3d(${x}px, 0, ${z}px)`;
      modelContainer.appendChild(modelViewer);

      // Add interaction handlers
      let isDragging = false;
      let startX, startY;
      let currentX = x;
      let currentZ = z;

      modelViewer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentZ;
      });

      modelViewer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        currentX = e.clientX - startX;
        currentZ = e.clientY - startY;
        
        // Apply smooth movement
        modelViewer.style.transform = `translate3d(${currentX}px, 0, ${currentZ}px)`;
        
        // Check for collisions with other models
        const otherModels = Array.from(modelContainer.children).filter(m => m !== modelViewer);
        otherModels.forEach(other => {
          const rect1 = modelViewer.getBoundingClientRect();
          const rect2 = other.getBoundingClientRect();
          
          if (isColliding(rect1, rect2)) {
            // Create bounce effect
            const angle = Math.atan2(
              rect2.top - rect1.top,
              rect2.left - rect1.left
            );
            currentX += Math.cos(angle) * 10;
            currentZ += Math.sin(angle) * 10;
            modelViewer.style.transform = `translate3d(${currentX}px, 0, ${currentZ}px)`;
          }
        });
      });

      modelViewer.addEventListener('mouseup', () => {
        isDragging = false;
      });

      modelViewer.addEventListener('mouseleave', () => {
        isDragging = false;
      });
    });
  }

  function isColliding(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
  }

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

  // Handle camera input from the "Add your output" screen
  if (addOutputCameraInput) {
    addOutputCameraInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;

      loadPreview(file);

      if (addOutputView) addOutputView.style.display = 'none';
      if (nextStepLayout) nextStepLayout.style.display = 'none';
      if (canvasWrapper) canvasWrapper.style.display = 'flex';
      if (topBarText) topBarText.textContent = 'Capture';
      if (backButton) backButton.style.display = 'none';
      if (projectNameContainer) projectNameContainer.style.display = 'flex';
      if (finalizeButton) finalizeButton.style.display = 'none';
      if (promptAreaTop) promptAreaTop.style.display = 'none';
      if (footerCaptureControls) footerCaptureControls.style.display = 'flex';
      if (promptArea) promptArea.style.display = 'none';
    });
  }

  // "Add your output" button logic
  const addOutputBtn = document.getElementById('addOutputBtn');
  const cameraCaptureView = document.getElementById('cameraCaptureView');
  const projectViewsContainer = document.querySelector('.project-views-container');
  const projectPagination = document.querySelector('.project-pagination');
  const cameraViewPreview1 = document.getElementById('cameraViewPreview1');
  const cameraViewPreview2 = document.getElementById('cameraViewPreview2');

  if (addOutputBtn) {
    addOutputBtn.addEventListener('click', () => {
        // Hide the "add output" view
        if (addOutputView) addOutputView.style.display = 'none';

        // Hide the main project view content and pagination
        if (projectViewsContainer) projectViewsContainer.style.display = 'none';
        if (projectPagination) projectPagination.style.display = 'none';
        
        // Show the camera view itself
        if (cameraCaptureView) cameraCaptureView.style.display = 'flex';

        // Set the preview images in the camera view
        if (cameraViewPreview1 && selectedOutputPreview) {
          cameraViewPreview1.src = selectedOutputPreview.src;
        }
        if (cameraViewPreview2 && selectedOutputPreview) {
          cameraViewPreview2.src = selectedOutputPreview.src;
        }

        // Ensure the overall project layout and header are visible
        if (nextStepLayout) nextStepLayout.style.display = 'flex';
        if (topBarText) topBarText.textContent = 'Project 4 Stool';
        if (backButton) backButton.style.display = 'flex';
        if (finalizeButton) finalizeButton.style.display = 'none';
    });
  }
});