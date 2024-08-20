import type { InjectionKey, Ref } from 'vue';

export const loading = Symbol() as InjectionKey<{
	loadingRequests: Ref<number>;
	requestLoading: () => void;
	releaseLoading: () => void;
}>;
