<template>
	<div class="login">
		<h2>Login</h2>
		<button
			@click="loginWithGoogle"
			class="login-with-google-btn google-btn-scale"
		>
			Sing In with Google
		</button>
		<p v-if="errorMessage">{{ errorMessage }}</p>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import { auth } from 'boot/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { useAuth } from '@vueuse/firebase';
import { loading } from 'src/components/injectionSymbols';

defineOptions({
	name: 'IndexPage',
});

const errorMessage = ref('');

const { requestLoading, releaseLoading } = inject(loading, {
	loadingRequests: ref(0),
	requestLoading: () => {},
	releaseLoading: () => {},
});

const { isAuthenticated } = useAuth(auth);

const router = useRouter();

const loginWithGoogle = async () => {
	requestLoading();
	try {
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
	} catch (error: unknown) {
		if (error instanceof Error) errorMessage.value = error.message;
		else console.error(error);
	} finally {
		releaseLoading();
		router.push('/');
	}
};

onMounted(() => {
	if (isAuthenticated.value === true) router.push('/');
});
</script>

<style>
.login {
	text-align: center;
	margin-top: 16px;
}

.google-btn-scale {
	scale: 1.5;
	padding: 10px 20px;
	font-size: 16px;
}

.login-with-google-btn {
	transition: background-color 0.3s, box-shadow 0.3s;

	padding: 12px 16px 12px 42px;
	border: none;
	border-radius: 3px;
	box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);

	color: #757575;
	font-size: 14px;
	font-weight: 500;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
		Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
		sans-serif;

	background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
	background-color: white;
	background-repeat: no-repeat;
	background-position: 12px 11px;

	&:hover {
		box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25);
	}

	&:active {
		background-color: #eeeeee;
	}

	&:focus {
		outline: none;
		box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25),
			0 0 0 3px #c8dafc;
	}

	&:disabled {
		filter: grayscale(100%);
		background-color: #ebebeb;
		box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);
		cursor: not-allowed;
	}
}
</style>
