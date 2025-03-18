import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './app/services/api.service'; 

bootstrapApplication(AppComponent, {
  providers: [provideAnimations(),  provideRouter(routes),  provideHttpClient(), ApiService], // Add animations if needed
}).catch((err) => console.error(err));