<template>
	<q-page>
		<div class="row fit q-pa-md q-col-gutter-md">
			<div
				v-if="selectedFile === undefined"
				class="col-* self-center text-h6"
			>
				{{ t('uploadDocPage_uploadDocumentLabel') }}:
			</div>
			<div class="col-grow">
				<q-file dense standout v-model="selectedFile">
					<template v-slot:prepend>
						<q-icon name="attach_file" />
					</template>
				</q-file>
			</div>
		</div>
	</q-page>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const selectedFile: Ref<File | undefined> = ref(undefined);
</script>
