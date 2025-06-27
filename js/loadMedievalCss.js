// ===== CSS MANAGEMENT =====

import { getResourceUrl } from './utils';

let medievalStyleSheet = null;

/**
 * Load CSS theme medieval một cách động
 * Kiểm tra xem CSS đã được load chưa để tránh duplicate
 */
export function loadMedievalCSS() {
  // Thoát sớm nếu đã load rồi
  if (medievalStyleSheet) {
    console.log('🎨 Medieval CSS already loaded');
    return;
  }

  try {
    // Tạo và cấu hình link element
    medievalStyleSheet = document.createElement('link');
    Object.assign(medievalStyleSheet, {
      rel: 'stylesheet',
      type: 'text/css',
      href: getResourceUrl('css/style.css'),
      id: 'medieval-css',
    });

    // Thêm vào head
    document.head.appendChild(medievalStyleSheet);
    console.log('🎨 Medieval CSS loaded successfully');
  } catch (error) {
    console.error('❌ Error loading Medieval CSS:', error);
    medievalStyleSheet = null; // Reset state nếu có lỗi
  }
}

/**
 * Xóa CSS medieval và cleanup
 * Sử dụng dual approach: tracked element + fallback by ID
 */
export function removeMedievalCSS() {
  let removed = false;

  // Method 1: Remove tracked stylesheet
  if (medievalStyleSheet) {
    try {
      medievalStyleSheet.remove();
      medievalStyleSheet = null;
      removed = true;
      console.log('🎨 Medieval CSS removed successfully');
    } catch (error) {
      console.error('❌ Error removing tracked CSS:', error);
    }
  }

  // Method 2: Fallback cleanup by ID (safety net)
  const existingCSS = document.getElementById('medieval-css');
  if (existingCSS) {
    existingCSS.remove();
    console.log('🎨 Medieval CSS removed via fallback');
    removed = true;
  }

  // Log nếu không tìm thấy CSS nào để remove
  if (!removed) {
    console.log('🎨 No Medieval CSS found to remove');
  }
}

/**
 * Kiểm tra xem CSS medieval có đang được load không
 * @returns {boolean} True nếu CSS đang active
 */
export function isMedievalCSSLoaded() {
  return (
    medievalStyleSheet !== null ||
    document.getElementById('medieval-css') !== null
  );
}

/**
 * Toggle CSS medieval - load nếu chưa có, remove nếu đã có
 * @returns {boolean} True nếu CSS được load sau khi toggle
 */
export function toggleMedievalCSS() {
  if (isMedievalCSSLoaded()) {
    removeMedievalCSS();
    return false;
  } else {
    loadMedievalCSS();
    return true;
  }
}
