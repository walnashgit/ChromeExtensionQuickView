let previewDelay = 1000; // Default delay of 1 second
let currentPreview = null;
let previewTimer = null;
let activeLink = null;
let lastMousePosition = { x: 0, y: 0 };

chrome.storage.sync.get('previewDelay', (data) => {
  if (data.previewDelay) {
    previewDelay = data.previewDelay;
  }
  console.log('Preview delay set to:', previewDelay);
});

document.addEventListener('mouseover', (event) => {
  if (event.target.tagName === 'A' && !currentPreview) {
    console.log('Hovering over a link:', event.target.href);
    activeLink = event.target;
    lastMousePosition = { x: event.clientX, y: event.clientY };
    previewTimer = setTimeout(() => {
      createPreview(activeLink);
    }, previewDelay);
  }
});

document.addEventListener('mousemove', (event) => {
  lastMousePosition = { x: event.clientX, y: event.clientY };
  if (currentPreview) {
    try {
      const previewRect = currentPreview.getBoundingClientRect();
      if (!activeLink) {
        console.error('activeLink is null');
        removePreview();
        return;
      }
      const linkRect = activeLink.getBoundingClientRect();
      const buffer = 10; // 10px buffer around link and preview

      const isOverLink = (
        event.clientX >= linkRect.left - buffer &&
        event.clientX <= linkRect.right + buffer &&
        event.clientY >= linkRect.top - buffer &&
        event.clientY <= linkRect.bottom + buffer
      );

      const isOverPreview = (
        event.clientX >= previewRect.left - buffer &&
        event.clientX <= previewRect.right + buffer &&
        event.clientY >= previewRect.top - buffer &&
        event.clientY <= previewRect.bottom + buffer
      );

      if (!isOverLink && !isOverPreview) {
        removePreview();
      }
    } catch (error) {
      console.error('Error in mousemove event:', error);
      removePreview();
    }
  }
});

function createPreview(link) {
  console.log('Creating preview for:', link.href);
  removePreview(); // Remove any existing preview

  const preview = document.createElement('div');
  preview.className = 'link-preview';
  
  // Set initial position off-screen
  preview.style.left = '-9999px';
  preview.style.top = '-9999px';

  const iframe = document.createElement('iframe');
  iframe.src = link.href;

  preview.appendChild(iframe);
  document.body.appendChild(preview);
  currentPreview = preview;

  // Position the preview after it's been added to the DOM
  positionPreview(preview);

  console.log('Preview created and added to the page', preview);
}

function positionPreview(preview) {
  const previewRect = preview.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = lastMousePosition.x + 20; // 20px to the right of the cursor
  let top = lastMousePosition.y + 20; // 20px below the cursor

  // Adjust horizontal position if it goes off-screen
  if (left + previewRect.width > viewportWidth) {
    left = viewportWidth - previewRect.width - 10; // 10px margin from right edge
  }

  // Adjust vertical position if it goes off-screen
  if (top + previewRect.height > viewportHeight) {
    top = viewportHeight - previewRect.height - 10; // 10px margin from bottom edge
  }

  // Ensure the preview doesn't go off the left or top edge
  left = Math.max(10, left); // At least 10px from left edge
  top = Math.max(10, top); // At least 10px from top edge

  preview.style.left = `${left}px`;
  preview.style.top = `${top}px`;
}

function removePreview() {
  if (currentPreview) {
    console.log('Removing preview', currentPreview);
    currentPreview.remove();
    currentPreview = null;
    activeLink = null;
    console.log('Existing preview removed');
  } else {
    console.log('No preview to remove');
  }
}

console.log('Content script loaded');
