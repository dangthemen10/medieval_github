export function setupDragScroll(container, scrollableArea) {
  // Hàm setup drag scroll với giới hạn phù hợp với kích thước mới
  let isDragging = false;
  let dragTarget = null;
  let startX = 0;
  let startY = 0;
  let scrollLeft = 0;
  let scrollTop = 0;

  // Tính toán kích thước mới
  const containerWidth = 700;
  const containerHeight = 430;
  const scrollableWidth = 900;
  const scrollableHeight = 600;

  const maxDragX = 48;
  const maxDragY = 1;

  let currentX = -(scrollableWidth - containerWidth) / 2;
  let currentY = -(scrollableHeight - containerHeight) / 2;

  scrollableArea.style.transform = `translate(${currentX}px, ${currentY}px)`;

  container.addEventListener('mousedown', (e) => {
    if (e.target.closest('.castle-container')) return;

    isDragging = true;
    container.style.cursor = 'grabbing';

    startX = e.clientX;
    startY = e.clientY;
    scrollLeft = currentX;
    scrollTop = currentY;

    e.preventDefault();
  });

  container.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      container.style.cursor = 'grab';
    }
  });

  container.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      container.style.cursor = 'grab';
    }
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    e.preventDefault();
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const newX = scrollLeft + deltaX;
    const newY = scrollTop + deltaY;

    const centerX = -(scrollableWidth - containerWidth) / 2;
    const centerY = -(scrollableHeight - containerHeight) / 2;

    currentX = Math.max(Math.min(newX, centerX + maxDragX), centerX - maxDragX);
    currentY = Math.max(Math.min(newY, centerY + maxDragY), centerY - maxDragY);

    scrollableArea.style.transform = `translate(${currentX}px, ${currentY}px)`;
  });

  // Touch support
  container.addEventListener('touchstart', (e) => {
    if (e.target.closest('.castle-container')) return;

    isDragging = true;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    scrollLeft = currentX;
    scrollTop = currentY;
    e.preventDefault();
  });

  container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    const newX = scrollLeft + deltaX;
    const newY = scrollTop + deltaY;

    const centerX = -(scrollableWidth - containerWidth) / 2;
    const centerY = -(scrollableHeight - containerHeight) / 2;

    currentX = Math.max(Math.min(newX, centerX + maxDragX), centerX - maxDragX);
    currentY = Math.max(Math.min(newY, centerY + maxDragY), centerY - maxDragY);

    scrollableArea.style.transform = `translate(${currentX}px, ${currentY}px)`;
  });

  container.addEventListener('touchend', () => {
    isDragging = false;
  });
}
