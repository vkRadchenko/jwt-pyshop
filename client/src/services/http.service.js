/* import axios from 'axios';
import config from '../config.json';
import localStorageService from './localStorage.service';
import authService from './auth.service';

const http = axios.create({ baseURL: config.apiEndPoint });
let isRefreshingToken = false;

http.interceptors.request.use(
  async function (config) {
    const expiresDate = localStorageService.getTokenExpiresDate();
    const refreshToken = localStorageService.getRefreshToken();

    // Проверяем истек ли токен или срок его действия заканчивается в ближайшем будущем
    if (
      refreshToken &&
      (!expiresDate || expiresDate < Date.now()) &&
      !isRefreshingToken
    ) {
      isRefreshingToken = true;
      try {
        const { content } = await authService.updateRefreshToken();
        localStorageService.setTokens(content);
        // После обновления токена обновляем expiresDate
        expiresDate = localStorageService.getTokenExpiresDate();
      } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
      } finally {
        isRefreshingToken = false;
      }
    }

    const accessToken = localStorageService.getAccessToken();
    console.log('accessToken', accessToken);
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    return config;
  },
  function (error) {
    console.log('Мы попали в ошибку httpservice');
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (res) => {
    res.data = { content: res.data };

    return res;
  },
  function (error) {
    const expectedErrors =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedErrors) {
      console.log('expectedErrors', error);
    }
    return Promise.reject(error);
  }
);

const httpService = {
  get: http.get,
  post: http.post,
  patch: http.patch,
  delete: http.delete,
};
export default httpService;
 */
