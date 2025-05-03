// Initialize animations after page load
window.onload = () => {
  setTimeout(() => {
    document.body.classList.remove("not-loaded");
  }, 1000);
};

// Handle model loading and UI updates
document.addEventListener('DOMContentLoaded', function() {
  const model = document.getElementById('flower-model');
  const message = document.getElementById('message');
  const loadingOverlay = document.getElementById('loading-overlay');
  const loadingError = document.querySelector('.loading-error');
  
  // Set a timeout to detect if loading takes too long
  const loadingTimeout = setTimeout(() => {
    if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
      console.warn('Model loading timeout - showing error message');
      if (loadingError) {
        loadingError.style.display = 'block';
        loadingError.textContent = 'Loading timeout. Try refreshing the page or check your internet connection.';
      }
    }
  }, 15000); // 15 seconds timeout
  
  if (!model) {
    console.error('Model element not found!');
    return;
  }
  
  // Show loading progress
  model.addEventListener('progress', (event) => {
    const progress = Math.floor(event.detail.totalProgress * 100);
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
      loadingText.textContent = `tunggu bentar yh sayang... ${progress}%`;
    }
    console.log(`Loading progress: ${progress}%`);
  });
  
  // Hide loading overlay when model is loaded
  model.addEventListener('load', () => {
    clearTimeout(loadingTimeout);
    console.log('Model loaded successfully');
    
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
    }
    
    // Show message after model is loaded
    setTimeout(() => {
      if (message) {
        message.classList.add('show');
      }
    }, 1000);
  });
  
  // Handle loading errors
  model.addEventListener('error', (error) => {
    clearTimeout(loadingTimeout);
    console.error('Error loading model:', error);
    
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
      loadingText.textContent = 'Error memuat model.';
    }
    
    if (loadingError) {
      loadingError.style.display = 'block';
      
      // Try to provide more specific error information
      let errorMessage = 'Please check your internet connection and try again.';
      
      if (error.detail && error.detail.type) {
        if (error.detail.type.includes('CORS')) {
          errorMessage = 'CORS error: The model cannot be loaded from this source. Try hosting the model file on GitHub.';
        } else if (error.detail.type.includes('404')) {
          errorMessage = 'Model file not found. Check if the file exists and the path is correct.';
        } else if (error.detail.type.includes('network')) {
          errorMessage = 'Network error. Check your internet connection.';
        }
      }
      
      loadingError.textContent = `Error: ${errorMessage}`;
    }
    
    // Show a fallback image or content
    const modelContainer = document.querySelector('.model-container');
    if (modelContainer) {
      // Create a fallback element
      const fallback = document.createElement('div');
      fallback.className = 'model-fallback';
      fallback.innerHTML = '<p>❤️ Happy Graduation! ❤️</p>';
      
      // Insert before the model-viewer
      modelContainer.insertBefore(fallback, model);
      
      // Hide the model-viewer
      model.style.display = 'none';
    }
  });
  
  // Add this to force the model to load even if it's not visible
  model.setAttribute('loading', 'eager');
});

// Function to check if the site is running on GitHub Pages
function isGitHubPages() {
  return window.location.hostname.includes('github.io');
}