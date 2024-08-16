<template>
	<div class="row fit q-col-gutter-md q-pa-md">
		<div class="col-12 col-md-6">
			<q-select
				v-model="reportScopeRef.client"
				:error="!reportScopeRef.client"
				:options="clientOptions"
				:label="t('client')"
				option-value="id"
				option-label="name"
				emit-value
				map-options
			/>
		</div>

		<div class="col-12 col-md-6">
			<q-select
				v-model="reportScopeRef.pentestType"
				:error="!reportScopeRef.pentestType"
				:options="pentestTypeOptions"
				:label="t('pentest_type')"
				emit-value
				map-options
			/>
		</div>

		<div class="col-12 col-md-6">
			<q-select
				v-model="reportScopeRef.enviroment"
				:error="!reportScopeRef.enviroment"
				:options="enviromentOptions"
				:label="t('environment')"
				emit-value
				map-options
			/>
		</div>

		<div class="col-12 col-md-6">
			<q-select
				v-model="reportScopeRef.typology"
				:error="!reportScopeRef.typology"
				:options="typologyOptions"
				:label="t('typology')"
				emit-value
				map-options
			/>
		</div>

		<div class="col-12 col-md-6">
			<q-input
				v-model="reportScopeRef.appName"
				:error="!reportScopeRef.appName"
				:label="t('app_name')"
			/>
		</div>

		<div class="col-12 col-md-6">
			<q-input
				v-model="reportScopeRef.URL"
				:error="!reportScopeRef.URL"
				:label="t('url')"
			/>
		</div>

		<div class="col-12 col-md-6">
			<q-field
				:error="!reportScopeRef.beginDate || !reportScopeRef.endDate"
				:label="t('date_range')"
				@click="openDatePicker"
			>
				<template v-slot:control>
					<span>{{
						`${reportScopeRef.beginDate} ${t('two_date_joiner')} ${
							reportScopeRef.endDate
						}`
					}}</span>
				</template>
			</q-field>
		</div>

		<div class="col-12 col-md-6">
			<q-input
				v-model="reportScopeRef.observations"
				:error="!reportScopeRef.observations"
				:label="t('observations')"
			/>
		</div>

		<div class="col-12">
			<q-expansion-item
				expand-separator
				icon="perm_identity"
				label="Users"
			>
				<q-table
					:rows="reportScopeRef.users"
					:columns="userColumns"
					row-key="username"
				>
					<template v-slot:body-cell="props">
						<q-td
							v-if="props.col.field === 'username'"
							:props="props"
						>
							<q-input v-model="props.row.username" dense />
						</q-td>
						<q-td
							v-if="props.col.field === 'userRole'"
							:props="props"
						>
							<q-input v-model="props.row.userRole" dense />
						</q-td>
						<q-td
							v-if="props.col.field === 'comment'"
							:props="props"
						>
							<q-input v-model="props.row.comment" dense />
						</q-td>
						<q-td
							v-if="props.col.field === 'actions'"
							:props="props"
						>
							<q-btn
								flat
								icon="delete"
								color="negative"
								@click="removeUser(props.row)"
							/>
						</q-td>
					</template>

					<template v-if="!readonly" v-slot:bottom-row>
						<q-tr>
							<q-td colspan="100%" @click="addUser">
								Add User
							</q-td>
						</q-tr>
					</template>
				</q-table>
			</q-expansion-item>
		</div>
	</div>

	<q-date
		v-model="dateRange"
		range
		v-if="showDatePicker"
		@hide="applyDateRange"
	/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
	Enviroments,
	Typologies,
	PentestTypes,
	ReportScope,
	ReportUser,
} from './models'; // Adjust the import path as needed

const { t } = useI18n();

const props = withDefaults(
	defineProps<{
		reportScope: ReportScope;
		readonly?: boolean;
	}>(),
	{ readonly: false }
);

const emit = defineEmits<{
	(e: 'updateReportScope', reportScope: ReportScope): void;
}>();

const clientOptions = [
	{ id: 'xyzxyz', name: 'Habitat', serviceSector: 'serviceSector_other' },
];

const pentestTypeOptions = Object.values(PentestTypes).map((value) => ({
	label: t(value),
	value,
}));
const enviromentOptions = Object.values(Enviroments).map((value) => ({
	label: t(value),
	value,
}));
const typologyOptions = Object.values(Typologies).map((value) => ({
	label: t(value),
	value,
}));

const reportScopeRef = ref<ReportScope>(props.reportScope);

const showDatePicker = ref(false);
const dateRange = ref([
	reportScopeRef.value.beginDate,
	reportScopeRef.value.endDate,
]);

const openDatePicker = () => {
	showDatePicker.value = true;
};

const applyDateRange = () => {
	showDatePicker.value = false;
	reportScopeRef.value.beginDate = dateRange.value[0];
	reportScopeRef.value.endDate = dateRange.value[1];
	emit('updateReportScope', reportScopeRef.value);
};

const userColumns = [
	{
		name: 'username',
		label: t('username'),
		align: 'left',
		field: 'username',
	},
	{
		name: 'userRole',
		label: t('user_role'),
		align: 'left',
		field: 'userRole',
	},
	{ name: 'comment', label: t('comment'), align: 'left', field: 'comment' },
	{ name: 'actions', field: 'actions', label: t('actions'), align: 'right' },
];

const addUser = () => {
	reportScopeRef.value.users.push({
		username: '',
		userRole: '',
		comment: '',
	});
};

const removeUser = (user: ReportUser) => {
	reportScopeRef.value.users = reportScopeRef.value.users.filter(
		(u) => u !== user
	);
	emit('updateReportScope', reportScopeRef.value);
};
</script>

<style scoped>
/* Add any necessary styles here */
</style>
