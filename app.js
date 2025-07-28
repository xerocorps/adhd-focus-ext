class FocusReaderPro {
  constructor() {
    this.settings = {
      global: true,
      bionic: true,
      highlight: true,
      beeline: false,
      ruler: false,
      spacing: false,
      focus: false
    };
    
    this.processed = new WeakSet();
    this.observer = null;
    this.rulerElement = document.getElementById('fr-ruler');
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupMutationObserver();
    this.applyTransformations();
  }

  setupEventListeners() {
    // Toggle controls
    document.getElementById('toggle-global').addEventListener('change', (e) => {
      this.settings.global = e.target.checked;
      this.applyTransformations();
    });

    document.getElementById('toggle-bionic').addEventListener('change', (e) => {
      this.settings.bionic = e.target.checked;
      this.applyTransformations();
    });

    document.getElementById('toggle-highlight').addEventListener('change', (e) => {
      this.settings.highlight = e.target.checked;
      this.applyTransformations();
    });

    document.getElementById('toggle-beeline').addEventListener('change', (e) => {
      this.settings.beeline = e.target.checked;
      this.applyTransformations();
    });

    document.getElementById('toggle-ruler').addEventListener('change', (e) => {
      this.settings.ruler = e.target.checked;
      this.toggleRuler();
    });

    document.getElementById('toggle-spacing').addEventListener('change', (e) => {
      this.settings.spacing = e.target.checked;
      this.applyTransformations();
    });

    document.getElementById('toggle-focus').addEventListener('change', (e) => {
      this.settings.focus = e.target.checked;
      this.toggleFocusMode();
    });

    // Mouse tracking for ruler
    document.addEventListener('mousemove', (e) => {
      if (this.settings.ruler && this.rulerElement && !this.rulerElement.classList.contains('hidden')) {
        this.updateRulerPosition(e.clientY);
      }
    });
  }

  setupMutationObserver() {
    this.observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldUpdate = true;
        }
      });
      if (shouldUpdate) {
        this.applyTransformations();
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  applyTransformations() {
    if (!this.settings.global) {
      this.resetTransformations();
      return;
    }

    const contentElement = document.getElementById('content');
    if (!contentElement) return;

    const paragraphs = contentElement.querySelectorAll('p');
    paragraphs.forEach((p, lineIndex) => {
      if (this.processed.has(p)) return;
      
      const originalText = p.textContent;
      const sentences = this.splitIntoSentences(originalText);
      
      let newHTML = '';
      sentences.forEach((sentence, sentenceIndex) => {
        if (sentence.trim()) {
          const words = sentence.trim().split(/\s+/);
          const processedWords = words.map(word => this.processWord(word, sentenceIndex));
          
          const sentenceClass = this.getSentenceClass(sentenceIndex, lineIndex);
          const spacingClass = this.settings.spacing ? 'fr-extra-spacing' : '';
          
          newHTML += `<span class="fr-sentence ${sentenceClass} ${spacingClass}">${processedWords.join(' ')}</span> `;
        }
      });
      
      p.innerHTML = newHTML;
      this.processed.add(p);
    });
  }

  processWord(word, sentenceIndex) {
    if (!word || word.length === 0) return word;
    
    let processedWord = word;
    
    // Apply bionic reading
    if (this.settings.bionic) {
      const boldCount = Math.max(1, Math.floor(word.length * 0.4));
      const boldPart = word.substring(0, boldCount);
      const normalPart = word.substring(boldCount);
      processedWord = `<strong>${boldPart}</strong>${normalPart}`;
    }
    
    return processedWord;
  }

  getSentenceClass(sentenceIndex, lineIndex) {
    let classes = [];
    
    // Alternating highlights
    if (this.settings.highlight) {
      const highlightIndex = sentenceIndex % 3;
      classes.push(`fr-highlight-${highlightIndex}`);
    }
    
    // BeeLine gradient effect (using different text colors)
    if (this.settings.beeline) {
      const beelineIndex = lineIndex % 3;
      classes.push(`fr-beeline-${beelineIndex}`);
    }
    
    return classes.join(' ');
  }

  splitIntoSentences(text) {
    // Simple sentence splitting - can be improved
    return text.split(/(?<=[.!?])\s+/);
  }

  toggleRuler() {
    if (!this.rulerElement) return;
    
    if (this.settings.ruler) {
      this.rulerElement.classList.remove('hidden');
    } else {
      this.rulerElement.classList.add('hidden');
    }
  }

  updateRulerPosition(mouseY) {
    if (this.rulerElement && !this.rulerElement.classList.contains('hidden')) {
      const scrollY = window.scrollY;
      const rulerY = mouseY + scrollY - 20; // Offset for better reading experience
      this.rulerElement.style.top = `${rulerY}px`;
    }
  }

  toggleFocusMode() {
    const mediaElements = document.querySelectorAll('img, video, iframe, svg, canvas');
    
    if (this.settings.focus) {
      mediaElements.forEach(el => el.classList.add('fr-dim'));
    } else {
      mediaElements.forEach(el => el.classList.remove('fr-dim'));
    }
  }

  resetTransformations() {
    // Reset all processed paragraphs
    const contentElement = document.getElementById('content');
    if (!contentElement) return;

    const paragraphs = contentElement.querySelectorAll('p');
    paragraphs.forEach(p => {
      if (this.processed.has(p)) {
        // Get original text from spans
        const sentences = p.querySelectorAll('.fr-sentence');
        let originalText = '';
        sentences.forEach(sentence => {
          const text = sentence.textContent || sentence.innerText;
          originalText += text + ' ';
        });
        
        p.innerHTML = originalText.trim();
        this.processed.delete(p);
      }
    });

    // Hide ruler
    if (this.rulerElement) {
      this.rulerElement.classList.add('hidden');
    }

    // Remove focus mode
    const mediaElements = document.querySelectorAll('.fr-dim');
    mediaElements.forEach(el => el.classList.remove('fr-dim'));
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new FocusReaderPro();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FocusReaderPro();
  });
} else {
  new FocusReaderPro();
}