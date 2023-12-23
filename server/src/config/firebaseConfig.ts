import admin from 'firebase-admin';
import serviceAccount from './firebaseServiceAccountKey';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'abcountable-5d246.appspot.com',
});

const bucket = admin.storage().bucket();

export { admin, bucket };
