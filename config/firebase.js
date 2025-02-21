import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: 'AIzaSyDxKebaqnuySq2qvQvqYjG44IbKfKjgJrE',
    authDomain: 'klikit-consumer-39350.firebaseapp.com',
    projectId: 'klikit-consumer-39350',
    storageBucket: 'klikit-consumer-39350.firebasestorage.app',
    messagingSenderId: '1058378563758',
    appId: '1:1058378563758:web:94f732d53df534dbe0ad3f',
};

export const firebase = initializeApp(firebaseConfig);

export const auth = initializeAuth(firebase, {
	persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
