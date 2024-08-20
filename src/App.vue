<template>
	<LoadingOverlay />
	<LoginPage v-if="!isAuthenticated" />
	<router-view v-else />
</template>

<script setup lang="ts">
import { onMounted, provide, Ref, ref } from 'vue';
import { useAuth } from '@vueuse/firebase';
import { auth } from './boot/firebase';
import LoginPage from './pages/LoginPage.vue';
import LoadingOverlay from './components/LoadingOverlay.vue';
import { loading } from './components/injectionSymbols';

defineOptions({
	name: 'App',
});

const loadingRequests: Ref<number> = ref<number>(1);
const requestLoading = () => {
	loadingRequests.value += 1;
};
const releaseLoading = () => {
	if (loadingRequests.value > 0) loadingRequests.value -= 1;
};

provide(loading, {
	loadingRequests: loadingRequests,
	requestLoading: requestLoading,
	releaseLoading: releaseLoading,
});

const { isAuthenticated } = useAuth(auth);

onMounted(() => {
	setTimeout(() => {
		releaseLoading();
	}, 1000);
});
</script>
