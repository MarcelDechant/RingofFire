import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-8b5f0","appId":"1:8867531561:web:cc121dcff1ea9cc2258538","storageBucket":"ring-of-fire-8b5f0.appspot.com","apiKey":"AIzaSyDFz2vNrXVURS9Mnz8wsyN3Q7HGi3fUXIY","authDomain":"ring-of-fire-8b5f0.firebaseapp.com","messagingSenderId":"8867531561"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
