import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthService } from './app/auth.service';

function initAuth(auth: AuthService) {
  return () => auth.isLoggedIn(); // Learn this..
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),

    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [AuthService],
      multi: true
    }
  ]
});
