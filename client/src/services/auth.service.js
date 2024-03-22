import { api } from 'src/boot/axios';
import localStorageService from './localStorage.service';

const authService = {
  getUser: async () => {
    const { data } = await api.get('user');
    return data;
  },

  register: async (payload) => {
    const { data } = await api.post(`/auth/signup`, payload);
    return data;
  },
  login: async (payload) => {
    const { data } = await api.post(`/auth/signIn`, payload);
    return data;
  },
  updateUser: async (idUser, payload) => {
    const { data } = await api.patch(`user/${idUser}`, payload);
    return data;
  },
  updateRefreshToken: async () => {
    const { data } = await api.post(`/auth/token`, {
      refresh_token: localStorageService.getRefreshToken(),
    });

    return data;
  },
};

export default authService;
