// Enhanced forMat Application
// Optimized for performance, maintainability, and user experience

class FormatApp {
  constructor() {
    this.state = {
      currentView: 'home',
      currentOutputIndex: 0,
      currentProductIndex: 0,
      selectedFile: null,
      isModelViewerLoaded: false,
      cameraStream: null
    };

    this.config = {
      outputImages: [
        'assets/ComfyUI_00257_.png',
        'assets/ComfyUI_00259_.png',
        'assets/ComfyUI_00258_.png'
      ],
      compositionModels: [
        'assets/Hy3D_00004_.glb',
        'assets/Hy3D_00001_.glb',
        'assets/Hy3D_00002_.glb',
        'assets/Hy3D_00003_.glb'
      ]
    };

    this.elements = {};
    this.boundMethods = {};
    
    this.init();
  }

  // Initialize the application
  init() {
    this.cacheElements();
    this.bindEvents();
    this.createCircularMs();
    this.initializeMouseFollower();
    this.updateOutputView();
  }

  // Cache all DOM elements to avoid repeated queries
  cacheElements() {
    const elementIds = [
      'homeView', 'canvasWrapper', 'outputArea', 'nextStepLayout',
      'topBarText', 'backButton', 'finalizeButton', 'homeStartButton',
      'editProjectBtn', 'projectName', 'projectInput', 'fileInputGallery',
      'fileInputCamera', 'canvasArea', 'forwardButton', 'promptArea',
      'footerCaptureControls', 'promptForward', 'designPrompt', 'designPromptTop',
      'outputImage', 'prevOutput', 'nextOutput', 'chooseButton',
      'selectedOutputPreview', 'modelViewer', 'autoRotateToggle',
      'analysisImage', 'diagramsImage', 'instructionsView', 'addOutputView',
      'compositionView', 'previewImage', 'placeholderText', 'addOutputBtn',
      'cameraCaptureView', 'cameraViewPreview1', 'cameraViewPreview2',
      'addOutputCameraInput', 'cameraVideo'
    ];

    elementIds.forEach(id => {
      this.elements[id] = document.getElementById(id);
    });

    // Cache element collections
    this.elements.logo = document.querySelector('.logo');
    this.elements.projectNameContainer = document.querySelector('.project-name');
    this.elements.toggleSwitchContainer = document.querySelector('.toggle-switch-container');
    this.elements.addOutputCircle = document.querySelector('.add-output-circle');
    this.elements.footerDivider = document.querySelector('.footer-divider');
    this.elements.container = document.getElementById('container');
    this.elements.projectViewsContainer = document.querySelector('.project-views-container');
    this.elements.projectPagination = document.querySelector('.project-pagination');

    // Cache dot collections
    this.elements.outputDots = document.querySelectorAll('#outputArea .dot');
    this.elements.productDots = document.querySelectorAll('#nextStepLayout .output-pagination .dot');
  }

  // Bind all event listeners with proper context
  bindEvents() {
    // Bind methods to maintain context
    this.boundMethods = {
      handleHomeStart: this.handleHomeStart.bind(this),
      handleLogoClick: this.handleLogoClick.bind(this),
      handleProjectEdit: this.handleProjectEdit.bind(this),
      handleProjectInputBlur: this.handleProjectInputBlur.bind(this),
      handleFileUpload: this.handleFileUpload.bind(this),
      handleCanvasClick: this.handleCanvasClick.bind(this),
      handleForwardClick: this.handleForwardClick.bind(this),
      handlePromptSubmit: this.handlePromptSubmit.bind(this),
      handleOutputNavigation: this.handleOutputNavigation.bind(this),
      handleChooseButton: this.handleChooseButton.bind(this),
      handleBackButton: this.handleBackButton.bind(this),
      handleToggleSwitch: this.handleToggleSwitch.bind(this),
      handleProductDotClick: this.handleProductDotClick.bind(this),
      handleFinalizeButton: this.handleFinalizeButton.bind(this),
      handleAddOutputButton: this.handleAddOutputButton.bind(this),
      handleKeyboardFocus: this.handleKeyboardFocus.bind(this),
      handleKeyboardBlur: this.handleKeyboardBlur.bind(this)
    };

    // Add event listeners
    this.addEventListeners();
  }

  addEventListeners() {
    const { elements, boundMethods } = this;

    // Navigation events
    if (elements.homeStartButton) {
      elements.homeStartButton.addEventListener('click', boundMethods.handleHomeStart);
    }

    if (elements.logo) {
      elements.logo.addEventListener('click', boundMethods.handleLogoClick);
    }

    if (elements.backButton) {
      elements.backButton.addEventListener('click', boundMethods.handleBackButton);
    }

    // Project name editing
    if (elements.editProjectBtn) {
      elements.editProjectBtn.addEventListener('click', boundMethods.handleProjectEdit);
    }

    if (elements.projectInput) {
      elements.projectInput.addEventListener('blur', boundMethods.handleProjectInputBlur);
    }

    // File handling
    if (elements.fileInputGallery) {
      elements.fileInputGallery.addEventListener('change', (e) => 
        boundMethods.handleFileUpload(e.target.files[0])
      );
    }

    // Camera shutter button: capture from live video
    const cameraButton = document.querySelector('.camera-button');
    if (cameraButton && this.elements.cameraVideo) {
      cameraButton.addEventListener('click', () => {
        const video = this.elements.cameraVideo;
        if (!video || video.readyState < 2) return; // Not ready
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], 'capture.png', { type: 'image/png' });
            this.handleFileUpload(file);
          }
        }, 'image/png');
      });
    }

    if (elements.addOutputCameraInput) {
      elements.addOutputCameraInput.addEventListener('change', (e) => 
        boundMethods.handleFileUpload(e.target.files[0])
      );
    }

    if (elements.canvasArea && elements.fileInputGallery) {
      elements.canvasArea.addEventListener('click', boundMethods.handleCanvasClick);
    }

    // UI interactions
    if (elements.forwardButton) {
      elements.forwardButton.addEventListener('click', boundMethods.handleForwardClick);
    }

    if (elements.promptForward) {
      elements.promptForward.addEventListener('click', boundMethods.handlePromptSubmit);
    }

    if (elements.chooseButton) {
      elements.chooseButton.addEventListener('click', boundMethods.handleChooseButton);
    }

    if (elements.finalizeButton) {
      elements.finalizeButton.addEventListener('click', boundMethods.handleFinalizeButton);
    }

    if (elements.addOutputBtn) {
      elements.addOutputBtn.addEventListener('click', boundMethods.handleAddOutputButton);
    }

    // Output navigation
    if (elements.prevOutput) {
      elements.prevOutput.addEventListener('click', () => 
        boundMethods.handleOutputNavigation(-1)
      );
    }

    if (elements.nextOutput) {
      elements.nextOutput.addEventListener('click', () => 
        boundMethods.handleOutputNavigation(1)
      );
    }

    // Toggle switch
    if (elements.autoRotateToggle) {
      elements.autoRotateToggle.addEventListener('change', boundMethods.handleToggleSwitch);
    }

    // Product pagination dots
    elements.productDots.forEach((dot, index) => {
      dot.addEventListener('click', () => boundMethods.handleProductDotClick(index));
    });

    // Keyboard handling
    if (elements.designPrompt && elements.container) {
      elements.designPrompt.addEventListener('focus', boundMethods.handleKeyboardFocus);
      elements.designPrompt.addEventListener('blur', boundMethods.handleKeyboardBlur);
    }
  }

  // Event handlers
  handleHomeStart() {
    this.showView('capture');
  }

  handleLogoClick() {
    this.showView('home');
    this.resetState();
  }

  handleProjectEdit() {
    const { projectInput, projectName, editProjectBtn, projectNameContainer, finalizeButton } = this.elements;
    
    if (projectInput && projectName && editProjectBtn) {
      projectInput.value = projectName.textContent.replace('…', '');
      this.toggleVisibility(projectName, false);
      this.toggleVisibility(editProjectBtn, false);
      this.toggleVisibility(projectInput, true, 'inline');
      this.toggleVisibility(projectNameContainer, false);
      this.toggleVisibility(finalizeButton, true, 'flex');
      projectInput.focus();
    }
  }

  handleProjectInputBlur() {
    const { projectInput, projectName, editProjectBtn, projectNameContainer, finalizeButton } = this.elements;
    
    const newName = projectInput.value.trim();
    if (newName) projectName.textContent = newName;
    
    this.toggleVisibility(projectInput, false);
    this.toggleVisibility(projectName, true, 'inline');
    this.toggleVisibility(editProjectBtn, true, 'inline');
    this.toggleVisibility(projectNameContainer, true, 'flex');
    this.toggleVisibility(finalizeButton, false);
  }

  handleFileUpload(file) {
    if (!file) return;
    
    this.state.selectedFile = file;
    this.loadPreview(file);
  }

  handleCanvasClick() {
    if (this.elements.fileInputGallery) {
      this.elements.fileInputGallery.click();
    }
  }

  handleForwardClick() {
    if (!this.elements.forwardButton?.classList.contains('enabled')) return;
    
    // Skip the minimized view completely - go straight to output with preview
    this.showOutputWithPreview();
    this.copyPromptText();
    this.updateOutputView();
  }

  showMinimizedPromptView() {
    // Hide the footer capture controls
    this.toggleVisibility(this.elements.footerCaptureControls, false);
    
    // Show the prompt area
    this.toggleVisibility(this.elements.promptArea, true, 'flex');
    
    // Apply minimized styles
    if (this.elements.canvasWrapper) {
      this.elements.canvasWrapper.classList.add('minimized');
    }
    if (this.elements.canvasArea) {
      this.elements.canvasArea.classList.add('small-preview');
    }

    // Auto-focus the input
    if (this.elements.designPrompt) {
      setTimeout(() => {
        this.elements.designPrompt.focus();
      }, 100);
    }
  }

  handlePromptSubmit() {
    // Go to output with small preview at top (Image 4)
    this.showOutputWithPreview();
    this.copyPromptText();
    this.updateOutputView();
  }

  showOutputWithPreview() {
    // Apply minimized state for the small preview
    if (this.elements.canvasWrapper) {
      this.elements.canvasWrapper.classList.add('minimized');
      this.elements.canvasWrapper.style.position = 'absolute';
      this.elements.canvasWrapper.style.top = '100px';
      this.elements.canvasWrapper.style.left = '20px';
      this.elements.canvasWrapper.style.zIndex = '20';
    }
    if (this.elements.canvasArea) {
      this.elements.canvasArea.classList.add('small-preview');
    }
    
    // Show output area with preview layout
    this.toggleVisibility(this.elements.outputArea, true, 'flex');
    this.elements.outputArea.classList.add('with-preview');
    
    // Show the prompt area top for the output view
    this.toggleVisibility(this.elements.promptAreaTop, true, 'flex');
    
    // Hide capture controls and prompt input
    this.toggleVisibility(this.elements.footerCaptureControls, false);
    this.toggleVisibility(this.elements.promptArea, false);
    
    this.updateTopBar('Output');
  }

  showTypingState() {
    // Keep the canvas wrapper visible but minimized
    this.toggleVisibility(this.elements.canvasWrapper, true, 'flex');
    
    // Hide the full capture controls
    this.toggleVisibility(this.elements.footerCaptureControls, false);
    
    // Show the prompt area immediately
    this.toggleVisibility(this.elements.promptArea, true, 'flex');
    
    // Apply minimized styles to canvas wrapper and area
    if (this.elements.canvasWrapper) {
      this.elements.canvasWrapper.classList.add('minimized');
    }
    if (this.elements.canvasArea) {
      this.elements.canvasArea.classList.add('small-preview');
    }

    // Focus on the text input so user can start typing immediately
    if (this.elements.designPrompt) {
      setTimeout(() => {
        this.elements.designPrompt.focus();
      }, 100);
    }

    // Keep showing the capture view but in minimized state
    this.updateTopBar('Capture');
  }

  handlePromptSubmit() {
    // Simple: go directly to the separate output page (like before)
    this.showView('output');
    this.copyPromptText();
    this.updateOutputView();
  }

  showInlineOutput() {
    // Create a container for the top section (image + prompt)
    const container = document.createElement('div');
    container.className = 'inline-top-section';
    
    // Modify canvas wrapper for inline layout
    if (this.elements.canvasWrapper) {
      this.elements.canvasWrapper.classList.add('with-inline-output');
      this.elements.canvasWrapper.style.position = 'relative';
      this.elements.canvasWrapper.style.top = 'auto';
      this.elements.canvasWrapper.style.left = 'auto';
      this.elements.canvasWrapper.style.float = 'left';
      this.elements.canvasWrapper.style.marginRight = '15px';
    }
    
    if (this.elements.canvasArea) {
      this.elements.canvasArea.classList.add('with-inline-output');
    }
    
    // Modify prompt area for inline layout
    if (this.elements.promptArea) {
      this.elements.promptArea.classList.add('inline-layout');
      this.elements.promptArea.style.position = 'relative';
      this.elements.promptArea.style.top = 'auto';
      this.elements.promptArea.style.float = 'left';
      this.elements.promptArea.style.width = 'calc(100% - 180px)';
    }
    
    // Show output area below
    if (this.elements.outputArea) {
      this.elements.outputArea.style.display = 'flex';
      this.elements.outputArea.style.position = 'relative';
      this.elements.outputArea.style.marginTop = '20px';
      this.elements.outputArea.style.clear = 'both';
      this.elements.outputArea.classList.add('inline');
    }
    
    // Hide the prompt area top section since we're keeping original
    if (this.elements.promptAreaTop) {
      this.elements.promptAreaTop.style.display = 'none';
    }
  }

  handleOutputNavigation(direction) {
    this.state.currentOutputIndex = this.getNextIndex(
      this.state.currentOutputIndex, 
      this.config.outputImages.length, 
      direction
    );
    this.updateOutputView();
  }

  handleChooseButton() {
    this.showView('project');
    this.initializeProjectView();
  }

  handleBackButton() {
    this.showView('output');
    this.toggleVisibility(this.elements.finalizeButton, false);
  }

  handleToggleSwitch() {
    if (this.state.currentProductIndex === 0) {
      this.updateProductPreview();
    }
  }

  handleProductDotClick(index) {
    this.state.currentProductIndex = index;
    this.updateProductPreview();
  }

  handleFinalizeButton() {
    if (this.state.currentProductIndex === 3) {
      this.showCompositionView();
    }
  }

  handleAddOutputButton() {
    this.showCameraView();
  }

  handleKeyboardFocus() {
    if (this.elements.container) {
      this.elements.container.classList.add('keyboard-active');
    }
  }

  handleKeyboardBlur() {
    if (this.elements.container) {
      this.elements.container.classList.remove('keyboard-active');
    }
  }

  // View management
  showView(viewName) {
    this.hideAllViews();
    this.state.currentView = viewName;

    // Manage camera stream based on view
    if (viewName === 'capture') {
      this.startCamera();
    } else {
      this.stopCamera();
    }

    switch (viewName) {
      case 'home':
        this.showHomeView();
        break;
      case 'capture':
        this.showCaptureView();
        break;
      case 'output':
        this.showOutputView();
        break;
      case 'project':
        this.showProjectView();
        break;
    }
  }

  hideAllViews() {
    const views = ['homeView', 'canvasWrapper', 'outputArea', 'nextStepLayout'];
    views.forEach(view => this.toggleVisibility(this.elements[view], false));
  }

  showHomeView() {
    this.toggleVisibility(this.elements.homeView, true, 'flex');
    this.toggleVisibility(this.elements.topBarText, false);
    this.toggleVisibility(this.elements.projectNameContainer, false);
    this.toggleVisibility(this.elements.backButton, false);
    this.toggleVisibility(this.elements.finalizeButton, false);
    this.toggleVisibility(this.elements.footerCaptureControls, false);
    this.toggleVisibility(this.elements.promptArea, false);
    this.toggleVisibility(this.elements.footerDivider, false);
  }

  showCaptureView() {
    this.toggleVisibility(this.elements.canvasWrapper, true, 'flex');
    this.toggleVisibility(this.elements.footerCaptureControls, true, 'flex');
    this.toggleVisibility(this.elements.footerDivider, true, 'block');
    
    // Reset any minimized states
    if (this.elements.canvasWrapper) {
      this.elements.canvasWrapper.classList.remove('minimized');
    }
    if (this.elements.canvasArea) {
      this.elements.canvasArea.classList.remove('small-preview');
    }
    if (this.elements.cameraVideo) {
      this.elements.cameraVideo.style.position = 'absolute';
      this.elements.cameraVideo.style.top = '0';
      this.elements.cameraVideo.style.left = '0';
      this.elements.cameraVideo.style.width = '100%';
      this.elements.cameraVideo.style.height = '100%';
      this.elements.cameraVideo.style.objectFit = 'cover';
      this.elements.cameraVideo.style.margin = '0';
      this.elements.cameraVideo.style.padding = '0';
    }
    
    this.startCamera();
    this.updateTopBar('Capture');
  }

  showOutputView() {
    // Hide the minimized capture view completely
    this.toggleVisibility(this.elements.canvasWrapper, false);
    
    // Remove minimized state classes
    if (this.elements.canvasWrapper) {
      this.elements.canvasWrapper.classList.remove('minimized');
    }
    if (this.elements.canvasArea) {
      this.elements.canvasArea.classList.remove('small-preview');
    }
    
    // Show output area as separate page
    this.toggleVisibility(this.elements.outputArea, true, 'flex');
    this.updateTopBar('Output');
    this.toggleVisibility(this.elements.promptArea, false);
  }

  showProjectView() {
    this.toggleVisibility(this.elements.nextStepLayout, true, 'flex');
    this.updateTopBar('Project 4 Stool');
    this.toggleVisibility(this.elements.backButton, true, 'flex');
    this.toggleVisibility(this.elements.projectNameContainer, false);
    this.toggleVisibility(this.elements.finalizeButton, true, 'flex');
  }

  showCompositionView() {
    this.hideProjectViews();
    this.toggleVisibility(this.elements.compositionView, true, 'block');
    this.initializeInteractiveComposition();
  }

  showCameraView() {
    this.hideProjectViews();
    this.toggleVisibility(this.elements.cameraCaptureView, true, 'flex');
    this.setCameraPreviewImages();
  }

  // Utility methods
  toggleVisibility(element, show, displayType = 'block') {
    if (!element) return;
    element.style.display = show ? displayType : 'none';
  }

  updateTopBar(text) {
    if (this.elements.topBarText) {
      this.elements.topBarText.textContent = text;
      this.elements.topBarText.style.display = 'inline';
    }
    if (this.elements.projectNameContainer) {
      this.elements.projectNameContainer.style.display = 'flex';
    }
  }

  getNextIndex(current, length, direction) {
    return (current + direction + length) % length;
  }

  resetState() {
    this.state.currentOutputIndex = 0;
    this.state.currentProductIndex = 0;
    this.state.selectedFile = null;
    
    // Reset UI elements
    if (this.elements.previewImage) {
      this.elements.previewImage.src = '';
      this.elements.previewImage.style.display = 'none';
    }
    if (this.elements.placeholderText) {
      this.elements.placeholderText.style.display = 'block';
    }
    if (this.elements.forwardButton) {
      this.elements.forwardButton.classList.remove('enabled');
    }
    
    // Reset minimized states
    if (this.elements.canvasWrapper) {
      this.elements.canvasWrapper.classList.remove('minimized');
    }
    if (this.elements.canvasArea) {
      this.elements.canvasArea.classList.remove('small-preview');
    }
  }

  // File handling
  loadPreview(file) {
    if (!file || !this.elements.previewImage) return;

    const url = URL.createObjectURL(file);
    this.elements.previewImage.src = url;
    this.elements.previewImage.style.display = 'block';
    
    if (this.elements.placeholderText) {
      this.elements.placeholderText.style.display = 'none';
    }
    
    this.enableForwardButton();
    this.stopCaptureAnimations();
    
    // Auto-populate prompt if it's empty
    this.autoPopulatePrompt();
  }

  autoPopulatePrompt() {
    if (this.elements.designPrompt && !this.elements.designPrompt.value.trim()) {
      // Use a default prompt or the one from the interface
      const defaultPrompt = "make a table from this material";
      this.elements.designPrompt.value = defaultPrompt;
    }
  }

  enableForwardButton() {
    if (this.elements.forwardButton) {
      this.elements.forwardButton.classList.add('enabled');
    }
  }

  stopCaptureAnimations() {
    if (this.elements.footerCaptureControls) {
      this.elements.footerCaptureControls.classList.add('image-loaded');
    }
  }

  // NEW: Camera handling
  startCamera() {
    if (this.state.cameraStream) {
      console.log('Camera already active');
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('Camera API not supported.');
      return;
    }

    console.log('Requesting camera...');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then((stream) => {
        console.log('Camera stream received', stream);
        this.state.cameraStream = stream;
        if (this.elements.cameraVideo) {
          this.elements.cameraVideo.srcObject = stream;
          this.elements.cameraVideo.style.display = 'block';
          this.elements.cameraVideo.style.background = 'transparent';
          this.elements.cameraVideo.style.zIndex = 10;
          this.elements.cameraVideo.play();
        }
        if (this.elements.placeholderText) {
          this.elements.placeholderText.style.display = 'none';
        }
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
      });
  }

  stopCamera() {
    if (this.state.cameraStream) {
      this.state.cameraStream.getTracks().forEach((track) => track.stop());
      this.state.cameraStream = null;
    }
    if (this.elements.cameraVideo) {
      this.elements.cameraVideo.style.display = 'none';
      this.elements.cameraVideo.srcObject = null;
    }
  }

  // Output management
  updateOutputView() {
    if (this.elements.outputImage && this.config.outputImages[this.state.currentOutputIndex]) {
      this.elements.outputImage.src = this.config.outputImages[this.state.currentOutputIndex];
      this.updateOutputDots();
    }
  }

  updateOutputDots() {
    this.elements.outputDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.state.currentOutputIndex);
    });
  }

  copyPromptText() {
    if (this.elements.designPromptTop && this.elements.designPrompt) {
      this.elements.designPromptTop.value = this.elements.designPrompt.value;
    }
    
    // If no prompt text exists, use default
    if (!this.elements.designPrompt?.value.trim() && this.elements.designPromptTop) {
      this.elements.designPromptTop.value = "make a table from this material";
    }
  }

  // Project view management
  initializeProjectView() {
    if (this.elements.selectedOutputPreview) {
      this.elements.selectedOutputPreview.src = this.config.outputImages[this.state.currentOutputIndex];
      this.elements.selectedOutputPreview.style.visibility = 'visible';
    }
    
    this.state.currentProductIndex = 0;
    this.updateProductPreview();
    this.updateProductDots();
  }

  updateProductPreview() {
    this.hideAllProductViews();
    this.updateSelectedPreviewImage();
    this.showCurrentProductView();
    this.updateProductDots();
  }

  hideAllProductViews() {
    const views = [
      'threedContainer', 'instructionsView', 'addOutputView', 
      'compositionView', 'modelViewer', 'analysisImage', 
      'diagramsImage', 'toggleSwitchContainer'
    ];
    
    views.forEach(view => {
      if (this.elements[view]) {
        this.elements[view].style.display = 'none';
      }
    });

    const compositionView = document.getElementById('compositionView');
    if (compositionView) compositionView.style.display = 'none';
  }

  updateSelectedPreviewImage() {
    if (!this.elements.selectedOutputPreview) return;
    
    if (this.state.currentProductIndex === 3) {
      this.elements.selectedOutputPreview.src = 'assets/ComfyUI_00257_.png';
    } else {
      this.elements.selectedOutputPreview.src = 'assets/ComfyUI_00259_.png';
    }
  }

  showCurrentProductView() {
    const { currentProductIndex } = this.state;
    
    switch (currentProductIndex) {
      case 0: // 3D Model & Analysis Toggle
        this.show3DModelView();
        break;
      case 1: // Instructions
        this.toggleVisibility(this.elements.instructionsView, true, 'flex');
        break;
      case 2: // Diagrams
        this.showDiagramsView();
        break;
      case 3: // Add Output
        this.toggleVisibility(this.elements.addOutputView, true, 'flex');
        break;
    }
  }

  show3DModelView() {
    const threedContainer = document.querySelector('.threed-output-container');
    if (threedContainer) {
      threedContainer.style.display = 'flex';
    }
    
    this.toggleVisibility(this.elements.toggleSwitchContainer, true, 'block');
    
    if (this.elements.autoRotateToggle?.checked) {
      this.showModelViewer();
    } else {
      this.toggleVisibility(this.elements.analysisImage, true, 'block');
    }
  }

  showModelViewer() {
    if (!this.state.isModelViewerLoaded && window.loadModelViewerWhenNeeded) {
      window.loadModelViewerWhenNeeded();
      this.state.isModelViewerLoaded = true;
    }
    if (this.elements.modelViewer) {
      this.elements.modelViewer.style.display = 'block';
    }
  }

  showDiagramsView() {
    const threedContainer = document.querySelector('.threed-output-container');
    if (threedContainer) {
      threedContainer.style.display = 'flex';
    }
    this.toggleVisibility(this.elements.diagramsImage, true, 'block');
  }

  updateProductDots() {
    this.elements.productDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.state.currentProductIndex);
    });
  }

  hideProjectViews() {
    const views = [
      'threedContainer', 'instructionsView', 'addOutputView',
      'modelViewer', 'analysisImage', 'diagramsImage', 
      'toggleSwitchContainer', 'selectedOutputPreview'
    ];
    
    views.forEach(view => {
      if (this.elements[view]) {
        this.elements[view].style.display = 'none';
      }
    });

    if (this.elements.projectViewsContainer) {
      this.elements.projectViewsContainer.style.display = 'none';
    }
    if (this.elements.projectPagination) {
      this.elements.projectPagination.style.display = 'none';
    }
  }

  setCameraPreviewImages() {
    if (this.elements.cameraViewPreview1 && this.elements.selectedOutputPreview) {
      this.elements.cameraViewPreview1.src = this.elements.selectedOutputPreview.src;
    }
    if (this.elements.cameraViewPreview2 && this.elements.selectedOutputPreview) {
      this.elements.cameraViewPreview2.src = this.elements.selectedOutputPreview.src;
    }
  }

  // Create circular M characters
  createCircularMs() {
    const circles = document.querySelectorAll('.add-output-circle, .home-circle');
    
    circles.forEach(circle => {
      if (!circle) return;

      // Clear existing children
      while (circle.firstChild) {
        circle.removeChild(circle.firstChild);
      }

      const numMs = 12;
      const radius = circle.classList.contains('home-circle') ? 150 : 100;

      for (let i = 0; i < numMs; i++) {
        const angle = (i / numMs) * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        const mChar = document.createElement('div');
        mChar.classList.add('m-char');
        mChar.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        circle.appendChild(mChar);
      }
    });
  }

  // Interactive composition
  initializeInteractiveComposition() {
    const compositionViewer = document.getElementById('compositionViewer');
    if (!compositionViewer) return;

    if (window.loadCompositionViewerWhenNeeded) {
      window.loadCompositionViewerWhenNeeded();
    }

    this.createInteractiveModels(compositionViewer);
  }

  createInteractiveModels(container) {
    const modelContainer = document.createElement('div');
    modelContainer.className = 'model-container';
    container.appendChild(modelContainer);

    this.config.compositionModels.forEach((modelUrl, index) => {
      const modelViewer = this.createInteractiveModel(modelUrl, index);
      modelContainer.appendChild(modelViewer);
    });
  }

  createInteractiveModel(modelUrl, index) {
    const modelViewer = document.createElement('model-viewer');
    modelViewer.src = modelUrl;
    modelViewer.classList.add('interactive-model');
    modelViewer.setAttribute('camera-controls', '');
    modelViewer.setAttribute('auto-rotate', '');
    modelViewer.setAttribute('interaction-prompt', 'none');
    modelViewer.style.position = 'absolute';
    
    // Set initial position
    const angle = (index / this.config.compositionModels.length) * 2 * Math.PI;
    const radius = 200;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    modelViewer.style.transform = `translate3d(${x}px, 0, ${z}px)`;
    
    this.addModelInteractions(modelViewer, x, z);
    
    return modelViewer;
  }

  addModelInteractions(modelViewer, initialX, initialZ) {
    let isDragging = false;
    let startX, startY;
    let currentX = initialX;
    let currentZ = initialZ;

    const handleMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX - currentX;
      startY = e.clientY - currentZ;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      currentX = e.clientX - startX;
      currentZ = e.clientY - startY;
      
      modelViewer.style.transform = `translate3d(${currentX}px, 0, ${currentZ}px)`;
      this.checkCollisions(modelViewer, currentX, currentZ);
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    modelViewer.addEventListener('mousedown', handleMouseDown);
    modelViewer.addEventListener('mousemove', handleMouseMove);
    modelViewer.addEventListener('mouseup', handleMouseUp);
    modelViewer.addEventListener('mouseleave', handleMouseUp);
  }

  checkCollisions(currentModel, currentX, currentZ) {
    const modelContainer = currentModel.parentElement;
    const otherModels = Array.from(modelContainer.children).filter(m => m !== currentModel);
    
    otherModels.forEach(other => {
      const rect1 = currentModel.getBoundingClientRect();
      const rect2 = other.getBoundingClientRect();
      
      if (this.isColliding(rect1, rect2)) {
        const angle = Math.atan2(rect2.top - rect1.top, rect2.left - rect1.left);
        currentX += Math.cos(angle) * 10;
        currentZ += Math.sin(angle) * 10;
        currentModel.style.transform = `translate3d(${currentX}px, 0, ${currentZ}px)`;
      }
    });
  }

  isColliding(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
  }

  // Mouse follower
  initializeMouseFollower() {
    const mouseFollower = document.createElement('div');
    mouseFollower.classList.add('mouse-follower');
    document.body.appendChild(mouseFollower);

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    // Update mouse position
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth following animation
    const animateFollower = () => {
      const speed = 0.1;
      
      followerX += (mouseX - followerX) * speed;
      followerY += (mouseY - followerY) * speed;
      
      mouseFollower.style.left = followerX + 'px';
      mouseFollower.style.top = followerY + 'px';
      
      requestAnimationFrame(animateFollower);
    };
    
    animateFollower();

    // Click bounce effect
    document.addEventListener('click', () => {
      mouseFollower.classList.add('bounce');
      setTimeout(() => {
        mouseFollower.classList.remove('bounce');
      }, 300);
    });

    // Hover effects
    this.addMouseFollowerHovers(mouseFollower);
  }

  addMouseFollowerHovers(mouseFollower) {
    const interactiveElements = document.querySelectorAll(
      'button, .logo, .footer-button, .nav-btn, .choose-button'
    );
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        mouseFollower.classList.add('hover');
      });
      
      element.addEventListener('mouseleave', () => {
        mouseFollower.classList.remove('hover');
      });
    });
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.formatApp = new FormatApp();
});

// Expose for external access if needed
window.FormatApp = FormatApp;