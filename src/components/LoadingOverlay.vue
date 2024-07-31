<template>
	<div v-if="isLoading" class="loading-overlay">
		<div class="loader"></div>
	</div>
</template>

<script setup lang="ts">
defineOptions({
	name: 'LoadingOverlay',
});

import { inject } from 'vue';

const isLoading = inject('isLoading');
</script>

<style>
.loading-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

/* HTML: <div class="loader"></div> */
.loader {
	width: 60px;
	aspect-ratio: 1;
	display: grid;
}
.loader,
.loader:before,
.loader:after {
	--c: no-repeat linear-gradient(#ffffff 0 0);
	background: var(--c), var(--c), var(--c), var(--c);
	animation: l19-1 1.5s infinite, l19-2 1.5s infinite;
}
.loader:before,
.loader:after {
	content: '';
	grid-area: 1/1;
	transform: translate(calc(50% - 2px), calc(2px - 50%)) rotate(90deg);
	animation-delay: -0.25s;
}
.loader:after {
	transform: translate(calc(2px - 50%), calc(50% - 2px)) rotate(90deg);
}
@keyframes l19-1 {
	0%,
	10% {
		background-size: 0 4px, 4px 0;
	}
	40%,
	60% {
		background-size: 100% 4px, 4px 100%;
	}
	90%,
	100% {
		background-size: 0 4px, 4px 0;
	}
}
@keyframes l19-2 {
	0%,
	49.9% {
		background-position: 0 0, 0 0, 100% 100%, 100% 100%;
	}
	50%,
	100% {
		background-position: 100% 0, 0 100%, 0 100%, 100% 0;
	}
}
</style>
