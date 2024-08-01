import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/login',
		component: () => import('pages/LoginPage.vue'),
		meta: {
			title: 'loginPage_title',
			nav_pane: false,
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
			icon: 'space_dashboard',
			nav_pane: true,
		},
	},
	{
		path: '/upload_document',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{ path: '', component: () => import('pages/UploadDocPage.vue') },
		],
		meta: {
			title: 'uploadDocPage_title',
			icon: 'upload_file',
			nav_pane: true,
		},
	},
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue'),
		meta: {
			title: 'errorPage_title',
			nav_pane: false,
		},
	},
];

export default routes;
