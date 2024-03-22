<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="q-pa-md" style="width: 400px">
          <div class="flex justify-center">
            <q-tabs v-model="activeTab" dense>
              <q-tab name="login" label="Вход" icon="person"></q-tab>
              <q-tab
                name="register"
                label="Регистрация"
                icon="person_add"
              ></q-tab>
            </q-tabs>
          </div>
          <q-tab-panels v-model="activeTab">
            <q-tab-panel name="login">
              <q-form @submit="login">
                <q-input v-model="loginForm.email" label="Email" type="email" />
                <q-input
                  v-model="loginForm.password"
                  label="Пароль"
                  type="password"
                />
                <q-btn type="submit" label="Войти" color="primary" />
              </q-form>
            </q-tab-panel>
            <q-tab-panel name="register">
              <q-form @submit="register">
                <q-input
                  v-model="registerForm.username"
                  label="Имя"
                  type="text"
                />
                <q-input
                  v-model="registerForm.phone"
                  label="Телефон"
                  type="number"
                />
                <q-input
                  v-model="registerForm.adress"
                  label="Адрес"
                  type="text"
                />
                <q-input
                  v-model="registerForm.email"
                  label="Email"
                  type="email"
                  required
                />
                <q-input
                  v-model="registerForm.password"
                  label="Пароль"
                  type="password"
                  required
                />

                <q-btn
                  type="submit"
                  label="Зарегистрироваться"
                  color="primary"
                />
              </q-form>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';
import localStorageService from 'src/services/localStorage.service';

export default {
  data() {
    const store = useAuthStore();
    const route = useRouter();
    return {
      store,
      route,
      activeTab: 'login',
      loginForm: {
        email: '',
        password: '',
      },
      registerForm: {
        username: '',
        email: '',
        phone: '',
        adress: '',
        password: '',
      },
    };
  },

  methods: {
    async login() {
      if (!this.loginForm.email || !this.loginForm.password) {
        this.$q.notify({
          type: 'negative',
          message: 'Пожалуйста, заполните все поля',
          position: 'bottom-right',
          timeout: 2000,
        });
        return;
      }
      try {
        await this.store.signIn(this.loginForm);
      } catch (error) {
        console.log('Error', error);
      }
    },
    async register() {
      if (!this.registerForm.email || !this.registerForm.password) {
        this.$q.notify({
          type: 'negative',
          message: 'Поля email и password обязательны к заполнению',
          position: 'bottom-right',
          timeout: 2000,
        });
        return;
      }
      await this.store.signUp(this.registerForm);
    },

    clearForm() {
      if (this.activeTab === 'login') {
        this.loginForm.email = '';
        this.loginForm.password = '';
      } else if (this.activeTab === 'register') {
        this.registerForm.email = '';
        this.registerForm.password = '';
      }
    },
  },
};
</script>

<style scoped>
.q-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.auth-card {
  max-width: 400px;
  width: 100%;
}
.q-btn {
  margin-top: 20px;
}
.q-tab__icon {
  margin-right: 20px;
}
</style>
