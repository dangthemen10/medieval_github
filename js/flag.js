import { FLAG_COLORS } from './constants.js';
import { getResourceUrl } from './utils.js';

/**
 * Tạo lá cờ medieval với animation cho repository
 * @param {number} index - Index để chọn màu cờ
 * @param {string} repoName - Tên repository
 * @param {string} repoDesc - Mô tả repository
 * @param {string} repoLang - Ngôn ngữ lập trình
 * @param {number} starsCount - Số stars
 * @param {number} forksCount - Số forks
 * @returns {HTMLElement} Container chứa cờ hoàn chỉnh
 */
export function createFlag(
  index,
  repoName,
  repoDesc,
  repoLang,
  starsCount,
  forksCount
) {
  const colors = FLAG_COLORS[index % FLAG_COLORS.length];

  // Tạo container chính
  const flagContainer = createElement('div', {
    className: 'flag-container',
    dataset: { medievalCreated: 'true' },
    style: `
      position: absolute; top: -60px; left: 50%; z-index: 15;
      transform: translateX(-50%); pointer-events: none;
    `,
  });

  // Tạo cọc cờ với trang trí đỉnh
  const flagPole = createFlagPole();

  // Tạo lá cờ với nội dung
  const flag = createFlagElement(
    colors,
    repoName,
    repoDesc,
    repoLang,
    starsCount,
    forksCount
  );

  // Inject CSS styles nếu chưa có
  injectFlagStyles();

  // Lắp ráp
  flagContainer.appendChild(flagPole);
  flagContainer.appendChild(flag);

  return flagContainer;
}

/**
 * Tạo cọc cờ với trang trí đỉnh và animation
 * @returns {HTMLElement} Element cọc cờ
 */
function createFlagPole() {
  const flagPole = createElement('div', {
    className: 'flag-pole',
    dataset: { medievalCreated: 'true' },
    style: `
      width: 3px; height: 80px; margin: 0 auto; border-radius: 2px;
      background: linear-gradient(to bottom, #8B4513, #D2691E);
      box-shadow: inset 0 0 3px rgba(0,0,0,0.3);
      animation: poleWave 4s ease-in-out infinite;
      position: relative;
    `,
  });

  // Trang trí đỉnh cọc (quả cầu vàng)
  const flagTop = createElement('div', {
    dataset: { medievalCreated: 'true' },
    style: `
      position: absolute; top: -5px; left: 50%; transform: translateX(-50%);
      width: 8px; height: 8px; border-radius: 50%; border: 1px solid #B8860B;
      background: radial-gradient(circle, #FFD700, #FFA500);
      box-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
    `,
  });

  flagPole.appendChild(flagTop);
  return flagPole;
}

/**
 * Tạo lá cờ với nội dung thông tin
 * @param {Object} colors - Màu sắc của cờ {primary, secondary, accent}
 * @param {string} repoName - Tên repo
 * @param {string} repoDesc - Mô tả repo
 * @param {string} repoLang - Ngôn ngữ
 * @param {number} starsCount - Số stars
 * @param {number} forksCount - Số forks
 * @returns {HTMLElement} Element lá cờ
 */
function createFlagElement(
  colors,
  repoName,
  repoDesc,
  repoLang,
  starsCount,
  forksCount
) {
  const flag = createElement('div', {
    className: 'medieval-flag',
    dataset: { medievalCreated: 'true' },
    style: `
      position: absolute; top: 5px; left: 3px; width: 100px; height: 60px;
      background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%);
      clip-path: polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%);
      border: 2px solid rgba(139, 69, 19, 0.6);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transform-origin: left center;
      animation: flagWave 3s ease-in-out infinite;
    `,
  });

  // Nội dung thông tin trên cờ
  const flagContent = createElement('div', {
    className: 'flag-content',
    dataset: { medievalCreated: 'true' },
    innerHTML: `
      <div class="flag-title">${repoName}</div>
      <div class="flag-desc">${repoDesc || 'Vương quốc bí ẩn'}</div>
      <div class="flag-stats">
        <span class="flag-lang">${repoLang}</span>
        <span class="flag-metrics">⭐${starsCount} 🔱${forksCount}</span>
      </div>
    `,
    style: `
      position: absolute; top: 50%; left: 8px; width: 70px;
      transform: translateY(-50%); color: #fff; font-size: 9px;
      font-family: 'Cinzel', serif; pointer-events: none;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
    `,
  });

  flag.appendChild(flagContent);
  return flag;
}

/**
 * Inject CSS styles cho flags và animations
 * Chỉ inject một lần để tránh duplicate
 */
function injectFlagStyles() {
  // Flag animations và styles
  if (!document.querySelector('#flag-styles')) {
    const flagStyle = createElement('style', {
      id: 'flag-styles',
      dataset: { medievalCreated: 'true' },
      textContent: `
        @keyframes flagWave {
          0%, 100% { transform: rotateY(0deg) skewX(0deg); filter: brightness(1); }
          25% { transform: rotateY(-2deg) skewX(1deg); filter: brightness(1.1); }
          50% { transform: rotateY(0deg) skewX(-1deg); filter: brightness(0.95); }
          75% { transform: rotateY(2deg) skewX(0.5deg); filter: brightness(1.05); }
        }
        
        .flag-title {
          font-weight: bold; font-size: 12px; margin-bottom: 2px;
          text-overflow: ellipsis; overflow: hidden; white-space: nowrap;
        }
        
        .flag-desc {
          font-style: italic; font-size: 8px; margin-bottom: 3px; opacity: 0.9;
          text-overflow: ellipsis; overflow: hidden; white-space: nowrap;
        }
        
        .flag-stats {
          display: flex; justify-content: space-between;
          font-size: 7px; font-weight: bold;
        }
        
        .flag-lang {
          background: rgba(255,255,255,0.2);
          padding: 1px 3px; border-radius: 2px;
        }
        
        .flag-metrics { opacity: 0.9; }
        
        .medieval-flag:hover {
          animation-duration: 1.5s !important;
          filter: brightness(1.2) !important;
          transform: scale(1.05) !important;
          width: 100%;
          z-index: 1;
        } 

       .flag-title:hover {
        overflow: visible;
        white-space: nowrap;
      }
      `,
    });
    document.head.appendChild(flagStyle);
  }

  // Pole animation
  if (!document.querySelector('#pole-styles')) {
    const poleStyle = createElement('style', {
      id: 'pole-styles',
      dataset: { medievalCreated: 'true' },
      textContent: `
        @keyframes poleWave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(0.5deg); }
          75% { transform: rotate(-0.5deg); }
        }
      `,
    });
    document.head.appendChild(poleStyle);
  }
}

/**
 * Helper function tạo element với properties
 * @param {string} tag - Tag name
 * @param {Object} props - Properties (className, style, dataset, etc.)
 * @returns {HTMLElement} Element được tạo
 */
function createElement(tag, props = {}) {
  const element = document.createElement(tag);

  // Set properties
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'style') {
      element.style.cssText = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else {
      element[key] = value;
    }
  });

  return element;
}

/**
 * Tạo castle image element
 * @returns {HTMLImageElement} Element hình castle
 */
export function createCastleImage() {
  return createElement('img', {
    dataset: { medievalCreated: 'true' },
    src: getResourceUrl('assets/icon/castle.png'),
    alt: 'Castle',
    style: `
      width: 120px; height: 120px; object-fit: contain;
      transition: all 0.3s ease;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
    `,
  });
}
