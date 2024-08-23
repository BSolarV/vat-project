<template>
	<div class="q-px-md">
		<span class="text-h6">{{ t('ReportScopeDetails_Title') }}</span>
		<div class="row q-col-gutter-md">
			<div class="col-12 col-md-6">
				<div class="row q-col-gutter-md">
					<div class="col-grow">
						<q-select
							:model-value="clientText"
							@input-value="(inputText: string) => (clientText = inputText)"
							@update:model-value="
					(clientOption: SelectOption) => {
						reportScopeRef.client = clientOption.value;
						clientText = clientOption.label;
					}
				"
							@blur="
								() => {
									const client =
										props.clientsCollection[
											reportScopeRef.client
										];
									if (!client) {
										clientText = '';
									} else {
										clientText = client.name;
									}
								}
							"
							:error="!reportScopeRef.client"
							:options="filteredClientOptionsRef"
							:label="t('ReportScopeDetails_client')"
							:readonly="props.readonly"
							use-input
							hide-selected
							fill-input
							input-debounce="0"
							@filter="filterClients"
						>
							<template v-slot:no-option>
								<q-item>
									<q-item-section>
										{{ t('select_filterNoResults') }}
									</q-item-section>
								</q-item>
							</template>
						</q-select>
					</div>
					<div v-if="!readonly" class="col-shrink self-center">
						<div class="row justify-right">
							<q-btn
								outline
								round
								dense
								icon="add"
								@click="newClientDialogOpener = true"
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="col-12 col-md-6">
				<q-select
					v-model="reportScopeRef.pentestType"
					:error="!reportScopeRef.pentestType"
					:options="pentestTypeOptions"
					:label="t('ReportScopeDetails_pentest_type')"
					:readonly="props.readonly"
					emit-value
					map-options
				/>
			</div>

			<div class="col-12 col-md-6">
				<q-select
					v-model="reportScopeRef.enviroment"
					:error="!reportScopeRef.enviroment"
					:options="enviromentOptions"
					:label="t('ReportScopeDetails_environment')"
					:readonly="props.readonly"
					emit-value
					map-options
				/>
			</div>

			<div class="col-12 col-md-6">
				<q-select
					v-model="reportScopeRef.typology"
					:error="!reportScopeRef.typology"
					:options="typologyOptions"
					:label="t('ReportScopeDetails_typology')"
					:readonly="props.readonly"
					emit-value
					map-options
				/>
			</div>

			<div class="col-12 col-md-6">
				<q-input
					v-model="reportScopeRef.appName"
					:error="!reportScopeRef.appName"
					:label="t('ReportScopeDetails_app_name')"
					:readonly="props.readonly"
				/>
			</div>

			<div class="col-12 col-md-6">
				<q-input
					v-model="reportScopeRef.URL"
					:error="!reportScopeRef.URL"
					:label="t('ReportScopeDetails_url')"
					:readonly="props.readonly"
				/>
			</div>

			<div class="col-12 col-md-6">
				<q-field
					:error="
						!reportScopeRef.beginDate || !reportScopeRef.endDate
					"
					:label="t('ReportScopeDetails_date_range')"
					:readonly="props.readonly"
					stack-label
				>
					<template v-slot:control>
						<span
							@click="
								() => {
									console.log('clicked');
									openDatePicker();
								}
							"
							>{{
								`${reportScopeRef.beginDate} ${t(
									'ReportScopeDetails_two_date_joiner'
								)} ${reportScopeRef.endDate}`
							}}</span
						>
					</template>
				</q-field>
			</div>

			<div class="col-12 col-md-6">
				<q-input
					v-model="reportScopeRef.observations"
					:label="t('ReportScopeDetails_observations')"
					:readonly="props.readonly"
				/>
			</div>

			<div class="col-12">
				<q-expansion-item
					expand-separator
					icon="perm_identity"
					:label="t('ReportScopeDetails_users')"
				>
					<q-markup-table separator="horizontal" flat bordered>
						<thead>
							<tr>
								<th class="text-center">
									{{ t('ReportUser_username') }}
								</th>
								<th class="text-center">
									{{ t('ReportUser_role') }}
								</th>
								<th class="text-center">
									{{ t('ReportUser_comment') }}
								</th>
								<th class="text-center">
									{{ t('ReportUser_action') }}
								</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(user, index) in reportScopeRef.users"
								:key="index"
							>
								<td class="text-center">
									<q-input
										:readonly="props.readonly"
										v-model="user.username"
										dense
									/>
								</td>
								<td class="text-center">
									<q-input
										:readonly="props.readonly"
										v-model="user.userRole"
										dense
									/>
								</td>
								<td class="text-center">
									<q-input
										:readonly="props.readonly"
										v-model="user.comment"
										dense
									/>
								</td>
								<td class="text-center">
									<q-btn
										:readonly="props.readonly"
										flat
										icon="delete"
										color="negative"
										@click="removeUser(user)"
									/>
								</td>
							</tr>
							<tr v-if="!props.readonly" @click="addUser()">
								<td colspan="3"></td>
								<td class="text-center">
									{{ t('ReportUser_add_user') }}
								</td>
							</tr>
						</tbody>
					</q-markup-table>
				</q-expansion-item>
			</div>
		</div>
	</div>

	<q-dialog v-model="showDatePicker" @hide="applyDateRange">
		<q-card>
			<q-card-section>
				<div class="text-h6">
					{{ t('ReportScopeDetails_date_range') }}
				</div>
			</q-card-section>

			<q-card-section class="q-pt-none">
				<q-date v-model="dateRange" range />
			</q-card-section>

			<q-card-actions align="right">
				<q-btn
					flat
					label="OK"
					color="primary"
					@click="applyDateRange"
					v-close-popup
				/>
			</q-card-actions>
		</q-card>
	</q-dialog>

	<NewClientDialog
		v-model="newClientDialogOpener"
		@notifyClientCreated="(clientId: string) => {
			emit('notifyClientCreated', clientId);
		}
		"
	/>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
	Enviroments,
	Typologies,
	PentestTypes,
	ReportScope,
	ReportUser,
	ClientsCollection,
	SelectOption,
} from './models';
import NewClientDialog from './NewClientDialog.vue';

const { t } = useI18n();

const props = withDefaults(
	defineProps<{
		clientsCollection?: ClientsCollection;
		readonly?: boolean;
	}>(),
	{
		clientsCollection: () => {
			return <ClientsCollection>{};
		},
		readonly: false,
	}
);

const emit = defineEmits<{
	(e: 'notifyClientCreated', clientId: string): void;
}>();

const reportScopeRef = defineModel<ReportScope>({ required: true });

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

const clientText = ref(
	props.clientsCollection[reportScopeRef.value.client]?.name || ''
);

const clientOptions: ComputedRef<SelectOption[]> = computed(() => [
	...Object.keys(props.clientsCollection).map((key) => {
		return {
			value: key,
			label: props.clientsCollection[key].name,
		};
	}),
]);
const filteredClientOptionsRef = ref(clientOptions.value);

const filterClients = (
	val: string,
	doneFn: (callbackFn: () => void) => void
) => {
	doneFn(() => {
		if (!val) {
			filteredClientOptionsRef.value = [...clientOptions.value];
		} else {
			const needle = val.toLowerCase();
			filteredClientOptionsRef.value = clientOptions.value.filter(
				(option) => option.label.toLowerCase().indexOf(needle) > -1
			);
		}
	});
};

const newClientDialogOpener = ref(false);

const showDatePicker = ref(false);
const dateRange = ref({
	from: reportScopeRef.value.beginDate,
	to: reportScopeRef.value.endDate,
});

const openDatePicker = () => {
	showDatePicker.value = true;
};

const applyDateRange = () => {
	showDatePicker.value = false;
	reportScopeRef.value.beginDate = dateRange.value.from;
	reportScopeRef.value.endDate = dateRange.value.to;
};

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
};

watch(
	() => reportScopeRef.value.client,
	(client: string) => {
		clientText.value = props.clientsCollection[client]?.name || '';
	}
);
</script>

<style scoped>
/* Add any necessary styles here */
</style>
