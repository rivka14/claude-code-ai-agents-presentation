/**
 * AI Agents Presentation - Interactive JavaScript
 * Modern presentation with keyboard navigation, touch support, and advanced features
 */

class PresentationController {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 7;
    this.isFullscreen = false;
    this.isPresentationMode = false;
    this.soundEnabled = true;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.cursorTimeout = null;
    this.isLoaded = false;
    
    // DOM elements
    this.presentation = document.getElementById('presentation');
    this.slides = document.querySelectorAll('.slide');
    this.navDots = document.querySelectorAll('.nav-dot');
    this.progressFill = document.querySelector('.progress-fill');
    this.soundToggle = document.getElementById('sound-toggle');
    this.loadingScreen = document.getElementById('loading-screen');
    this.controlsInfo = document.getElementById('controls-info');
    
    this.init();
  }
  
  /**
   * Initialize the presentation
   */
  init() {
    this.setupEventListeners();
    this.updateProgress();
    this.updateNavDots();
    this.setupParticles();
    this.handleInitialLoad();
    this.setupAccessibility();
  }
  
  /**
   * Handle initial page load with animation
   */
  handleInitialLoad() {
    // Simulate loading time
    setTimeout(() => {
      this.loadingScreen.classList.add('hidden');
      this.isLoaded = true;
      
      // Remove loading screen after transition
      setTimeout(() => {
        this.loadingScreen.style.display = 'none';
      }, 800);
      
      // Check for URL hash navigation
      this.handleHashNavigation();
      
      // Show initial slide animations
      this.triggerSlideAnimations(this.currentSlide);
    }, 2500);
  }
  
  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    
    // Touch navigation
    document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
    document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    
    // Navigation dots
    this.navDots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index + 1));
    });
    
    // Sound toggle
    this.soundToggle.addEventListener('click', () => this.toggleSound());
    
    // Mouse movement for presentation mode
    document.addEventListener('mousemove', () => this.handleMouseMove());
    
    // Window resize
    window.addEventListener('resize', () => this.handleResize());
    
    // Hash change for URL navigation
    window.addEventListener('hashchange', () => this.handleHashNavigation());
    
    // Fullscreen change
    document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('msfullscreenchange', () => this.handleFullscreenChange());
    
    // Prevent default touch behaviors that might interfere
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
  }
  
  /**
   * Handle keyboard navigation
   */
  handleKeyDown(event) {
    if (!this.isLoaded) return;
    
    switch (event.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        event.preventDefault();
        this.nextSlide();
        break;
        
      case 'ArrowLeft':
      case 'PageUp':
        event.preventDefault();
        this.previousSlide();
        break;
        
      case 'Home':
        event.preventDefault();
        this.goToSlide(1);
        break;
        
      case 'End':
        event.preventDefault();
        this.goToSlide(this.totalSlides);
        break;
        
      case 'f':
      case 'F':
        event.preventDefault();
        this.toggleFullscreen();
        break;
        
      case 'Escape':
        event.preventDefault();
        if (this.isFullscreen) {
          this.exitFullscreen();
        }
        this.exitPresentationMode();
        break;
        
      case 'p':
      case 'P':
        event.preventDefault();
        this.togglePresentationMode();
        break;
        
      // Number keys for direct slide navigation
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
        event.preventDefault();
        const slideNum = parseInt(event.key);
        if (slideNum <= this.totalSlides) {
          this.goToSlide(slideNum);
        }
        break;
    }
  }
  
  /**
   * Handle touch start
   */
  handleTouchStart(event) {
    if (!this.isLoaded) return;
    
    this.touchStartX = event.changedTouches[0].screenX;
    
    // Prevent default only for horizontal swipes
    if (Math.abs(event.changedTouches[0].screenX - this.touchStartX) > 10) {
      event.preventDefault();
    }
  }
  
  /**
   * Handle touch end
   */
  handleTouchEnd(event) {
    if (!this.isLoaded) return;
    
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }
  
  /**
   * Process swipe gestures
   */
  handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = this.touchEndX - this.touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swipe right - previous slide
        this.previousSlide();
      } else {
        // Swipe left - next slide
        this.nextSlide();
      }
    }
  }
  
  /**
   * Navigate to next slide
   */
  nextSlide() {
    if (this.currentSlide < this.totalSlides) {
      this.goToSlide(this.currentSlide + 1);
    }
  }
  
  /**
   * Navigate to previous slide
   */
  previousSlide() {
    if (this.currentSlide > 1) {
      this.goToSlide(this.currentSlide - 1);
    }
  }
  
  /**
   * Navigate to specific slide
   */
  goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > this.totalSlides || slideNumber === this.currentSlide) {
      return;
    }
    
    // Remove active class from current slide
    this.slides[this.currentSlide - 1].classList.remove('active');
    this.slides[this.currentSlide - 1].classList.add('prev');
    
    // Update current slide
    const previousSlide = this.currentSlide;
    this.currentSlide = slideNumber;
    
    // Add active class to new slide
    setTimeout(() => {
      this.slides[this.currentSlide - 1].classList.add('active');
      this.slides[this.currentSlide - 1].classList.remove('prev');
      
      // Clean up previous slide
      setTimeout(() => {
        this.slides[previousSlide - 1].classList.remove('prev');
      }, 800);
    }, 50);
    
    // Update UI elements
    this.updateProgress();
    this.updateNavDots();
    this.updateURL();
    this.triggerSlideAnimations(this.currentSlide);
    
    // Play transition sound
    this.playTransitionSound();
    
    // Announce slide change for screen readers
    this.announceSlideChange();
  }
  
  
  /**
   * Update progress bar
   */
  updateProgress() {
    const progress = (this.currentSlide / this.totalSlides) * 100;
    this.progressFill.style.width = `${progress}%`;
  }
  
  /**
   * Update navigation dots
   */
  updateNavDots() {
    this.navDots.forEach((dot, index) => {
      dot.classList.toggle('active', index + 1 === this.currentSlide);
    });
  }
  
  /**
   * Update URL with current slide hash
   */
  updateURL() {
    const newHash = `#slide${this.currentSlide}`;
    if (window.location.hash !== newHash) {
      history.replaceState(null, null, newHash);
    }
  }
  
  /**
   * Handle URL hash navigation
   */
  handleHashNavigation() {
    const hash = window.location.hash;
    const slideMatch = hash.match(/#slide(\\d+)/);
    
    if (slideMatch) {
      const slideNumber = parseInt(slideMatch[1]);
      if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
        this.goToSlide(slideNumber);
      }
    }
  }
  
  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen() {
    if (!this.isFullscreen) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }
  
  /**
   * Enter fullscreen mode
   */
  enterFullscreen() {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }
  
  /**
   * Exit fullscreen mode
   */
  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  
  /**
   * Handle fullscreen change events
   */
  handleFullscreenChange() {
    this.isFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
    
    this.presentation.classList.toggle('fullscreen', this.isFullscreen);
    
    if (this.isFullscreen) {
      this.enterPresentationMode();
    }
  }
  
  /**
   * Toggle presentation mode (auto-hide cursor)
   */
  togglePresentationMode() {
    if (!this.isPresentationMode) {
      this.enterPresentationMode();
    } else {
      this.exitPresentationMode();
    }
  }
  
  /**
   * Enter presentation mode
   */
  enterPresentationMode() {
    this.isPresentationMode = true;
    this.presentation.classList.add('presentation-mode');
    this.startCursorTimeout();
  }
  
  /**
   * Exit presentation mode
   */
  exitPresentationMode() {
    this.isPresentationMode = false;
    this.presentation.classList.remove('presentation-mode');
    this.clearCursorTimeout();
  }
  
  /**
   * Handle mouse movement in presentation mode
   */
  handleMouseMove() {
    if (this.isPresentationMode) {
      this.presentation.classList.remove('presentation-mode');
      this.startCursorTimeout();
    }
  }
  
  /**
   * Start cursor auto-hide timeout
   */
  startCursorTimeout() {
    this.clearCursorTimeout();
    this.cursorTimeout = setTimeout(() => {
      if (this.isPresentationMode) {
        this.presentation.classList.add('presentation-mode');
      }
    }, 3000);
  }
  
  /**
   * Clear cursor timeout
   */
  clearCursorTimeout() {
    if (this.cursorTimeout) {
      clearTimeout(this.cursorTimeout);
      this.cursorTimeout = null;
    }
  }
  
  /**
   * Toggle sound effects
   */
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.soundToggle.classList.toggle('muted', !this.soundEnabled);
    
    const icon = this.soundToggle.querySelector('i');
    icon.className = this.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
  }
  
  /**
   * Play transition sound effect
   */
  playTransitionSound() {
    if (!this.soundEnabled) return;
    
    // Create audio context for sound effects
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Fallback: no sound if audio context fails
      console.log('Audio context not supported');
    }
  }
  
  /**
   * Trigger slide-specific animations
   */
  triggerSlideAnimations(slideNumber) {
    const slide = this.slides[slideNumber - 1];
    
    // Reset animations
    const animatedElements = slide.querySelectorAll('[data-delay], .component-item, .technology-item, .description-content, .diagram-container');
    animatedElements.forEach(element => {
      element.style.animation = 'none';
      element.offsetHeight; // Trigger reflow
      element.style.animation = null;
    });
    
    // Specific animations for different slides
    switch (slideNumber) {
      case 2: // Agent components slide
        this.animateComponents(slide);
        break;
      case 3: // ETL description slide
        this.animateDescription(slide);
        break;
      case 4: // Architecture slide
        this.animateArchitecture(slide);
        break;
      case 5: // Technologies slide
        this.animateTechnologies(slide);
        break;
    }
  }
  
  /**
   * Animate agent components slide
   */
  animateComponents(slide) {
    const components = slide.querySelectorAll('.component-item');
    components.forEach((item, index) => {
      setTimeout(() => {
        item.style.transform = 'translateY(0) scale(1)';
        item.style.opacity = '1';
      }, index * 300);
    });
  }
  
  /**
   * Animate ETL description slide
   */
  animateDescription(slide) {
    const description = slide.querySelector('.description-content');
    if (description) {
      setTimeout(() => {
        description.style.transform = 'translateY(0)';
        description.style.opacity = '1';
      }, 200);
    }
  }
  
  /**
   * Animate architecture slide
   */
  animateArchitecture(slide) {
    const diagramContainer = slide.querySelector('.diagram-container');
    
    if (diagramContainer) {
      setTimeout(() => {
        diagramContainer.style.transform = 'translateY(0) scale(1)';
        diagramContainer.style.opacity = '1';
      }, 200);
    }
  }
  
  /**
   * Animate technologies slide
   */
  animateTechnologies(slide) {
    const technologies = slide.querySelectorAll('.technology-item');
    technologies.forEach((item, index) => {
      setTimeout(() => {
        item.style.transform = 'translateY(0) scale(1)';
        item.style.opacity = '1';
      }, index * 300);
    });
  }
  
  /**
   * Setup particle effects
   */
  setupParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    
    // Add random particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: ${i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#8a2be2' : '#00ffff'};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particleFloat ${3 + Math.random() * 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
        opacity: ${0.3 + Math.random() * 0.4};
      `;
      particlesContainer.appendChild(particle);
    }
  }
  
  /**
   * Handle window resize
   */
  handleResize() {
    // Recalculate positions if needed
    this.debounce(() => {
      // Responsive adjustments can be added here
    }, 250)();
  }
  
  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Set ARIA labels
    this.slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index + 1 !== this.currentSlide);
    });
    
    // Update aria-hidden on slide change  
    const originalGoToSlide = this.goToSlide.bind(this);
    this.goToSlide = function(slideNumber) {
      originalGoToSlide(slideNumber);
      
      this.slides.forEach((slide, index) => {
        slide.setAttribute('aria-hidden', index + 1 !== this.currentSlide);
      });
    }.bind(this);
  }
  
  /**
   * Announce slide changes for screen readers
   */
  announceSlideChange() {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    announcement.textContent = `Slide ${this.currentSlide} of ${this.totalSlides}`;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  /**
   * Utility: Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * Get current slide information
   */
  getCurrentSlideInfo() {
    return {
      current: this.currentSlide,
      total: this.totalSlides,
      title: this.slides[this.currentSlide - 1].querySelector('h1, h2').textContent,
      isFullscreen: this.isFullscreen,
      isPresentationMode: this.isPresentationMode
    };
  }
  
  /**
   * Add custom event listeners for external integration
   */
  addEventListener(event, callback) {
    document.addEventListener(`presentation-${event}`, callback);
  }
  
  /**
   * Dispatch custom events
   */
  dispatchEvent(event, data) {
    document.dispatchEvent(new CustomEvent(`presentation-${event}`, { detail: data }));
  }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.presentation = new PresentationController();
});

// Add additional CSS animations via JavaScript
const additionalStyles = `
  @keyframes particleFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
    25% { transform: translateY(-20px) rotate(90deg); opacity: 0.6; }
    50% { transform: translateY(-10px) rotate(180deg); opacity: 0.8; }
    75% { transform: translateY(-30px) rotate(270deg); opacity: 0.6; }
  }
  
  .particle {
    pointer-events: none;
  }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PresentationController;
}