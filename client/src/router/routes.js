const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'profile',
        component: () => import('pages/UserPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'auth/signin',
        component: () => import('pages/LoginPage.vue'),
        meta: { requiresGuest: true },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
