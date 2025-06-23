// ===== CSS MANAGEMENT =====
/**
 * Dynamically loads medieval CSS theme
 */

let medievalStyleSheet = null;

export function loadMedievalCSS() {
  if (medievalStyleSheet) {
    console.log('🎨 Medieval CSS already loaded');
    return;
  }

  try {
    medievalStyleSheet = document.createElement('link');
    Object.assign(medievalStyleSheet, {
      rel: 'stylesheet',
      type: 'text/css',
      href: chrome.runtime.getURL('css/style.css'),
      id: 'medieval-css',
    });

    document.head.appendChild(medievalStyleSheet);
    console.log('🎨 Medieval CSS loaded successfully');
  } catch (error) {
    console.error('❌ Error loading Medieval CSS:', error);
  }
}

/**
 * Removes medieval CSS and cleans up
 */
export function removeMedievalCSS() {
  // Remove tracked stylesheet
  if (medievalStyleSheet) {
    try {
      medievalStyleSheet.remove();
      medievalStyleSheet = null;
      console.log('🎨 Medieval CSS removed successfully');
    } catch (error) {
      console.error('❌ Error removing Medieval CSS:', error);
    }
  }

  // Fallback cleanup by ID
  const existingCSS = document.getElementById('medieval-css');
  if (existingCSS) {
    existingCSS.remove();
    console.log('🎨 Medieval CSS removed via fallback');
  }
}
