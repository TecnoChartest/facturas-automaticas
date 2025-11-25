/* eslint-disable @typescript-eslint/no-require-imports */
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    const serviceAccountPath = path.resolve('./serviceAccountKey.json');

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(require(serviceAccountPath)),
      });
    }
  }

  getAuth() {
    return admin.auth();
  }
}
