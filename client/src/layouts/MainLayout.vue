<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> My App </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list bordered separator>
        <q-item to="/profile" clickable v-ripple>
          <q-item-label> Main </q-item-label>
        </q-item>
        <q-item to="/auth/signin" clickable v-ripple>
          <q-item-label> Login </q-item-label>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="welcome-page">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default {
  name: 'MainLayout',

  data() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
    };
  },

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
  },
};
</script>

<style></style>
