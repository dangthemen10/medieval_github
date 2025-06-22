import { FLAG_COLORS } from './constants.js';

// Hàm tạo lá cờ với animation
export function createFlag(
  index,
  repoName,
  repoDesc,
  repoLang,
  starsCount,
  forksCount
) {
  const colors = FLAG_COLORS[index % FLAG_COLORS.length];

  const flagContainer = document.createElement('div');
  flagContainer.dataset.medievalCreated = 'true'; // Track
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
  flagPole.dataset.medievalCreated = 'true'; // Track
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
  flag.dataset.medievalCreated = 'true'; // Track
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
  flagContent.dataset.medievalCreated = 'true'; // Track
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
  flagStyle.dataset.medievalCreated = 'true'; // Track
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
  poleStyle.dataset.medievalCreated = 'true'; // Track
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
  flagTop.dataset.medievalCreated = 'true'; // Track
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

// Hàm tạo castle image element
export function createCastleImage() {
  const castleImg = document.createElement('img');
  castleImg.dataset.medievalCreated = 'true'; // Track
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
