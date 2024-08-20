<template>
	<q-page>
		<!-- ------------- -->
		<!-- File Selector -->
		<!-- ------------- -->
		<TransitionGroup
			tag="div"
			name="fade"
			class="row fit q-pa-md q-col-gutter-md"
		>
			<div
				v-if="selectedFile === undefined"
				class="col-* self-center text-subtitle1 animateMe"
				key="label"
			>
				{{ t('uploadDocPage_uploadDocumentLabel') }}:
			</div>
			<div class="col-grow animateMe" key="box">
				<q-file
					dense
					outlined
					:model-value="selectedFile"
					@update:model-value="processReportFile"
					:error-message="fileErrorMessage"
					:error="fileErrorMessage !== undefined"
					:hide-bottom-space="false"
				>
					<template v-slot:prepend>
						<q-icon name="attach_file" />
					</template>
				</q-file>
			</div>
		</TransitionGroup>

		<!-- ----------------- -->
		<!-- Report Scope Data -->
		<!-- ----------------- -->
		<div v-if="fileProcessStages.scope">
			<ReportScopeDetails
				v-model="reportScope"
				:clients-collection="clients"
				@notifyClientCreated="
					(clientId: string) => {
						requestLoading();
						fetchClients().then(
							() => {
								reportScope.client = clientId;
							}
						).finally(() => {
							releaseLoading();
						});
					}
				"
			/>
		</div>

		<!-- ------------------------- -->
		<!-- Vulnerability Card Mapper -->
		<!-- ------------------------- -->
	</q-page>
</template>

<script setup lang="ts">
import { inject, onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import mammoth from 'mammoth';
import {
	Client,
	ClientsCollection,
	Enviroments,
	PentestTypes,
	ReportScope,
	ReportUser,
	Typologies,
} from 'src/components/models';
import ReportScopeDetails from 'src/components/ReportScopeDetails.vue';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from 'src/boot/firebase';
import { loading } from 'src/components/injectionSymbols';

// ===========================
// Global auxiliaries
// ===========================

const { t } = useI18n();

const { requestLoading, releaseLoading } = inject(loading, {
	loadingRequests: ref(0),
	requestLoading: () => {},
	releaseLoading: () => {},
});

// ===========================
// Database access
// ===========================

const clients: Ref<ClientsCollection> = ref({});
async function fetchClients() {
	requestLoading();
	try {
		const querySnapshot = await getDocs(collection(firestore, 'Clients'));
		querySnapshot.docs.map(
			(doc) => (clients.value[doc.id] = doc.data() as Client)
		);
	} catch (error) {
		console.error('Error fetching clients:', error);
	} finally {
		releaseLoading();
	}
}

// ===========================
// File selection
// ===========================
const selectedFile: Ref<File | undefined> = ref(undefined);
const fileErrorMessage: Ref<string | undefined> = ref(undefined);

// process File
async function processReportFile(file: File) {
	requestLoading();

	fileErrorMessage.value = undefined;

	if (!(file instanceof File)) {
		fileErrorMessage.value = 'uploadDocPage_fileGenericError';
		return;
	}
	try {
		selectedFile.value = file;
		const arrayBuffer = await file.arrayBuffer();
		await processScope(arrayBuffer);
	} catch (error: unknown) {
		if (error instanceof Error) {
			if (error.name === 'process_file_error') {
				fileErrorMessage.value = 'uploadDocPage_fileProcessError';
				return;
			} else {
				fileErrorMessage.value = 'uploadDocPage_fileGenericError';
				return;
			}
		}
	} finally {
		fileProcessStages.value.scope = true;
		releaseLoading();
	}
}

// Process scope
async function processScope(arrayBuffer: ArrayBuffer) {
	const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
	const html = result.value;
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	const alcanceH2 = Array.from(doc.querySelectorAll('H2')).find(
		(element) => element.textContent?.trim() === 'Alcance'
	);
	if (alcanceH2) {
		console.log('Alcance H2 encontrado. Analizando la tabla:');
		let sibling = alcanceH2.nextElementSibling;
		while (sibling && sibling.tagName !== 'H2') {
			if (sibling.tagName === 'TABLE') {
				processScopeTable(sibling);
				break;
			}
			sibling = sibling.nextElementSibling;
		}
	} else {
		console.log('No se encontró un H2 con el texto "Alcance".');
	}
}

// ===========================
// File processing
// ===========================

const fileProcessStages = ref({
	scope: false,
	vulnerabilities: false,
});

const reportScope: Ref<ReportScope> = ref({
	client: '',
	appName: '',
	pentestType: <PentestTypes>'',
	URL: '',
	beginDate: '',
	endDate: '',
	enviroment: <Enviroments>'',
	typology: <Typologies>'',
	users: [],
	observations: '',
});

// Process Scope table
function processScopeTable(table: Element) {
	const rows = table.querySelectorAll('tr');
	if (rows.length >= 3) {
		// Get dates
		const date: string =
			rows[2].querySelectorAll('td, th')[1]?.textContent || '';

		const datePattern =
			/(\d{2})[\/-](\d{2})[\/-](\d{4})\s+\w+\s+(\d{2})[\/-](\d{2})[\/-](\d{4})/;

		const match = date.match(datePattern);

		let startDate = '';
		let endDate = '';

		if (match) {
			const day1 = match[1];
			const month1 = match[2];
			const year1 = match[3];
			const day2 = match[4];
			const month2 = match[5];
			const year2 = match[6];

			startDate = `${year1}/${month1}/${day1}`;
			endDate = `${year2}/${month2}/${day2}`;
		}

		// Get typology
		let typology: string = '';
		const typologyMapper: { [index: number]: string } = {
			1: 'typology_whiteBox',
			2: 'typology_grayBox',
			3: 'typology_blackBox',
		};

		for (let index = 0; index < 3; index++) {
			if (
				rows[5].querySelectorAll('td, th')[index + 1]?.textContent !==
				'-'
			)
				typology = typologyMapper[index + 1];
		}

		// Get enviroment
		let enviroment: string = '';
		const enviromentMapper: { [index: number]: string } = {
			1: 'enviroment_production',
			2: 'enviroment_preProduction',
			3: 'enviroment_development',
		};
		for (let index = 0; index < 3; index++) {
			if (
				rows[6].querySelectorAll('td, th')[index + 1]?.textContent !==
				'-'
			)
				enviroment = enviromentMapper[index + 1];
		}

		// Get users
		let users: ReportUser[] = [];
		for (let index = 8; index < rows.length - 1; index++) {
			const username =
				rows[index].querySelectorAll('td, th')[0]?.textContent || '';
			if (username) {
				const userData: ReportUser = {
					username: username,
					userRole:
						rows[index].querySelectorAll('td, th')[1]
							?.textContent || '',
					comment:
						rows[index].querySelectorAll('td, th')[2]
							?.textContent || '',
				};
				users.push(userData);
			}
		}

		const scopeData: ReportScope = {
			appName: rows[0].querySelectorAll('td, th')[1]?.textContent || '',
			URL: rows[1].querySelectorAll('td, th')[1]?.textContent || '',
			beginDate: startDate,
			endDate: endDate,
			enviroment: <Enviroments>enviroment || undefined,
			typology: <Typologies>typology || undefined,
			users: users,
			observations:
				rows[rows.length - 1].querySelectorAll('td, th')[1]
					?.textContent || '',
			pentestType: <PentestTypes>'',
			client: '',
		};
		console.log('Datos de alcance extraídos:', scopeData);
		reportScope.value = scopeData;
	} else {
		console.log('La tabla de alcance no tiene suficientes filas.');
	}
}

// ===========================
// On Mounted
// ===========================

onMounted(() => {
	fetchClients();
});
</script>

<style>
.fade-move,
.fade-enter-active,
.fade-leave-active {
	transition: all 0.5s;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translate(-50px, 0);
}

.fade-leave-active {
	position: absolute;
}
</style>
