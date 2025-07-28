/**
 * Applies bolding to the first few letters of a word.
 * @param {string} text The input text.
 * @returns {string} The text with bolded starts.
 */
function boldenWordStarts(text) {
  // Bolds the first 2 or 3 letters of a word.
  return text.replace(/\b(\w{2,3})/g, '<b>$1</b>');
}

/**
 * Processes a string of text, splitting it into sentences and applying different styles.
 * @param {string} text The text content to process.
 * @returns {DocumentFragment|HTMLElement|null} A node containing the processed sentences or null.
 */
function processText(text) {
  // Regex to split on punctuation followed by whitespace or end-of-string.
  // This avoids splitting on things like "DS.Store" or "example.com".
  const parts = text.split(/([.!?](?:\s+|$))/g);

  // If no sentence-ending punctuation is found, process the whole node as one chunk.
  if (parts.length <= 1) {
    const wrapper = document.createElement('span');
    // Apply the first style (bionic reading) to the whole text.
    wrapper.innerHTML = boldenWordStarts(text);
    return wrapper;
  }

  // Use a DocumentFragment to avoid adding an extra wrapper span to the DOM.
  const fragment = document.createDocumentFragment();
  let sentenceIndex = 0;

  // The split results in an array of [sentence, delimiter, sentence, delimiter, ...].
  // We iterate through these pairs.
  for (let i = 0; i < parts.length; i += 2) {
    const sentenceText = parts[i];
    const delimiter = parts[i + 1] || ''; // The punctuation and space after the sentence.

    // Skip empty parts that can result from the split.
    if (!sentenceText) {
        if(delimiter) {
            fragment.appendChild(document.createTextNode(delimiter));
        }
        continue;
    }

    const mode = sentenceIndex % 3; // 0 = bold, 1 = highlight, 2 = plain
    const span = document.createElement('span');
    let html = sentenceText;

    // Mode 0: Apply bionic reading style.
    if (mode === 0) {
      html = boldenWordStarts(sentenceText);
    }
    span.innerHTML = html;

    // Mode 1: Apply a light yellow background highlight.
    if (mode === 1) {
      span.style.backgroundColor = '#FFFACD'; // Light yellow
      span.style.padding = '0 2px';
      span.style.display = 'inline-block';
      span.style.marginBottom = '2px';
    }

    fragment.appendChild(span);
    // Append the original delimiter (e.g., ". ", "!", "?  \n").
    fragment.appendChild(document.createTextNode(delimiter));
    
    sentenceIndex++;
  }

  return fragment;
}


/**
 * Traverses the DOM and applies the focus-assisting text transformations
 * to block-level elements.
 */
function applyFocus() {
  // Check if the transformations have already been applied to avoid re-processing.
  if (document.body.dataset.focusreaderApplied === 'true') return;
  document.body.dataset.focusreaderApplied = 'true';

  // Select common block-level elements that contain readable text.
  const selector = 'p, li, h1, h2, h3, h4, h5, h6, dd, dt, blockquote';
  const elements = document.querySelectorAll(selector);

  // Tags that should cause an element to be skipped if they appear inside.
  const tagsToExclude = ['PRE', 'CODE', 'TEXTAREA', 'A'];

  elements.forEach(element => {
    // Skip if the element is empty or contains excluded tags.
    if (!element.textContent.trim()) {
        return;
    }
    
    // Check for excluded child elements.
    let hasExcludedTag = false;
    for (const tag of tagsToExclude) {
        if (element.querySelector(tag)) {
            hasExcludedTag = true;
            break;
        }
    }
    if (hasExcludedTag) {
        return;
    }

    // Process the text content of the element.
    const replacement = processText(element.textContent);
    
    if (replacement) {
      // Clear the original element and append the new, styled content.
      element.innerHTML = '';
      element.appendChild(replacement);
    }
  });
}

/**
 * Removes the focus transformations by reloading the page.
 */
function removeFocus() {
  // Check if transformations were applied before reloading.
  if (document.body.dataset.focusreaderApplied !== 'true') return;
  // The simplest way to revert all DOM changes is to reload the page.
  location.reload();
}

// Listen for messages from the service worker (for manual toggling via the icon).
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'ENABLE') {
    applyFocus();
  } else if (msg.action === 'DISABLE') {
    removeFocus();
  }
});

// --- Main Execution ---
// This self-executing function runs as soon as the script is injected.
(function() {
  // Check chrome.storage to see if the extension is enabled.
  chrome.storage.local.get('enabled', (data) => {
    // If enabled, apply the focus transformations automatically.
    if (data.enabled) {
      applyFocus();
    }
  });
})();