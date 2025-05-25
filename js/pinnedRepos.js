// pinnedRepos.js - Xử lý redesign pinned repositories

import { CASTLE_POSITIONS, SELECTORS } from './constants.js';
import { getResourceUrl, extractRepoInfo, Logger } from './utils.js';
import { createCastleContainer } from './castleComponents.js';
import { DragScrollManager } from './dragScroll.js';

/**
 * Class quản lý việc redesign pinned repositories
 */
export class PinnedReposManager {
  constructor() {
    this.dragScrollManager = null;
    this.isInitialized = false;
  }

  /**
   * Redesign pinned repositories section
   */
  redesign() {
    const pinnedContainer = document.querySelector(SELECTORS.PINNED_CONTAINER);

    if (!pinnedContainer) {
      Logger.warn('Pinned container not found');
      return false;
    }

    if (this.isInitialized) {
      Logger.info('Pinned repos already initialized');
      return true;
    }

    Logger.info('Found pinned container, applying redesign...');

    try {
      this.createFrameWrapper(pinnedContainer);
      this.setupMapContainer(pinnedContainer);
      this.convertReposToKingdoms(pinnedContainer);
      this.isInitialized = true;

      Logger.info('Pinned repositories redesigned successfully!');
      return true;
    } catch (error) {
      Logger.error('Error redesigning pinned repos:', error);
      return false;
    }
  }

  /**
   * Tạo frame wrapper cho toàn bộ section
   */
  createFrameWrapper(pinnedContainer) {
    const customFrameUrl = getResourceUrl('icon/frame_map.png');

    // Tạo container wrapper
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
      padding: 120px 98px 137px 123px;
      box-sizing: border-box;
    `;

    // Xử lý header
    this.setupHeader(pinnedContainer, frameWrapper);

    // Wrap pinned container
    pinnedContainer.parentNode.insertBefore(frameWrapper, pinnedContainer);
    frameWrapper.appendChild(pinnedContainer);
  }

  /**
   * Setup header cho frame
   */
  setupHeader(pinnedContainer, frameWrapper) {
    const header = pinnedContainer.querySelector('h2');

    if (header) {
      const headerContainer = document.createElement('div');
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

      // Style cho header
      header.style.cssText = `color: #ffffff;`;

      // Xóa decorative border cũ nếu có
      const existingBorder = header.querySelector('div');
      if (existingBorder) {
        existingBorder.remove();
      }

      headerContainer.appendChild(header);
      frameWrapper.appendChild(headerContainer);
    }
  }

  /**
   * Setup map container với background và scrollable area
   */
  setupMapContainer(pinnedContainer) {
    const medievalMapBackground = getResourceUrl('icon/background_map.png');

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
    const scrollableArea = this.createScrollableArea(medievalMapBackground);
    pinnedContainer.appendChild(scrollableArea);

    // Setup drag scroll
    this.dragScrollManager = new DragScrollManager(
      pinnedContainer,
      scrollableArea
    );

    return scrollableArea;
  }

  /**
   * Tạo scrollable area
   */
  createScrollableArea(backgroundUrl) {
    const scrollableArea = document.createElement('div');
    scrollableArea.className = 'scrollable-map';
    scrollableArea.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 900px;
      height: 600px;
      background-image: url('${backgroundUrl}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    `;

    // Thêm overlay cho hiệu ứng
    const overlay = this.createOverlay();
    scrollableArea.appendChild(overlay);

    return scrollableArea;
  }

  /**
   * Tạo overlay cho hiệu ứng visual
   */
  createOverlay() {
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
    return overlay;
  }

  /**
   * Chuyển đổi repositories thành kingdoms (castles)
   */
  convertReposToKingdoms(pinnedContainer) {
    const repoList = pinnedContainer.querySelector(SELECTORS.REPO_LIST);

    if (!repoList) {
      Logger.warn('Repository list not found');
      return;
    }

    // Tạo container cho các castle
    const castleContainer = this.createCastleContainer();
    const scrollableArea = pinnedContainer.querySelector('.scrollable-map');
    scrollableArea.appendChild(castleContainer);

    // Chuyển đổi từng repository thành castle
    const repoItems = repoList.querySelectorAll(SELECTORS.REPO_ITEMS);
    repoItems.forEach((item, index) => {
      if (index >= CASTLE_POSITIONS.length) return;

      const repoInfo = extractRepoInfo(item);
      const position = CASTLE_POSITIONS[index];

      const castleElement = createCastleContainer(index, position, repoInfo);
      castleContainer.appendChild(castleElement);
    });

    // Ẩn repository list gốc
    repoList.style.display = 'none';
  }

  /**
   * Tạo container cho các castle
   */
  createCastleContainer() {
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
    return castleContainer;
  }

  /**
   * Reset và cleanup
   */
  reset() {
    if (this.dragScrollManager) {
      this.dragScrollManager.destroy();
      this.dragScrollManager = null;
    }
    this.isInitialized = false;
  }

  /**
   * Kiểm tra xem có cần redesign lại không
   */
  needsRedesign() {
    return (
      !this.isInitialized && document.querySelector(SELECTORS.PINNED_CONTAINER)
    );
  }
}
