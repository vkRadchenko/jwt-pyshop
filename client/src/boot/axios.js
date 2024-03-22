import { boot } from 'quasar/wrappers';
import axios from 'axios';
import localStorageService from 'src/services/localStorage.service';
import authService from 'src/services/auth.service';

const api = axios.create({ baseURL: 'http://localhost:8080' });

let isRefreshingToken = false;

export default boot(({ app }) => {
  api.interceptors.request.use(
    async function (config) {
      let expiresDate = localStorageService.getTokenExpiresDate();
      const refreshToken = localStorageService.getRefreshToken();

      // Проверяем истек ли токен или срок его действия заканчивается в ближайшем будущем
      if (
        refreshToken &&
        (!expiresDate || Number(expiresDate) < Date.now()) &&
        !isRefreshingToken
      ) {
        isRefreshingToken = true;
        try {
          const { content } = await authService.updateRefreshToken();
          localStorageService.setTokens(content);
        } catch (error) {
          console.error('Ошибка при обновлении токена:', error);
        } finally {
          isRefreshingToken = false;
        }
      }

      const accessToken = localStorageService.getAccessToken();
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

  api.interceptors.response.use(
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
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { axios, api };
