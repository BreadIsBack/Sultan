export const getHeaderHeight = () => {
  const headerMobileHeight = document?.querySelector('.header-mobile').offsetHeight;
  document.querySelector(':root').style.setProperty('--header-mobile-height', `${headerMobileHeight}px`);
}
