// castleComponents.js - Tạo các component Castle và Flag

import { FLAG_COLORS } from './constants.js';
import { getResourceUrl, injectStyles } from './utils.js';

/**
 * Hàm tạo castle image element
 * @param {number} index - Index của castle để xác định kích thước
 * @returns {HTMLImageElement}
 */
export function createCastleImage(index = 0) {
  const castleImg = document.createElement('img');
  castleImg.src = getResourceUrl('icon/castle.png');
  castleImg.alt = 'Castle';

  const isLarge = index === 2; // Castle thứ 3 lớn hơn
  const size = isLarge ? '170px' : '120px';

  castleImg.style.cssText = `
    width: ${size};
    height: ${size};
    object-fit: contain;
    transition: all 0.3s ease;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
  `;

  return castleImg;
}

/**
 * Hàm tạo lá cờ với animation
 * @param {number} index - Index để chọn màu
 * @param {Object} repoInfo - Thông tin repository
 * @returns {HTMLElement}
 */
export function createFlag(index, repoInfo) {
  const { name, description, language, stars, forks } = repoInfo;
  const colors = FLAG_COLORS[index % FLAG_COLORS.length];

  // Inject CSS styles nếu chưa có
  injectFlagStyles();

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

  // Tạo cọc cờ
  const flagPole = createFlagPole();

  // Tạo lá cờ chính
  const flag = createFlagBody(colors);

  // Tạo nội dung thông tin
  const flagContent = createFlagContent(
    name,
    description,
    language,
    stars,
    forks
  );

  // Lắp ráp các phần tử
  flag.appendChild(flagContent);
  flagContainer.appendChild(flagPole);
  flagContainer.appendChild(flag);

  return flagContainer;
}

/**
 * Tạo cọc cờ
 * @returns {HTMLElement}
 */
function createFlagPole() {
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
    animation: poleWave 4s ease-in-out infinite;
  `;

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

  flagPole.appendChild(flagTop);
  return flagPole;
}

/**
 * Tạo thân lá cờ
 * @param {Object} colors - Màu sắc cho cờ
 * @returns {HTMLElement}
 */
function createFlagBody(colors) {
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

  return flag;
}

/**
 * Tạo nội dung thông tin trên cờ
 * @param {string} name - Tên repository
 * @param {string} description - Mô tả
 * @param {string} language - Ngôn ngữ lập trình
 * @param {string} stars - Số sao
 * @param {string} forks - Số fork
 * @returns {HTMLElement}
 */
function createFlagContent(name, description, language, stars, forks) {
  const flagContent = document.createElement('div');
  flagContent.className = 'flag-content';
  flagContent.innerHTML = `
    <div class="flag-title">${name}</div>
    <div class="flag-desc">${description || 'Vương quốc bí ẩn'}</div>
    <div class="flag-stats">
      <span class="flag-lang">${language}</span>
      <span class="flag-metrics">⭐${stars} 🔱${forks}</span>
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

  return flagContent;
}

/**
 * Inject CSS styles cho flag components
 */
function injectFlagStyles() {
  const flagStylesCSS = `
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
    
    @keyframes poleWave {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(0.5deg); }
      75% { transform: rotate(-0.5deg); }
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

  injectStyles('flag-styles', flagStylesCSS);
}

/**
 * Tạo container cho castle với event listeners
 * @param {number} index - Index của castle
 * @param {Object} position - Vị trí {x, y}
 * @param {Object} repoInfo - Thông tin repository
 * @returns {HTMLElement}
 */
export function createCastleContainer(index, position, repoInfo) {
  const castleElement = document.createElement('div');
  castleElement.className = 'castle-container';
  castleElement.style.cssText = `
    position: absolute;
    left: ${position.x}%;
    top: ${position.y}%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 120px;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 10;
  `;

  // Tạo castle image và flag
  const castleImg = createCastleImage(index);
  const flag = createFlag(index, repoInfo);

  // Điều chỉnh vị trí flag cho castle lớn
  if (index === 2) {
    flag.style.cssText = `
      position: absolute;
      top: -50px;
      left: 75%;
      transform: translateX(-50%) scale(1);
      z-index: 15;
      pointer-events: none;
    `;
  }

  // Thêm event listeners
  setupCastleEvents(castleElement, castleImg, flag, repoInfo.url);

  // Thêm các phần tử vào castle
  castleElement.appendChild(castleImg);
  castleElement.appendChild(flag);

  return castleElement;
}

/**
 * Setup event listeners cho castle
 * @param {HTMLElement} castleElement - Castle container
 * @param {HTMLElement} castleImg - Castle image
 * @param {HTMLElement} flag - Flag element
 * @param {string} repoUrl - URL của repository
 */
function setupCastleEvents(castleElement, castleImg, flag, repoUrl) {
  castleElement.addEventListener('mouseenter', () => {
    castleElement.style.transform = 'translate(-50%, -50%) scale(1.15)';
    castleImg.style.filter =
      'drop-shadow(0 6px 12px rgba(0,0,0,0.4)) brightness(1.2)';
    flag.style.transform = flag.style.transform.replace(
      'scale(1)',
      'scale(1.1)'
    );

    const flagEl = flag.querySelector('.medieval-flag');
    if (flagEl) {
      flagEl.style.animationDuration = '1.5s';
      flagEl.style.filter = 'brightness(1.2)';
    }
  });

  castleElement.addEventListener('mouseleave', () => {
    castleElement.style.transform = 'translate(-50%, -50%) scale(1)';
    castleImg.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
    flag.style.transform = flag.style.transform.replace(
      'scale(1.1)',
      'scale(1)'
    );

    const flagEl = flag.querySelector('.medieval-flag');
    if (flagEl) {
      flagEl.style.animationDuration = '3s';
      flagEl.style.filter = 'brightness(1)';
    }
  });

  castleElement.addEventListener('click', (e) => {
    e.stopPropagation();
    if (repoUrl !== '#') {
      window.location.href = repoUrl;
    }
  });
}
