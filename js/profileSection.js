/**
 * START redesignProfileSection
 */
export function redesignProfileSection() {
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

  // const profileEditableAreaElement = document.querySelector(
  //   '.js-user-profile-bio'
  // );

  // const profileEditableAreaElementHeaderContainer =
  //   document.createElement('div');
  // profileEditableAreaElementHeaderContainer.textContent =
  //   profileEditableAreaElement.textContent;
  // profileEditableAreaElementHeaderContainer.style.cssText = `
  //   width: 100%;
  //   margin: 0;
  // text-align: center;
  // font-size: 24px;
  // font-weight: bold;
  // color:rgb(245, 247, 249);
  // `;
  // profileContainer.appendChild(profileEditableAreaElementHeaderContainer);

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

  // Lấy element đầu tiên (index 6 - nodeChild cuối cùng)
  const checkLengthProfileContainer = profileContainer.children.length;
  console.log('checkLengthProfileContainer', checkLengthProfileContainer);
  const targetElement6 =
    checkLengthProfileContainer === 7
      ? profileContainer.childNodes.item(7).nextSibling
      : checkLengthProfileContainer === 9
      ? profileContainer.childNodes.item(11).nextSibling
      : profileContainer.lastElementChild;

  console.log('targetElement6', targetElement6);
  if (!targetElement6) {
    console.warn('Target element not found');
    return;
  }

  targetElement6.classList.remove('border-top', 'color-border-muted', 'mt-3');

  const frameOrgBackground = chrome.runtime.getURL('icon/frame_org.png');

  // Lấy thẻ h2 và các thẻ a
  const h2Element = targetElement6.querySelector('h2');
  const aElements = targetElement6.querySelectorAll('a[aria-label]');

  if (aElements.length <= 0) {
    console.warn('Target element not found');
    return;
  }

  // Thiết lập style cho container chính
  targetElement6.style.cssText = `
    background-image: url('${frameOrgBackground}');
    background-size: 100% 95%;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    height: 355px;
    display: flex;
    flex-direction: column;
    align-items: center;
    `;

  // Tạo container cho h2 ở phía trên
  const headerContainer = document.createElement('div');
  headerContainer.style.cssText = `
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 105px;
    `;

  // Style cho h2
  if (h2Element) {
    h2Element.style.cssText = `
      margin: 0;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #24292f;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      font-family: 'Cinzel', 'Times New Roman', serif;
    `;
    headerContainer.appendChild(h2Element);
  }

  // Tạo container cho các thẻ a
  const avatarOrgContainer = document.createElement('div');
  avatarOrgContainer.style.cssText = `
    display: grid;
    grid-template-columns: repeat(3, 0fr);
    gap: 5px;
    max-width: 350px;
    justify-items: center;
    align-items: center;
    padding: 0 20px;
    `;

  // URL của hình shield (bạn cần upload hình này vào extension)
  const shieldImageUrl = chrome.runtime.getURL('icon/listOrg.png'); // Thay đổi path cho phù hợp

  // Tạo CSS cho medieval shield với background image
  let shieldStyles = `
    .medieval-shield {
      position: relative;
      width: 70px;
      height: 60px;
      background-image: url('${shieldImageUrl}');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .medieval-shield:hover {
      transform: scale(1.1);
      filter: brightness(1.2) drop-shadow(0 0 15px rgba(255,215,0,0.8));
    }
    `;

  // Thêm CSS vào head
  const styleSheet = document.createElement('style');
  styleSheet.textContent = shieldStyles;
  document.head.appendChild(styleSheet);

  // Style cho từng thẻ a và di chuyển vào container mới
  aElements.forEach((aElement, index) => {
    if (index < 6) {
      // Giới hạn tối đa 6 thẻ a

      // Tạo wrapper shield cho mỗi aElement
      const shieldWrapper = document.createElement('div');
      shieldWrapper.className = 'medieval-shield';

      // Tạo inner container
      const shieldInner = document.createElement('div');
      shieldInner.className = 'medieval-shield-inner';

      // Tạo emblem
      const emblem = document.createElement('div');
      emblem.className = 'medieval-emblem';

      // Style cho aElement
      aElement.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        margin: 6px 0px 5px -5px;
        `;

      // Style cho img bên trong thẻ a
      const imgElement = aElement.querySelector('img');
      if (imgElement) {
        imgElement.style.cssText = `
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      `;
      }

      // Lắp ráp structure: wrapper > inner > aElement + emblem
      shieldInner.appendChild(aElement);
      shieldWrapper.appendChild(shieldInner);
      shieldWrapper.appendChild(emblem);

      avatarOrgContainer.appendChild(shieldWrapper);
    }
  });

  // Xóa nội dung cũ và thêm các container mới
  targetElement6.innerHTML = '';
  targetElement6.appendChild(headerContainer);
  targetElement6.appendChild(avatarOrgContainer);

  // Nếu có ít hơn 6 thẻ a, điều chỉnh grid layout
  if (aElements.length <= 3) {
    avatarOrgContainer.style.gridTemplateColumns = `repeat(${aElements.length}, 1fr)`;
    targetElement6.style.cssText = `
      background-image: url('${frameOrgBackground}');
      background-size: 100% 90%;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;
    headerContainer.style.cssText = `
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 90px;
    `;
    shieldStyles = `
      .medieval-shield {
      position: relative;
      width: 80px;
      height: 70px;
      background-image: url('${shieldImageUrl}');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

      .medieval-shield:hover {
        transform: scale(1.1);
        filter: brightness(1.2) drop-shadow(0 0 15px rgba(255,215,0,0.8));
      }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = shieldStyles;
    document.head.appendChild(styleSheet);

    aElements.forEach((aElement, index) => {
      if (index < 6) {
        // Style cho aElement
        aElement.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      margin: 6px 0px 5px -5px;
      `;

        // Style cho img bên trong thẻ a
        const imgElement = aElement.querySelector('img');
        if (imgElement) {
          imgElement.style.cssText = `
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        `;
        }
      }
    });
  } else if (aElements.length <= 4) {
    avatarOrgContainer.style.gridTemplateColumns = 'repeat(3, 0fr)';
    avatarOrgContainer.style.gridTemplateRows = 'repeat(3, 0fr)';
  }

  console.log('GitHub profile section redesigned successfully');
}
