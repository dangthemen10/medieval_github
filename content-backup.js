// Từ điển thuật ngữ Trung Cổ
const medievalTerms = {
  'Pull requests': 'Nhiệm vụ',
  Repositories: 'Vương quốc',
  Organization: 'Bang hội',
  Organizations: 'Danh Sách Bang hội',
  Issues: 'Thỉnh nguyện thư',
  Commits: 'Lời thề',
  Merged: 'Liên minh',
  Fork: 'Nhánh của vương quốc',
  Star: 'Vương miện',
  Watch: 'Gián điệp',
  Owner: 'Quốc vương',
  Admin: 'Công tước',
  Contributor: 'Kỵ sĩ',
  Member: 'Dân làng',
  Release: 'Chiếu chỉ Hoàng gia',
  Releases: 'Chiếu chỉ Hoàng gia',
  Discussion: 'Hội đồng Hoàng gia',
  Home: 'Thành trì',
  Dashboard: 'Bản đồ vương quốc',
  'Top repositories': 'Vương quốc hùng mạnh',
  'Your teams': 'Hội hiệp sĩ',
  Code: 'Bản thánh chỉ',
  Actions: 'Hành động chiến trận',
  Projects: 'Chiến dịch',
  Security: 'Bảo vệ thành trì',
  Insights: 'Lời tiên tri',
  Settings: 'Chỉnh trị vương quốc',
  Unwatch: 'Ngừng do thám',
  'Your profile': 'Chân dung Bá tước',
  'Your repositories': 'Vương quốc của người',
  'Your Copilot': 'Cố vấn hoàng gia',
  'Your projects': 'Chiến dịch của người',
  'Your stars': 'Vương miện đã ban',
  'Your gists': 'Bí kíp hoàng gia',
  'GitHub Website': 'Lâu đài GitHub',
  'GitHub Docs': 'Thư viện Hoàng gia',
  'GitHub Support': 'Sứ giả hoàng gia',
  'GitHub Community': 'Công hội lập trình',
  'Sign out': 'Thoái vị',
  'Your organizations': 'Bang hội của người',
  'Your sponsors': 'Nhà tài trợ hoàng gia',
  'Your enterprises': 'Thương hội hùng mạnh',
  'Try Enterprise': 'Dùng thử thương hội',
  'Feature preview': 'Báo cáo của Ngự sử',
  'Latest changes': 'Sắc lệnh mới nhất',
  'Explore repositories': 'Phiêu lưu khám phá vương quốc',
  Filter: 'Tìm kiếm cổ thư',
  Wiki: 'Sử thi vương quốc',
  'Popular repositories': 'KINGDOMS',
};

function replaceSvgIcon(parent, original) {
  if (!parent) return;

  let svgElement = parent.querySelector('svg');
  if (svgElement && svgElement.parentNode === parent) {
    let newIcon = document.createElement('img');
    newIcon.src = chrome.runtime.getURL(
      `icon/${original.toLowerCase().replace(/\s+/g, '-')}.png`
    );
    newIcon.style.width = '16px';
    newIcon.style.height = '16px';
    newIcon.style.marginRight = '5px';

    parent.replaceChild(newIcon, svgElement);
  }
}

let isDragging = false;
let dragTarget = null;
let startX = 0;
let startY = 0;
let scrollLeft = 0;
let scrollTop = 0;

// Mảng các tọa độ cố định cho castles
const castlePositions = [
  { x: 25, y: 40 },
  { x: 50, y: 38 },
  { x: 76, y: 36 },
  { x: 80, y: 75 },
  { x: 12, y: 75 },
  { x: 40, y: 70 },
  { x: 20, y: 75 },
  { x: 50, y: 80 },
  { x: 80, y: 75 },
  { x: 35, y: 65 },
];

// Mảng màu sắc cho các lá cờ
const flagColors = [
  { primary: '#FF6B6B', secondary: '#FFE66D', accent: '#4ECDC4' },
  { primary: '#A8E6CF', secondary: '#88D8C0', accent: '#FFD93D' },
  { primary: '#6C5CE7', secondary: '#A29BFE', accent: '#FD79A8' },
  { primary: '#FD79A8', secondary: '#FDCB6E', accent: '#6C5CE7' },
  { primary: '#00B894', secondary: '#00CEC9', accent: '#55A3FF' },
  { primary: '#E17055', secondary: '#FDCB6E', accent: '#A29BFE' },
  { primary: '#FF7675', secondary: '#74B9FF', accent: '#00B894' },
  { primary: '#FDCB6E', secondary: '#E84393', accent: '#00CEC9' },
  { primary: '#74B9FF', secondary: '#FD79A8', accent: '#00B894' },
  { primary: '#55A3FF', secondary: '#FF6B6B', accent: '#FFE66D' },
];

// Hàm tạo castle image element
function createCastleImage() {
  const castleImg = document.createElement('img');
  castleImg.src = chrome.runtime.getURL('icon/castle.png');
  castleImg.alt = 'Castle';
  castleImg.style.cssText = `
      width: 120px;
      height: 120px;
      object-fit: contain;
      transition: all 0.3s ease;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
    `;
  return castleImg;
}

// Hàm tạo lá cờ với animation
function createFlag(
  index,
  repoName,
  repoDesc,
  repoLang,
  starsCount,
  forksCount
) {
  const colors = flagColors[index % flagColors.length];

  const flagContainer = document.createElement('div');
  flagContainer.className = 'flag-container';
  flagContainer.style.cssText = `
      position: absolute;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 15;
      pointer-events: none;
    `;

  // Cọc cờ
  const flagPole = document.createElement('div');
  flagPole.className = 'flag-pole';
  flagPole.style.cssText = `
      width: 3px;
      height: 80px;
      background: linear-gradient(to bottom, #8B4513, #D2691E);
      position: relative;
      margin: 0 auto;
      border-radius: 2px;
      box-shadow: inset 0 0 3px rgba(0,0,0,0.3);
    `;

  // Lá cờ chính
  const flag = document.createElement('div');
  flag.className = 'medieval-flag';
  flag.style.cssText = `
      position: absolute;
      top: 5px;
      left: 3px;
      width: 100px;
      height: 60px;
      background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%);
      clip-path: polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%);
      border: 2px solid rgba(139, 69, 19, 0.6);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transform-origin: left center;
      animation: flagWave 3s ease-in-out infinite;
    `;

  // Nội dung thông tin trên cờ
  const flagContent = document.createElement('div');
  flagContent.className = 'flag-content';
  flagContent.innerHTML = `
      <div class="flag-title">${repoName}</div>
      <div class="flag-desc">${repoDesc || 'Vương quốc bí ẩn'}</div>
      <div class="flag-stats">
        <span class="flag-lang">${repoLang}</span>
        <span class="flag-metrics">⭐${starsCount} 🔱${forksCount}</span>
      </div>
    `;
  flagContent.style.cssText = `
      position: absolute;
      top: 50%;
      left: 8px;
      transform: translateY(-50%);
      color: #fff;
      font-family: 'Cinzel', serif;
      font-size: 9px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
      width: 70px;
      pointer-events: none;
    `;

  // Thêm kiểu cho các phần tử trong flag
  const flagStyle = document.createElement('style');
  flagStyle.textContent = `
      @keyframes flagWave {
        0%, 100% { 
          transform: rotateY(0deg) skewX(0deg); 
          filter: brightness(1);
        }
        25% { 
          transform: rotateY(-2deg) skewX(1deg); 
          filter: brightness(1.1);
        }
        50% { 
          transform: rotateY(0deg) skewX(-1deg); 
          filter: brightness(0.95);
        }
        75% { 
          transform: rotateY(2deg) skewX(0.5deg); 
          filter: brightness(1.05);
        }
      }
      
      .flag-title {
        font-weight: bold;
        font-size: 12px;
        margin-bottom: 2px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      
      .flag-desc {
        font-style: italic;
        font-size: 8px;
        margin-bottom: 3px;
        opacity: 0.9;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      
      .flag-stats {
        display: flex;
        justify-content: space-between;
        font-size: 7px;
        font-weight: bold;
      }
      
      .flag-lang {
        background: rgba(255,255,255,0.2);
        padding: 1px 3px;
        border-radius: 2px;
      }
      
      .flag-metrics {
        opacity: 0.9;
      }
      
      .medieval-flag:hover {
        animation-duration: 1.5s;
        filter: brightness(1.2) !important;
        transform: scale(1.05);
      }
    `;

  if (!document.querySelector('#flag-styles')) {
    flagStyle.id = 'flag-styles';
    document.head.appendChild(flagStyle);
  }

  // Tạo hiệu ứng gió nhẹ cho cọc cờ
  flagPole.style.animation = 'poleWave 4s ease-in-out infinite';
  const poleStyle = document.createElement('style');
  poleStyle.textContent = `
      @keyframes poleWave {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(0.5deg); }
        75% { transform: rotate(-0.5deg); }
      }
    `;

  if (!document.querySelector('#pole-styles')) {
    poleStyle.id = 'pole-styles';
    document.head.appendChild(poleStyle);
  }

  // Thêm trang trí cho đỉnh cọc cờ
  const flagTop = document.createElement('div');
  flagTop.style.cssText = `
      position: absolute;
      top: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 8px;
      height: 8px;
      background: radial-gradient(circle, #FFD700, #FFA500);
      border-radius: 50%;
      border: 1px solid #B8860B;
      box-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
    `;

  // Lắp ráp các phần tử
  flag.appendChild(flagContent);
  flagPole.appendChild(flagTop);
  flagContainer.appendChild(flagPole);
  flagContainer.appendChild(flag);

  return flagContainer;
}

/**
 * START redesignProfileSection
 */
function redesignProfileSection() {
  const layoutSideBarContainer = document.querySelector('.Layout-sidebar');
  if (!layoutSideBarContainer) {
    console.warn('Profile container not found');
    return;
  }
  layoutSideBarContainer.style.cssText = `
    margin: -10px;
    width: 350px;
  `;
  layoutSideBarContainer.childNodes[1].style.cssText = `
    margin-top: 0px !important;
  `;

  const profileContainer = document.querySelector(
    '.js-profile-editable-replace'
  );

  if (!profileContainer) {
    console.warn('Profile container not found');
    return;
  }

  const frameAvatarBackground = chrome.runtime.getURL('icon/frame_avt.png');

  // Lấy element đầu tiên (index 1 - nodeChild thứ hai)
  const targetElement = profileContainer.childNodes[1];

  if (!targetElement) {
    console.warn('Target element not found');
    return;
  }

  // Lấy thông tin từ vcard-names-container
  const vcardContainer = document.querySelector('.vcard-names-container');
  let nameInfo = null;

  if (vcardContainer) {
    const fullName = vcardContainer
      .querySelector('.vcard-fullname')
      ?.textContent?.trim();
    const username = vcardContainer
      .querySelector('.vcard-username')
      ?.textContent?.trim();

    nameInfo = {
      fullName: fullName || '',
      username: username || '',
    };

    // Ẩn container gốc để tránh hiển thị trùng lặp
    vcardContainer.style.display = 'none';
  }

  // Apply styles cho targetElement
  targetElement.style.cssText = `
    background-image: url('${frameAvatarBackground}');
    background-size: 150% 100%;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    width: 360px;
    height: 498px;
    padding: 32px 113px 60px 78px;
    align-items: center;
  `;

  // Tạo container cho thông tin tên
  if (nameInfo && (nameInfo.fullName || nameInfo.username)) {
    const nameContainer = document.createElement('div');
    nameContainer.className = 'redesigned-name-container';
    nameContainer.style.cssText = `
      margin-bottom: ${nameInfo.fullName ? '10px' : '40px'};
      text-align: center;
      width: 100%;
      max-width: 280px;
    `;

    // Tạo phần tử cho tên đầy đủ
    if (nameInfo.fullName) {
      const fullNameElement = document.createElement('h1');
      fullNameElement.textContent = nameInfo.fullName;
      fullNameElement.style.cssText = `
        font-size: 1.5rem;
        font-weight: 600;
        color: #24292f;
        margin: 0 0 8px 0;
        line-height: 1.3;
      `;
      nameContainer.appendChild(fullNameElement);
    }

    // Tạo dấu gạch ngang ngăn cách
    if (nameInfo.fullName && nameInfo.username) {
      const separator = document.createElement('hr');
      separator.style.cssText = `
        border: none;
        height: 1px;
        background: linear-gradient(90deg, transparent, #d0d7de, transparent);
        margin: 10px 0;
      `;
      nameContainer.appendChild(separator);
    }

    // Tạo phần tử cho username
    if (nameInfo.username) {
      const usernameElement = document.createElement('p');
      usernameElement.textContent = nameInfo.username;
      usernameElement.style.cssText = `
        font-size: 1.1rem;
        font-weight: 400;
        color: #656d76;
        margin: 0;
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      `;
      nameContainer.appendChild(usernameElement);
    }

    if (!nameInfo.fullName) {
      const separator = document.createElement('hr');
      separator.style.cssText = `
        border: none;
        height: 1px;
        background: linear-gradient(90deg, transparent, #d0d7de, transparent);
        margin: 10px 0;
      `;
      nameContainer.appendChild(separator);
    }

    // Thêm name container vào đầu targetElement
    targetElement.insertBefore(nameContainer, targetElement.firstChild);
  }

  // Tìm và style lại avatar container nếu có
  const avatarContainer = targetElement.querySelector('.position-relative');
  if (avatarContainer) {
    avatarContainer.style.cssText = `
      z-index: 4;
      transition: transform 0.3s ease;
    `;

    // Thêm hiệu ứng hover cho avatar
    const avatarImg = avatarContainer.querySelector('.avatar');
    if (avatarImg) {
      avatarImg.style.cssText = `
        height: auto;
        border: 4px solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
      `;

      // Hover effects
      avatarImg.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.2)';
      });

      avatarImg.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
      });
    }
  }

  console.log('GitHub profile section redesigned successfully');
}

// Hàm redesign pinned repositories section
function redesignPinnedRepos() {
  const pinnedContainer = document.querySelector(
    '.js-pinned-items-reorder-container'
  );

  const hasPinnedContent = pinnedContainer
    .querySelector('h2')
    ?.textContent.trim()
    ?.includes('Pinned');

  if (pinnedContainer) {
    console.log('Found pinned container:', pinnedContainer);

    const medievalMapBackground = chrome.runtime.getURL(
      'icon/background_map.png'
    );

    // URL cho hình khung custom
    const customFrameUrl = chrome.runtime.getURL('icon/frame_map.png');

    // Tạo container wrapper cho toàn bộ phần tử
    const frameWrapper = document.createElement('div');
    frameWrapper.className = 'medieval-frame-wrapper';
    frameWrapper.style.cssText = `
        position: relative;
        width: 922px;
        height: 685px;
        background-image: url('${customFrameUrl}');
        background-size: 90% 98%;
        background-repeat: no-repeat;
        background-position: center;
        padding: ${hasPinnedContent ? 0 : '120px 98px 137px 123px'};
        left: ${hasPinnedContent ? '-100px' : 0};
        box-sizing: border-box;
      `;

    // Tách header ra khỏi pinned container
    const header = pinnedContainer.querySelector('h2');
    let headerContainer = null;

    if (header) {
      // Tạo container riêng cho header - đặt trong phần khung xanh
      headerContainer = document.createElement('div');
      headerContainer.className = 'medieval-header-container';
      headerContainer.style.cssText = `
          position: absolute;
          top: 87px;
          left: 52%;
          transform: translateX(-50%);
          z-index: 20;
          width: 90%;
          text-align: center;
        `;

      // Style cho header để nằm trong khung xanh
      header.style.cssText = `
          color: #ffffff;
        `;

      // Xóa decorative border cũ nếu có
      const existingBorder = header.querySelector('div');
      if (existingBorder) {
        existingBorder.remove();
      }

      headerContainer.appendChild(header);
    }

    // Wrap pinned container với frame
    pinnedContainer.parentNode.insertBefore(frameWrapper, pinnedContainer);
    frameWrapper.appendChild(pinnedContainer);

    // Thêm header vào frame wrapper
    if (headerContainer) {
      frameWrapper.appendChild(headerContainer);
    }

    // Style cho map container
    pinnedContainer.style.cssText = `
        background-image: url('${medievalMapBackground}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
        cursor: grab;
        user-select: none;
        border-radius: 40px;
        margin: 0;
      `;

    // Tạo scrollable content area
    const scrollableArea = document.createElement('div');
    scrollableArea.className = 'scrollable-map';
    scrollableArea.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 900px;
        height: 600px;
        background-image: url('${medievalMapBackground}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      `;

    // Thêm overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          radial-gradient(circle at 20% 30%, rgba(101, 67, 33, 0.2) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(139, 105, 20, 0.15) 0%, transparent 40%);
        pointer-events: none;
        z-index: 1;
      `;
    scrollableArea.appendChild(overlay);

    // Tạo container cho các castle
    const castleContainer = document.createElement('div');
    castleContainer.className = 'castle-world';
    castleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
      `;

    // Style và biến đổi repository list
    const repoList = pinnedContainer.querySelector('.d-flex.flex-wrap');
    if (repoList) {
      // Biến đổi các repository items thành castle
      const repoItems = repoList.querySelectorAll('.pinned-item-list-item');
      repoItems.forEach((item, index) => {
        if (index >= castlePositions.length) return;

        const castleElement = document.createElement('div');
        castleElement.className = 'castle-container';
        castleElement.style.cssText = `
            position: absolute;
            left: ${castlePositions[index].x}%;
            top: ${castlePositions[index].y}%;
            transform: translate(-50%, -50%);
            width: 100px;
            height: 120px;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
          `;

        // Tạo castle image
        const castleImg = createCastleImage();
        castleImg.style.cssText = `
            width: ${index === 2 ? '170px' : '120px'};
            height: ${index === 2 ? '170px' : '120px'};
          `;

        // Lấy thông tin từ item gốc
        const repoLink = item.querySelector('.Link.text-bold');
        const description = item.querySelector('.pinned-item-desc');
        const language = item.querySelector('[itemprop="programmingLanguage"]');
        const stars = item.querySelector('a[href*="/stargazers"]');
        const forks = item.querySelector('a[href*="/forks"]');

        const repoName = repoLink ? repoLink.textContent.trim() : 'Unknown';
        const repoDesc = description ? description.textContent.trim() : '';
        const repoLang = language ? language.textContent.trim() : '';
        const starsCount = stars ? stars.textContent.trim() : '0';
        const forksCount = forks ? forks.textContent.trim() : '0';
        const repoUrl = repoLink ? repoLink.href : '#';

        // Tạo lá cờ thay cho info panel
        const flag = createFlag(
          index,
          repoName,
          repoDesc,
          repoLang,
          starsCount,
          forksCount
        );

        flag.style.cssText = `
            position: absolute;
            top: ${index === 2 ? '-50px' : '-60px;'};
            left: ${index === 2 ? '75%' : '50%'};
            transform: translateX(-50%) scale(1);
            z-index: 15;
            pointer-events: none;
          `;

        // Enhanced hover effects
        castleElement.addEventListener('mouseenter', () => {
          castleElement.style.transform = 'translate(-50%, -50%) scale(1.15)';
          castleImg.style.filter =
            'drop-shadow(0 6px 12px rgba(0,0,0,0.4)) brightness(1.2)';
          flag.style.transform = 'translateX(-50%) scale(1.1)';
          const flagEl = flag.querySelector('.medieval-flag');
          if (flagEl) {
            flagEl.style.animationDuration = '1.5s';
            flagEl.style.filter = 'brightness(1.2)';
          }
        });

        castleElement.addEventListener('mouseleave', () => {
          castleElement.style.transform = 'translate(-50%, -50%) scale(1)';
          castleImg.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
          flag.style.transform = 'translateX(-50%) scale(1)';
          const flagEl = flag.querySelector('.medieval-flag');
          if (flagEl) {
            flagEl.style.animationDuration = '3s';
            flagEl.style.filter = 'brightness(1)';
          }
        });

        // Click để mở repository
        castleElement.addEventListener('click', (e) => {
          e.stopPropagation();
          if (repoUrl !== '#') {
            window.location.href = repoUrl;
          }
        });

        // Thêm các phần tử vào castle
        castleElement.appendChild(castleImg);
        castleElement.appendChild(flag);
        castleContainer.appendChild(castleElement);
      });

      // Ẩn repository list gốc
      repoList.style.display = 'none';
    }

    // Thêm scrollable area và castle container
    scrollableArea.appendChild(castleContainer);
    pinnedContainer.appendChild(scrollableArea);

    // Setup drag scroll với kích thước mới
    setupDragScroll(pinnedContainer, scrollableArea);

    console.log(
      'Pinned repositories redesigned successfully with animated flags!'
    );
  } else {
    console.log('Pinned container not found yet, retrying...');
  }
}

// Hàm setup drag scroll với giới hạn phù hợp với kích thước mới
function setupDragScroll(container, scrollableArea) {
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

// Hàm thay đổi nội dung văn bản trên trang và thay thế icon SVG
function applyMedievalTheme(node = document.body) {
  const walker = document.createTreeWalker(
    node,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let textNode;

  while ((textNode = walker.nextNode())) {
    let text = textNode.nodeValue;
    let parent = textNode.parentElement.parentNode;

    Object.keys(medievalTerms).forEach((original) => {
      if (text.includes(original)) {
        textNode.nodeValue = text.replace(original, medievalTerms[original]);
        replaceSvgIcon(parent, original);
      }
    });
  }
}

// Hàm chờ element xuất hiện
function waitForElement(selector, callback, maxAttempts = 50) {
  let attempts = 0;

  const check = () => {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
      return;
    }

    attempts++;
    if (attempts < maxAttempts) {
      setTimeout(check, 100);
    } else {
      console.log(
        `Element ${selector} not found after ${maxAttempts} attempts`
      );
    }
  };

  check();
}

// Hàm khởi tạo theme
function initializeMedievalTheme() {
  console.log('Initializing Medieval GitHub Theme with Animated Flags...');

  applyMedievalTheme();
  redesignProfileSection();

  waitForElement('.js-pinned-items-reorder-container', () => {
    console.log('Pinned container found, applying animated flags redesign...');
    redesignPinnedRepos();
  });

  waitForElement('[data-testid="pinned-items"]', redesignPinnedRepos);
  waitForElement('.js-pinned-items-reorder-list', redesignPinnedRepos);
}

// Thiết lập MutationObserver
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' || mutation.type === 'subtree') {
      applyMedievalTheme(mutation.target);

      if (
        mutation.target.querySelector &&
        mutation.target.querySelector('.js-pinned-items-reorder-container')
      ) {
        redesignPinnedRepos();
      }
    }
  });
});

// Khởi tạo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMedievalTheme);
} else {
  initializeMedievalTheme();
}

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
