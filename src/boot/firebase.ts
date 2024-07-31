import { boot } from 'quasar/wrappers';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyAZ54XJ8wvks2zoTXFzyrtR46-79AYPhWY',
	authDomain: 'project-vat.firebaseapp.com',
	projectId: 'project-vat',
	storageBucket: 'project-vat.appspot.com',
	messagingSenderId: '387964156110',
	appId: '1:387964156110:web:709eb626b4b7f3974cb89f',
	measurementId: 'G-EWRT2FWQMV',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
	// something to do
});
