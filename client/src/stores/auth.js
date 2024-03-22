import { defineStore } from 'pinia';
import authService from 'src/services/auth.service';
import localStorageService from 'src/services/localStorage.service';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorageService.getAccessToken() || null,
    isLoggedIn: localStorageService.getAccessToken() ? true : false,
    userData: null,
    userDataLoaded: false,
    router: useRouter(),
  }),
  getters: {
    logged: (state) => state.isLoggedIn,
  },

  actions: {
    async signUp(payload) {
      try {
        console.log('regist');
        const { content } = await authService.register(payload);
        localStorageService.setTokens({
          refreshToken: content.refresh_token,
          accsessToken: content.access_token,
          ...content,
        });
        this.isLoggedIn = true;
        this.router.push('/profile');
        return content;
      } catch (error) {
        console.log('Error', error);
      }
    },

    async signIn(payload) {
      try {
        console.log('loogg');
        const { content } = await authService.login(payload);
        localStorageService.setTokens({
          refreshToken: content.refresh_token,
          accsessToken: content.access_token,
          ...content,
        });
        this.isLoggedIn = true;
        this.router.push('/profile');
        return content;
      } catch (error) {
        console.log('Error', error);
      }
    },
    async logOut() {
      localStorageService.removeAuthData();
      this.$patch({
        userData: null,
        isLoggedIn: false,
        userDataLoaded: false,
        accessToken: null,
      });
    },

    async getUserData() {
      try {
        const { content } = await authService.getUser();
        this.$patch({
          userData: content,
          userDataLoaded: true,
        });
        return content;
      } catch (error) {
        console.log('Error', error);
      }
    },
    async changeUserData(payload) {
      const idUser = this.userData.userId;
      try {
        await authService.updateUser(idUser, payload);
        this.getUserData();
      } catch (error) {
        console.log('Ошибка отправки данных', error);
      }
    },
  },
});
