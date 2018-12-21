// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  return localStorage.getItem('store2-authority') || 'guest';
}

export function setAuthority(authority) {
  return localStorage.setItem('store2-authority', authority);
}

export function getRoles() {
  return localStorage.getItem('store2-roles') || '';
}

export function setRoles(roles) {
  return localStorage.setItem('store2-roles', roles);
}

export function getMenus() {
  return localStorage.getItem('store2-menus') || '';
}

export function setMenus(menus) {
  return localStorage.setItem('store2-menus', menus);
}

export function getSysMenu() {
  return localStorage.getItem('store2-sysMenu') || '';
}

export function setSysMenu(menus) {
  return localStorage.setItem('store2-sysMenu', menus);
}
