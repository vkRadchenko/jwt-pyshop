<template>
  <q-page class="user-page">
    <q-card class="user-card">
      <q-card-section>
        <h4 class="title__profileUser">Профиль пользователя</h4>
      </q-card-section>
      <q-card-section v-if="store.logged">
        <div v-if="store.userData">
          <p><strong>Имя:</strong> {{ store.userData.username }}</p>
          <p><strong>Email:</strong> {{ store.userData.email }}</p>
          <p><strong>Телефон:</strong> {{ store.userData.phone }}</p>
          <p><strong>Адрес:</strong> {{ store.userData.adress }}</p>
        </div>
        <div v-else>
          <p>Данные пользователя не загружены</p>
        </div>
        <div v-if="!isEditing">
          <q-btn
            @click="toggleEditing"
            label="Редактировать"
            color="primary"
            class="btn__edit"
          />
          <q-btn @click="toggleLogout" label="Выйти" color="negative" />
        </div>
      </q-card-section>
      <q-card-section v-else>
        <p>Пользователь не авторизован</p>
        <q-btn
          @click="redirectToLogIn"
          label="Авторизоваться"
          color="primary"
        />
      </q-card-section>
      <q-card-section v-if="isEditing">
        <q-form @submit="submitChanges">
          <q-input v-model="editedData.username" label="Имя" />
          <q-input v-model="editedData.email" label="Email" />
          <q-input v-model="editedData.phone" label="Телефон" />
          <q-input v-model="editedData.adress" label="Адрес" />
          <div class="btn__editForm">
            <q-btn type="submit" label="Сохранить" color="primary" />
            <q-btn @click="cancelEditing" label="Отмена" color="negative" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useAuthStore } from 'src/stores/auth';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useAuthStore();
    const route = useRouter();
    const isEditing = ref(false);
    const editedData = reactive({
      username: '',
      email: '',
      phone: '',
      adress: '',
    });

    const toggleEditing = () => {
      isEditing.value = !isEditing.value;
      if (isEditing.value && store.userData) {
        editedData.username = store.userData.username;
        editedData.email = store.userData.email;
        editedData.phone = store.userData.phone;
        editedData.adress = store.userData.adress;
      }
    };

    const cancelEditing = () => {
      isEditing.value = false;
    };

    const toggleLogout = () => {
      store.logOut();
    };

    const redirectToLogIn = () => {
      route.push('/auth/signin');
    };

    const submitChanges = async () => {
      try {
        await store.changeUserData(editedData);
        isEditing.value = false;
      } catch (error) {
        console.log('Ошибка отправки формы профиля', error);
      }
    };

    onMounted(() => {
      if (store.isLoggedIn) {
        store.getUserData();
      }
    });

    return {
      store,
      route,
      isEditing,
      editedData,
      toggleEditing,
      cancelEditing,
      toggleLogout,
      redirectToLogIn,
      submitChanges,
    };
  },
};
</script>

<style scoped>
.user-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.user-card {
  max-width: 400px;
  width: 100%;
  padding: 15px;
}

.title__profileUser {
  margin: 0;
}

.user-info p {
  margin-bottom: 10px;
}

.btn__editForm {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}

.edit-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.btn__edit {
  margin-right: 10px;
}
</style>
