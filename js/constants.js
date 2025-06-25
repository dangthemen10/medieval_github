// Medieval terms dictionary
export const MEDIEVAL_TERMS = {
  'Pull requests': 'Quests',
  Repositories: 'Castles',
  Organization: 'Kingdom',
  Organizations: 'Kingdoms',
  Issues: 'Petitions',
  Commits: 'Chronicles',
  Merged: 'United',
  Fork: 'Vassal Kingdom',
  Star: 'Favor',
  Watch: 'Sentinel',
  Owner: 'Lord',
  Admin: 'Castellan',
  Contributor: 'Knight',
  Member: 'Villager',
  Release: 'Royal Decree',
  Releases: 'Royal Decrees',
  Discussion: 'Council',
  Home: 'Great Hall',
  Dashboard: 'Great Hall',
  'Top repositories': 'Mighty Castles',
  'Your teams': 'Your Kingdoms',
  Code: 'Scripture',
  Actions: 'Battle Plans',
  Projects: 'Campaigns',
  Security: 'Castle Guard',
  Insights: 'Prophecies',
  Settings: 'Royal Edicts',
  Unwatch: 'Relieve Sentinel',
  'Your profile': 'Noble portrait',
  'Your repositories': 'Your castles',
  'Your Copilot': 'Royal advisor',
  'Your projects': 'Your campaigns',
  'Your stars': 'Bestowed favors',
  'Your gists': 'Royal scrolls',
  'Your organizations': 'Your kingdoms',
  'Latest changes': 'New Decrees',
  'Explore repositories': 'Explore castles',
  'Popular repositories': 'Famed castles',
};

// Mảng các tọa độ cố định cho castles
export const CASTLE_POSITIONS = [
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
export const FLAG_COLORS = [
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

// Cấu hình kích thước và giới hạn
export const CONFIG = {
  CONTAINER_WIDTH: 700,
  CONTAINER_HEIGHT: 430,
  SCROLLABLE_WIDTH: 900,
  SCROLLABLE_HEIGHT: 600,
  MAX_DRAG_X: 48,
  MAX_DRAG_Y: 1,
  MAX_WAIT_ATTEMPTS: 50,
  WAIT_INTERVAL: 100,
};

// CSS Selectors
export const SELECTORS = {
  PINNED_CONTAINER: '.js-pinned-items-reorder-container',
  PINNED_ITEMS: '[data-testid="pinned-items"]',
  PINNED_LIST: '.js-pinned-items-reorder-list',
  REPO_LIST: '.d-flex.flex-wrap',
  REPO_ITEMS: '.pinned-item-list-item',
};
