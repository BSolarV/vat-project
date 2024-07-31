<template>
	<q-layout view="lHh lpR fFf">
		<q-header elevated class="bg-primary text-white">
			<q-toolbar>
				<q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

				<q-toolbar-title>
					<q-avatar>
						<img
							src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg"
						/>
					</q-avatar>
					Title
				</q-toolbar-title>
				<q-btn-dropdown
					v-if="user"
					color="primary"
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
								<q-item-label>Settings</q-item-label>
							</q-item-section>
						</q-item>

						<q-item clickable v-close-popup @click="performLogout">
							<q-item-section>
								<q-item-label>Logout</q-item-label>
							</q-item-section>
						</q-item>
					</q-list>
				</q-btn-dropdown>
			</q-toolbar>
		</q-header>

		<q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
			<q-list>
				<q-item-label header> Essential Links </q-item-label>

				<q-item
					v-for="(route, index) in routes"
					clickable
					tag="a"
					target="_blank"
					:href="route.path"
					v-bind:key="index"
				>
					<q-item-section v-if="route.meta?.icon" avatar>
						<q-icon :name="<string> route.meta.icon" />
					</q-item-section>

					<q-item-section>
						<q-item-label>{{
							route.meta?.title || ''
						}}</q-item-label>
						<q-item-label v-if="route.meta?.caption" caption>{{
							route.meta?.caption
						}}</q-item-label>
					</q-item-section>
				</q-item>
			</q-list>
		</q-drawer>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@vueuse/firebase';
import { auth } from 'boot/firebase';
import routes from 'src/router/routes';
import { useRouter } from 'vue-router';

defineOptions({
	name: 'MainLayout',
});

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
