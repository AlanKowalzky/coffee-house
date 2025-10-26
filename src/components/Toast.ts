export function showToast(message: string, type: 'info' | 'success' | 'error' = 'info', duration = 3500): void {
  try {
    const containerId = 'toast-container';
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.position = 'fixed';
      container.style.top = '16px';
      container.style.right = '16px';
      container.style.zIndex = '100000';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '8px';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.minWidth = '200px';
    toast.style.padding = '10px 14px';
    toast.style.borderRadius = '6px';
    toast.style.color = '#fff';
    toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.15)';
    toast.style.fontSize = '13px';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 200ms ease, transform 200ms ease';

    if (type === 'success') toast.style.background = '#2ecc71';
    else if (type === 'error') toast.style.background = '#e74c3c';
    else toast.style.background = '#34495e';

    toast.textContent = message;
    container.appendChild(toast);

    // animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // remove after duration
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        toast.remove();
        // remove container if empty
        if (container && container.childElementCount === 0) container.remove();
      }, 220);
    }, duration);
  } catch {
    try { console.log(message); } catch {
      // ignore
    }
  }
}
