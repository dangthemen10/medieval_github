import { trackModified } from './tracking';
import { getResourceUrl } from './utils';

export function redesignHeader() {
  const header = document.querySelector('.AppHeader-globalBar');
  if (!header) return;

  trackModified(header, { style: header.style.cssText });

  header.style.cssText = 'background-color: #713535;';

  redesignLogo(header);
  redesignSearchBar(header);
}

function redesignLogo(header) {
  const logo = header.querySelector('.AppHeader-logo.ml-1');
  if (!logo) return;

  // Track to restore original styles
  trackModified(logo, { style: logo.style.cssText, innerHTML: logo.innerHTML });

  // Remove existing SVG/logo content
  logo.innerHTML = '';

  // Create and insert your logo image
  const img = document.createElement('img');
  img.src = getResourceUrl('assets/icon/logo.png');
  img.style.width = '100%';
  img.style.height = '100%';
  img.alt = 'Medieval Logo';
  img.style.objectFit = 'contain';

  logo.appendChild(img);
}

function redesignSearchBar(header) {
  const searchBar = header.querySelector('.AppHeader-search');
  if (!searchBar) return;
  const searchIcon = header.querySelector('label svg');
  if (!searchIcon) return;
  const searchButton = searchBar.querySelector('.AppHeader-searchButton');
  if (!searchButton) return;
  const searchQuery = searchBar.querySelector('#qb-input-query');
  if (!searchQuery) return;

  // Track to restore original styles
  trackModified(searchIcon, { style: searchIcon.style.cssText });
  trackModified(searchButton, { style: searchButton.style.cssText });
  trackModified(searchQuery, { style: searchQuery.style.cssText });

  searchIcon.style.fill = '#862626';
  searchButton.style.cssText = `
    background: url('${getResourceUrl(
      'assets/icon/search.png'
    )}') no-repeat center center;
    background-size: cover;
    border: solid 0.0625rem #A35F0C;
  `;
  searchQuery.style.color = '#862626';
}
