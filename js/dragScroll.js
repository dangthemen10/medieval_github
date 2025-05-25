// dragScroll.js - Xử lý drag và scroll cho map

import { CONFIG } from './constants.js';

/**
 * Class quản lý drag scroll functionality
 */
export class DragScrollManager {
  constructor(container, scrollableArea) {
    this.container = container;
    this.scrollableArea = scrollableArea;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.scrollLeft = 0;
    this.scrollTop = 0;
    this.currentX = 0;
    this.currentY = 0;

    this.init();
  }

  /**
   * Khởi tạo drag scroll
   */
  init() {
    this.calculateInitialPosition();
    this.setupMouseEvents();
    this.setupTouchEvents();
  }

  /**
   * Tính toán vị trí ban đầu
   */
  calculateInitialPosition() {
    const {
      CONTAINER_WIDTH,
      CONTAINER_HEIGHT,
      SCROLLABLE_WIDTH,
      SCROLLABLE_HEIGHT,
    } = CONFIG;

    this.currentX = -(SCROLLABLE_WIDTH - CONTAINER_WIDTH) / 2;
    this.currentY = -(SCROLLABLE_HEIGHT - CONTAINER_HEIGHT) / 2;

    this.updateScrollablePosition();
  }

  /**
   * Setup mouse events
   */
  setupMouseEvents() {
    this.container.addEventListener(
      'mousedown',
      this.handleMouseDown.bind(this)
    );
    this.container.addEventListener(
      'mouseleave',
      this.handleMouseUp.bind(this)
    );
    this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.container.addEventListener(
      'mousemove',
      this.handleMouseMove.bind(this)
    );
  }

  /**
   * Setup touch events
   */
  setupTouchEvents() {
    this.container.addEventListener(
      'touchstart',
      this.handleTouchStart.bind(this)
    );
    this.container.addEventListener(
      'touchmove',
      this.handleTouchMove.bind(this)
    );
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  /**
   * Xử lý mouse down
   */
  handleMouseDown(e) {
    if (e.target.closest('.castle-container')) return;

    this.isDragging = true;
    this.container.style.cursor = 'grabbing';

    this.startX = e.clientX;
    this.startY = e.clientY;
    this.scrollLeft = this.currentX;
    this.scrollTop = this.currentY;

    e.preventDefault();
  }

  /**
   * Xử lý mouse up
   */
  handleMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.container.style.cursor = 'grab';
    }
  }

  /**
   * Xử lý mouse move
   */
  handleMouseMove(e) {
    if (!this.isDragging) return;

    e.preventDefault();
    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;

    this.updatePosition(deltaX, deltaY);
  }

  /**
   * Xử lý touch start
   */
  handleTouchStart(e) {
    if (e.target.closest('.castle-container')) return;

    this.isDragging = true;
    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.scrollLeft = this.currentX;
    this.scrollTop = this.currentY;
    e.preventDefault();
  }

  /**
   * Xử lý touch move
   */
  handleTouchMove(e) {
    if (!this.isDragging) return;

    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.startX;
    const deltaY = touch.clientY - this.startY;

    this.updatePosition(deltaX, deltaY);
  }

  /**
   * Xử lý touch end
   */
  handleTouchEnd() {
    this.isDragging = false;
  }

  /**
   * Cập nhật vị trí dựa trên delta
   */
  updatePosition(deltaX, deltaY) {
    const newX = this.scrollLeft + deltaX;
    const newY = this.scrollTop + deltaY;

    const {
      CONTAINER_WIDTH,
      CONTAINER_HEIGHT,
      SCROLLABLE_WIDTH,
      SCROLLABLE_HEIGHT,
      MAX_DRAG_X,
      MAX_DRAG_Y,
    } = CONFIG;

    const centerX = -(SCROLLABLE_WIDTH - CONTAINER_WIDTH) / 2;
    const centerY = -(SCROLLABLE_HEIGHT - CONTAINER_HEIGHT) / 2;

    this.currentX = Math.max(
      Math.min(newX, centerX + MAX_DRAG_X),
      centerX - MAX_DRAG_X
    );
    this.currentY = Math.max(
      Math.min(newY, centerY + MAX_DRAG_Y),
      centerY - MAX_DRAG_Y
    );

    this.updateScrollablePosition();
  }

  /**
   * Cập nhật vị trí của scrollable area
   */
  updateScrollablePosition() {
    this.scrollableArea.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;
  }

  /**
   * Reset về vị trí trung tâm
   */
  resetToCenter() {
    this.calculateInitialPosition();
  }

  /**
   * Destroy instance và cleanup events
   */
  destroy() {
    // Remove mouse events
    this.container.removeEventListener('mousedown', this.handleMouseDown);
    this.container.removeEventListener('mouseleave', this.handleMouseUp);
    this.container.removeEventListener('mouseup', this.handleMouseUp);
    this.container.removeEventListener('mousemove', this.handleMouseMove);

    // Remove touch events
    this.container.removeEventListener('touchstart', this.handleTouchStart);
    this.container.removeEventListener('touchmove', this.handleTouchMove);
    this.container.removeEventListener('touchend', this.handleTouchEnd);
  }
}
