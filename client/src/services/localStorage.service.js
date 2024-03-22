import { LocalStorage } from 'quasar';

const TOKEN_KEY = 'jwt-token';
const REFRESH_KEY = 'jwt-refresh-token';
const EXPIRES_KEY = 'jwt-expires';
const USERID_KEY = 'user-local-id';

export function setTokens({ refreshToken, accsessToken, userId, expiresIn }) {
  const expiresDate = new Date().getTime() + expiresIn * 1000;
  LocalStorage.set(USERID_KEY, userId);
  LocalStorage.set(TOKEN_KEY, accsessToken);
  LocalStorage.set(REFRESH_KEY, refreshToken);
  LocalStorage.set(EXPIRES_KEY, expiresDate);
}

export function getAccessToken() {
  return LocalStorage.getItem(TOKEN_KEY);
}
console.log('localStorage', getAccessToken());
export function getRefreshToken() {
  return LocalStorage.getItem(REFRESH_KEY);
}
export function getTokenExpiresDate() {
  return LocalStorage.getItem(EXPIRES_KEY);
}
export function getUserId() {
  return LocalStorage.getItem(USERID_KEY);
}
export function removeAuthData() {
  LocalStorage.remove(USERID_KEY);
  LocalStorage.remove(TOKEN_KEY);
  LocalStorage.remove(REFRESH_KEY);
  LocalStorage.remove(EXPIRES_KEY);
}
const localStorageService = {
  setTokens,
  getAccessToken,
  getRefreshToken,
  getTokenExpiresDate,
  getUserId,
  removeAuthData,
};

export default localStorageService;
