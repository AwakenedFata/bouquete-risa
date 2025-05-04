document.addEventListener('DOMContentLoaded', function() {
  const modelViewer = document.getElementById('flower-model');
  const loadingOverlay = document.querySelector('.loading-overlay');
  const loadingText = document.querySelector('.loading-text');
  let loadingProgress = 0;
  
  // Try multiple model sources in case one fails
  const modelSources = [
    // Try GitHub raw content URL (update with your actual GitHub username and repo)
    "https://raw.githubusercontent.com/your-username/your-repo/main/models/flower_bouquet.glb",
    // Try relative path
    "models/flower_bouquet.glb",
    // Fallback to a sample model if all else fails
    "https://modelviewer.dev/shared-assets/models/Bouquet.glb"
  ];
  
  let currentSourceIndex = 0;
  
  function tryLoadModel() {
    if (currentSourceIndex >= modelSources.length) {
      // We've tried all sources, show error
      handleModelError("Couldn't load any model source");
      return;
    }
    
    const modelSource = modelSources[currentSourceIndex];
    console.log(`Trying to load model from: ${modelSource}`);
    
    modelViewer.src = modelSource;
    currentSourceIndex++;
  }
  
  function updateLoadingProgress(progress) {
    loadingProgress = Math.min(100, progress);
    loadingText.textContent = `tunggu bentar yh sayang... ${loadingProgress}%`;
  }
  
  function handleModelLoad() {
    console.log("Model loaded successfully!");
    loadingOverlay.classList.add('hidden');
    document.body.classList.remove('not-loaded');
  }
  
  function handleModelError(error) {
    console.error("Error loading model:", error);
    
    if (currentSourceIndex < modelSources.length) {
      console.log("Trying next model source...");
      tryLoadModel();
    } else {
      // Show error but still remove loading overlay after a delay
      setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        document.body.classList.remove('not-loaded');
        
        // Add fallback content
        const fallback = document.querySelector('.model-fallback');
        if (fallback) {
          fallback.innerHTML = '<p class="loading-error">Could not load 3D model.<br>But our love is still in full bloom! ❤️</p>';
        }
      }, 1000);
    }
  }
  
  // Listen for model-viewer events
  modelViewer.addEventListener('load', handleModelLoad);
  modelViewer.addEventListener('error', handleModelError);
  
  // Listen for progress events
  modelViewer.addEventListener('progress', (event) => {
    updateLoadingProgress(Math.floor(event.detail.totalProgress * 100));
  });
  
  // Start loading the first model source
  tryLoadModel();
  
  // Ensure loading overlay is removed even if events don't fire
  setTimeout(() => {
    if (loadingOverlay.classList.contains('hidden') === false) {
      console.log("Timeout reached, removing loading overlay");
      loadingOverlay.classList.add('hidden');
      document.body.classList.remove('not-loaded');
    }
  }, 15000);
  
  // Add falling petals animation
  const petalsContainer = document.querySelector('.petals-container');
  if (petalsContainer) {
    for (let i = 0; i < 15; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDuration = `${10 + Math.random() * 10}s`;
      petal.style.animationDelay = `${Math.random() * 10}s`;
      petalsContainer.appendChild(petal);
    }
  }
});
