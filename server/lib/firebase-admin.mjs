import admin from 'firebase-admin';
import { getFirebaseAdminConfig } from '../config/env.mjs';

let app;

export function getFirebaseAdmin() {
  if (!app) {
    app = admin.apps[0] || admin.initializeApp({
      credential: admin.credential.cert(getFirebaseAdminConfig()),
    });
  }

  return admin;
}
