import { trackModified, trackCreated } from './tracking.js';
import { getResourceUrl } from './utils.js';

// ===== MAIN FUNCTIONS =====

/**
 * Creates and applies the medieval year list design with single item navigation functionality
 */
export function redesignMedievalYearList() {
  try {
    const yearListContainer = document.querySelector('#year-list-container');

    if (!yearListContainer) return;
    yearListContainer.classList.remove('pl-5');
    const profileTimelineYearListContainer = yearListContainer
      .querySelectorAll('.js-profile-timeline-year-list')
      .item(1);

    if (!profileTimelineYearListContainer) return;

    profileTimelineYearListContainer.classList.remove('color-bg-default');

    const ulElement =
      profileTimelineYearListContainer.querySelector('ul.filter-list');

    if (!ulElement) return;

    const timeListBackground = getResourceUrl('assets/icon/time_list.png');

    // Apply medieval shield/scroll background và styling cho container
    profileTimelineYearListContainer.style.cssText = `
      background-image: url('${timeListBackground}');
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
      flex-direction: column;
      padding: 100px 140px 40px 90px;
      align-items: center;
      display: flex !important;
    `;

    // Create scrollable container for ul
    const scrollContainer = document.createElement('div');
    scrollContainer.style.cssText = `
      position: relative;
      z-index: 1;
      max-height: 200px;
      padding: 40px 0px 0px 50px;
    `;

    // Style scrollbar for webkit browsers
    const scrollbarStyle = document.createElement('style');
    scrollbarStyle.textContent = `
      .medieval-scroll::-webkit-scrollbar {
        width: 4px;
      }
      .medieval-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      .medieval-scroll::-webkit-scrollbar-thumb {
        background: #8B4513;
        border-radius: 2px;
      }
      .medieval-scroll::-webkit-scrollbar-thumb:hover {
        background: #A0522D;
      }
    `;
    document.head.appendChild(scrollbarStyle);
    scrollContainer.classList.add('medieval-scroll');

    // Move ul into scroll container
    ulElement.parentNode.insertBefore(scrollContainer, ulElement);
    scrollContainer.appendChild(ulElement);

    // Style ul element
    ulElement.style.cssText = `
      position: relative;
      z-index: 1;
      list-style: none;
      padding: 0;
      margin: 0;
    `;

    // Get all li elements and setup single item navigation
    const liElements = ulElement.querySelectorAll('li');
    const visibleItemsCount = 3; // Always show 3 items
    let startIndex = 0; // Index of the first visible item

    // Style all li elements - ban đầu ẩn tất cả
    liElements.forEach((li, index) => {
      li.style.cssText = `
        margin-bottom: 8px;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(0);
        display: none;
      `;

      const link = li.querySelector('a');
      if (link) {
        link.style.cssText = `
          display: block !important;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.2s ease;
        `;

        // Add hover effect
        link.addEventListener('mouseenter', () => {
          link.style.transform = 'scale(1.05)';
        });

        link.addEventListener('mouseleave', () => {
          link.style.transform = 'scale(1)';
        });
      }
    });

    // Function to show items based on startIndex
    function showItems() {
      console.log(
        'showItems called with startIndex:',
        startIndex,
        'total items:',
        liElements.length
      );

      // Ẩn tất cả items trước
      liElements.forEach((li) => {
        li.style.display = 'none';
        li.style.opacity = '0';
      });

      // Hiển thị 3 items bắt đầu từ startIndex
      for (let i = 0; i < visibleItemsCount; i++) {
        const itemIndex = startIndex + i;
        if (itemIndex < liElements.length && liElements[itemIndex]) {
          console.log('Showing item at index:', itemIndex);
          const li = liElements[itemIndex];
          li.style.display = 'block';
          // Sử dụng setTimeout để đảm bảo display được áp dụng trước opacity
          setTimeout(() => {
            li.style.opacity = '1';
          }, 10);
        }
      }

      // Scroll to first visible item
      if (liElements[startIndex]) {
        setTimeout(() => {
          liElements[startIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }
    }

    // Create navigation buttons container
    const navContainer = document.createElement('div');
    navContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 0px 0px 38px 50px;
      align-items: center;
    `;

    // Create Up button
    const upButton = document.createElement('button');
    upButton.innerHTML = '⬆️';
    upButton.style.cssText = `
      background: linear-gradient(145deg, #D2691E, #A0522D);
      border: 2px solid #8B4513;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      color: #FFF8DC;
      font-size: 12px;
      cursor: pointer;
      box-shadow: 0 3px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2);
      transition: all 0.2s ease;
      opacity: 0.5;
      display: none;
    `;

    // Create Down button
    const downButton = document.createElement('button');
    downButton.innerHTML = '⬇️';
    downButton.style.cssText = `
      background: linear-gradient(145deg, #D2691E, #A0522D);
      border: 2px solid #8B4513;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      color: #FFF8DC;
      font-size: 12px;
      cursor: pointer;
      box-shadow: 0 3px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2);
      transition: all 0.2s ease;
      opacity: 1;
      transform: scale(1);
    `;

    // Add hover effects for buttons
    [upButton, downButton].forEach((button) => {
      button.addEventListener('mouseenter', () => {
        if (!button.disabled) {
          button.style.transform = 'scale(1.1)';
          button.style.boxShadow =
            '0 4px 8px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.2)';
        }
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow =
          '0 3px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)';
      });
    });

    // Up button click handler - move up by 1 item
    upButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (startIndex > 0) {
        startIndex--;
        console.log('Up clicked - new startIndex:', startIndex);
        showItems();
        updateButtonStates();
      }
    });

    // Down button click handler - move down by 1 item
    downButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Kiểm tra xem có thể di chuyển xuống không (đảm bảo luôn có 3 items để show)
      const maxStartIndex = Math.max(0, liElements.length - visibleItemsCount);
      if (startIndex < maxStartIndex) {
        startIndex++;
        console.log(
          'Down clicked - new startIndex:',
          startIndex,
          'maxStartIndex:',
          maxStartIndex
        );
        showItems();
        updateButtonStates();
      }
    });

    // Function to update button states
    function updateButtonStates() {
      const maxStartIndex = Math.max(0, liElements.length - visibleItemsCount);

      console.log(
        'updateButtonStates - startIndex:',
        startIndex,
        'maxStartIndex:',
        maxStartIndex,
        'totalItems:',
        liElements.length
      );

      // Up button - hiển thị chỉ khi không ở đầu danh sách
      if (startIndex > 0) {
        upButton.style.display = 'block';
        upButton.style.opacity = '1';
        upButton.disabled = false;
      } else {
        upButton.style.display = 'none';
      }

      // Down button - hiển thị chỉ khi vẫn có thể di chuyển xuống
      if (startIndex < maxStartIndex) {
        downButton.style.display = 'block';
        downButton.style.opacity = '1';
        downButton.disabled = false;
      } else {
        downButton.style.display = 'none';
      }
    }

    // Add buttons to container (chỉ khi có nhiều hơn 3 items)
    if (liElements.length > visibleItemsCount) {
      navContainer.appendChild(upButton);
      navContainer.appendChild(downButton);
      profileTimelineYearListContainer.appendChild(navContainer);
    }

    // Initialize: Show first 3 items and update button states
    console.log('Initial setup - total items:', liElements.length);
    showItems(); // Hiển thị 3 items đầu tiên
    updateButtonStates(); // Cập nhật trạng thái button
  } catch (error) {
    console.error('❌ Error in redesignMedievalYearList:', error);
  }
}
