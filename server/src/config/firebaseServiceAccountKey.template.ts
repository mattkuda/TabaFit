import admin from 'firebase-admin';

export default {
  type: 'service_account',
  project_id: 'your_project_id', // Replace with your Firebase project ID
  private_key_id: 'your_private_key_id', // Replace with your private key ID
  private_key: '-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n', // Replace with your private key
  client_email: 'your_firebase_adminsdk_client_email', // Replace with your Firebase client email
  client_id: 'your_client_id', // Replace with your client ID
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/your_client_email', // Replace with your client x509 cert URL
  // Additional fields if required
} as admin.ServiceAccount;
