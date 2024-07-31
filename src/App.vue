<template>
	<LoadingOverlay />
	<LoginPage v-if="!isAuthenticated" />
	<router-view v-else />
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from 'vue';
import { useAuth } from '@vueuse/firebase';
import { auth } from './boot/firebase';
import LoginPage from './pages/LoginPage.vue';
import LoadingOverlay from './components/LoadingOverlay.vue';

defineOptions({
	name: 'App',
});

const isLoading = ref(true);

provide('isLoading', isLoading);

const { isAuthenticated } = useAuth(auth);

onMounted(() => {
	setTimeout(() => {
		if (isAuthenticated.value === true) isLoading.value = false;
		else if (isAuthenticated.value === false) isLoading.value = false;
	}, 1000);
});
</script>
