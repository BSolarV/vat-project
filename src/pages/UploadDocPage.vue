<template>
	<q-page>
		<!-- File Selector -->
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

		<!-- Report Scope Data -->
		<div v-if="reportScope !== undefined">
			<ReportScopeDetails :report-scope="reportScope" />
		</div>
	</q-page>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import mammoth from 'mammoth';
import {
	Enviroments,
	PentestTypes,
	ReportScope,
	ReportUser,
	Typologies,
} from 'src/components/models';
import ReportScopeDetails from 'src/components/ReportScopeDetails.vue';
//import { ReportScope } from 'src/components/models';

// ===========================
// Global auxiliaries
// ===========================
const { t } = useI18n();

// ===========================
// File selection
// ===========================
const selectedFile: Ref<File | undefined> = ref(undefined);
const fileErrorMessage: Ref<string | undefined> = ref(undefined);

// process File
async function processReportFile(file: File) {
	fileErrorMessage.value = undefined;

	if (!(file instanceof File)) {
		fileErrorMessage.value = 'uploadDocPage_fileGenericError';
		return;
	}
	try {
		selectedFile.value = file;
		const arrayBuffer = await file.arrayBuffer();
		processScope(arrayBuffer);
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
		console.error(error);
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
const reportScope: Ref<ReportScope | undefined> = ref(undefined);

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
