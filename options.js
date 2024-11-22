document.addEventListener('DOMContentLoaded', () => {
  const delayInput = document.getElementById('delay');
  const saveButton = document.getElementById('save');

  chrome.storage.sync.get('previewDelay', (data) => {
    if (data.previewDelay) {
      delayInput.value = data.previewDelay;
    }
  });

  saveButton.addEventListener('click', () => {
    const delay = parseInt(delayInput.value, 10);
    chrome.storage.sync.set({ previewDelay: delay }, () => {
      alert('Settings saved!');
    });
  });
});
