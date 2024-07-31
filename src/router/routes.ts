import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/login',
		component: () => import('pages/LoginPage.vue'),
		meta: {
			title: 'loginPage_title',
		},
	},
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{ path: '', component: () => import('pages/IndexPage.vue') },
		],
		meta: {
			title: 'dashboardPage_title',
		},
	},
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue'),
		meta: {
			title: 'errorPage_title',
		},
	},
];

export default routes;
