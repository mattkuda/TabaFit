import { OAuth2Client, TokenPayload } from 'google-auth-library';
// eslint-disable-next-line camelcase
import config from '../config/firebaseServiceAccountKey';

const client = new OAuth2Client(config.client_id);

export default async (idToken: string): Promise<TokenPayload | undefined> => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: config.client_id, // Specify the CLIENT_ID of the app that accesses the backend
  });
  const payload = ticket.getPayload();

  return payload;
};
