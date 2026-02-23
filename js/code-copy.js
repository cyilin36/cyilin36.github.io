(() => {
  const COPY_ICON = `
<svg aria-hidden="true" viewBox="0 0 16 16" class="copy-icon" width="16" height="16">
  <rect class="copy-rect copy-rect-back" x="1.25" y="5.25" width="9.5" height="9.5" rx="1.5"></rect>
  <rect class="copy-rect copy-rect-front" x="5.25" y="1.25" width="9.5" height="9.5" rx="1.5"></rect>
</svg>`;

  const CHECK_ICON = `
<svg aria-hidden="true" viewBox="0 0 16 16" class="copied-icon" width="16" height="16">
  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
</svg>`;

  function getCodeText(container) {
    const codeNode = container.querySelector('pre code') || container.querySelector('code');
    if (!codeNode) {
      return '';
    }
    return codeNode.innerText.replace(/\n$/, '');
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  function findCodeContainers() {
    const all = document.querySelectorAll(
      '.markdown-body .highlight, .markdown-body .chroma, .markdown-body pre'
    );

    return Array.from(all).filter(node => {
      if (node.matches('pre') && node.closest('.highlight, .chroma')) {
        return false;
      }
      return true;
    });
  }

  function bindCopyButton(container) {
    if (container.dataset.copyBound === 'true') {
      return;
    }
    container.dataset.copyBound = 'true';

    const text = getCodeText(container);
    if (!text) {
      return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy-button';
    button.setAttribute('aria-label', 'Copy code');
    button.innerHTML = COPY_ICON + CHECK_ICON;

    const feedback = document.createElement('span');
    feedback.className = 'code-copy-feedback';
    feedback.setAttribute('aria-live', 'polite');
    feedback.textContent = 'Copied!';

    container.classList.add('has-copy-button');

    let timerId;
    button.addEventListener('click', async () => {
      try {
        await copyToClipboard(getCodeText(container));
        button.classList.add('is-copied');
        feedback.classList.add('is-visible');
        clearTimeout(timerId);
        timerId = window.setTimeout(() => {
          button.classList.remove('is-copied');
          feedback.classList.remove('is-visible');
        }, 1800);
      } catch (_error) {
        button.classList.remove('is-copied');
        feedback.classList.remove('is-visible');
      }
    });

    container.appendChild(button);
    container.appendChild(feedback);
  }

  function initCodeCopy() {
    const containers = findCodeContainers();
    containers.forEach(bindCopyButton);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeCopy);
  } else {
    initCodeCopy();
  }
})();
