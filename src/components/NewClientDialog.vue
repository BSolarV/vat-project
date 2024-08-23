<template>
	<q-dialog v-model="dialogControler">
		<q-card style="width: 80vw; max-width: 80vw">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">{{ t('NewClientDialog_Title') }}</div>
				<q-space />
				<q-btn icon="close" flat round dense v-close-popup />
			</q-card-section>

			<q-card-section class="q-pt-none">
				<div v-if="errorMessage" class="text-negative">
					{{ errorMessage }}
				</div>
				<q-input
					v-model="newClient.name"
					:label="t('NewClientDialog_Name')"
					:error="!newClient.name"
					required
				/>
				<q-select
					v-model="newClient.serviceSector"
					:label="t('NewClientDialog_ServiceSector')"
					:options="serviceSectorOptions"
					option-label="label"
					option-value="value"
					map-options
					required
					emit-value
					:error="!newClient.serviceSector"
				/>
			</q-card-section>

			<q-card-actions align="right">
				<q-btn
					flat
					label="OK"
					color="primary"
					@click="saveClient"
					:disable="!newClient.name || !newClient.serviceSector"
				/>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { firestore } from 'src/boot/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ServiceSectors, Client } from './models';
import { loading } from './injectionSymbols';
import { useI18n } from 'vue-i18n';

const dialogControler = defineModel<boolean>({ required: true });

const emit = defineEmits<{
	(e: 'notifyClientCreated', clientId: string): void;
}>();

const { t } = useI18n();

const { requestLoading, releaseLoading } = inject(loading, {
	loadingRequests: ref(0),
	requestLoading: () => {},
	releaseLoading: () => {},
});

const newClient = ref<Client>({
	name: '',
	serviceSector: ServiceSectors.other,
});

const serviceSectorOptions = Object.values(ServiceSectors).map((value) => ({
	label: t(value),
	value,
}));

const errorMessage = ref('');

const saveClient = async () => {
	requestLoading();
	try {
		const clientsCollectionRef = collection(firestore, 'Clients');
		const createdClientRef = await addDoc(
			clientsCollectionRef,
			newClient.value
		);
		emit('notifyClientCreated', createdClientRef.id);
		dialogControler.value = false;
	} catch (error) {
		console.error('Error adding document: ', error);
		if (error instanceof Error) errorMessage.value = error.message;
	} finally {
		releaseLoading();
	}
};
</script>
