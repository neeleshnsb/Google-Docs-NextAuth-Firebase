import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId:
        "915550977275-vjn92jp7cd9vr9023khjv261dbdt51h8.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  adapter: FirestoreAdapter({
    namingStrategy: "snake_case",
    credential: cert({
      projectId: "nextauthfinale",
      clientEmail:
        "firebase-adminsdk-1fgxt@nextauthfinale.iam.gserviceaccount.com",
      privateKey:
        "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDECHwtUKBjXTeR\nHLGEvHYFTGUqFU57tIgX115k0u6HcZisE969aCeCtun8heYMiA66FLncBllcN/Hy\nhHdjJ4zJqftk/K26CqDD51P3muzsxXC5esSffo/2+V9b0UfYdui3zrDx316Qm9bW\nZdH7FtY7GDaHYprpjQqKZ0pQrT6qaCykBXNZuAOaeds+DLROxxvRwuJLD44J12jB\nlsi5QK8o4N2mp1kRL6+A4DAIf/F9EDAwDaCNiWF6jKh8N7u9N0Zchq0f11nWZJ7O\nARhuQlkT/JT0O+HAT+OCVnklFJvcTePyPDnSx+suRRqLMbq2+uv+1yzbwABh8NLv\n9cDYyEZFAgMBAAECggEAFRVWiacgwN8PMV+1JfIA/Xvka3zEJqDZfDrxD4XyGoYY\npfUzIQrZKQFUNBEQl2twrgm5nZTfOoBX2L3vey4PQccy3v8gDiDDfp5cFQbIEYUA\npSoziHXbtPPIEj91ay4KxG4J8NGVwZbJKeDkjw07ODrX7oKn55OAPTdzsi6XzUrb\nbT97rFs2c4Ua4Yy7WfDncnImYl8geXgIMZ0wYWLjoFebS9NhwgXubVvhvpzi7mNI\nTqIbQGywCDE8/3L4LV5qRQDOLym9SghqbWnT37B2eUXnC/myXXI5dPEO1qsWpr0p\n2opN3OOF1z7ARoI0kBMKTQM0pDs+BcDfjWtAqa5FkQKBgQD8m1Qv0mMaVkckQw06\nGjgF0vUa2qjpLQDqR4lpye9mbKPEekqhJ8dqCZfxEMfJeVkeuLz4WdTZ0c0rbkft\nNOG/0rLhMRgBEMH6X8hWCI9qjzWiQEvgd0tebfiEjS64ucSndTPBpXTMEd5BtPoT\nMMTeckzXT63Nk2xSN6h0shgVDQKBgQDGqpv7tkwcUtU7Mm+eSGFYYAvpBBOorDk9\n28sDyaA+LQ6/z5hQ7jHUbaDKMyI+qwhYRklXwKV1cvwiuGejqbVnnXSYfJ2EQUv3\nchScWgcwDJTQrPkzIQIXBkrlQhhcMeyalegKFbPsb2OdIsMVXQCq2RosTu5SzfoB\nHi+fCQkYGQKBgG2Zq25QV0VvF9Do8s054QLN5CDxrIX3S8Vaoolu31tOWcP+13CS\nxNgCL5WdlUGaUAufVgZfW5XijKWCZNzLrANBlPFWDrcvoSpT8qU5c5hlaHzsbr+G\nowHmrwQ8CYCGwYdyt7EWa9W7DvbtYe9/onttll95J8zhYQdPNNzlBMPlAoGBAL4T\nV+Ax34ot2mOj8tUe7Twv0NVlmCWGedHsa8W48D7svzLXvSSZcUWMig1LdRU+cGJ9\nBQkXgXbox8G0azxUUALNzFNkzxRNoRAjrwKUxFG9h9hL1rWLfENpOtk0Lrhu77BL\ngtG7SAUL4ePi8YGMFOphg0AnWLAS8IKHTgq8C15pAoGBAOiti1SKazlE/P3FHmsV\noab0QLC/nIyQ/BvWHziICx0LHA/BMKq2cjxN5FlWMKFSXkYjVSh+DUvjZlLTxv2J\nJAGHVZRr7giJIzpq7FvCHkHNMsFMD9318Jt7MzndBtqLgJky48EoxNKG12RlxoBD\nIbsSeFA/vah77bGlxbuVniOJ\n-----END PRIVATE KEY-----\n",
    }),
  }),
});
