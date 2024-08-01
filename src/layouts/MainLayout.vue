<template>
	<q-layout view="lHh lpR fFf">
		<q-header elevated class="bg-primary text-white">
			<q-toolbar>
				<q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

				<q-toolbar-title>
					{{ t(<string> $route.meta.title) }}
				</q-toolbar-title>
				<q-btn-dropdown
					v-if="user"
					icon="account_circle"
					color="secondary"
					:label="<string> user?.displayName"
				>
					<q-list>
						<q-item
							clickable
							v-close-popup
							@click="
								() => {
									settingDialogState = true;
								}
							"
						>
							<q-item-section>
								<q-item-label>{{
									t('mainLayout_dropdown_settings')
								}}</q-item-label>
							</q-item-section>
						</q-item>

						<q-item clickable v-close-popup @click="performLogout">
							<q-item-section>
								<q-item-label>{{
									t('mainLayout_dropdown_logout')
								}}</q-item-label>
							</q-item-section>
						</q-item>
					</q-list>
				</q-btn-dropdown>
			</q-toolbar>
		</q-header>

		<q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
			<q-list>
				<q-item-label header class="fit row no-wrap justify-center items-center text-h6">
					<q-icon name="dynamic_form" size="2em" class="q-mr-sm"/>
					{{ t('mainLayout_navPane_title') }}
				</q-item-label>

				<q-item
					v-for="(route, index) in routes.filter(value => value.meta?.nav_pane)"
					clickable
					@click="() => router.push(route.path)"
					v-bind:key="index"
					:active="$route.path === route.path"
				>
					<q-item-section v-if="route.meta?.icon" avatar>
						<q-icon :name="<string> route.meta.icon" />
					</q-item-section>

					<q-item-section>
						<q-item-label>{{
							t(<string> route.meta?.title || '')
						}}</q-item-label>
						<q-item-label v-if="route.meta?.caption" caption>{{
							t(<string> route.meta?.caption || '')
						}}</q-item-label>
					</q-item-section>
				</q-item>
			</q-list>
		</q-drawer>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>

	<q-dialog v-model="settingDialogState" transition-duration="150">
		<q-card style="min-width: 50%" class="q-pa-sm">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">
					{{ t('mainLayout_dropdown_settings') }}
				</div>
				<q-space />
				<q-btn icon="close" flat round dense v-close-popup />
			</q-card-section>

			<q-card-section class="q-pb-lg">
				<q-select
					dense
					:model-value="<string> localeMapper[<string> locale]"
					:options="
						Object.entries(localeMapper).map(([key, value]) => {
							return { label: value, value: key };
						})
					"
					@update:model-value="(selected: SelectOption) => (locale = <string> selected.value)"
				/>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@vueuse/firebase';
import { auth } from 'boot/firebase';
import routes from 'src/router/routes';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SelectOption } from 'src/components/models';

defineOptions({
	name: 'MainLayout',
});

const { t, locale } = useI18n();

const localeMapper: { [locale_id: string]: string } = {
	'en-US': 'English',
	'es-CL': 'Español',
};

const { user } = useAuth(auth);

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
	leftDrawerOpen.value = !leftDrawerOpen.value;
}

const settingDialogState = ref(false);

const router = useRouter();

async function performLogout() {
	await auth.signOut();
	router.push('/login');
}
</script>
