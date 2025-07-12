import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptor } from './app/main/interceptors/token.interceptor';
import { DatePipe } from '@angular/common';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.route';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, HttpClient),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
        importProvidersFrom(ToastrModule.forRoot()),
        importProvidersFrom(BrowserAnimationsModule),
        provideRouter(routes),
        DatePipe,
        provideHttpClient(withInterceptorsFromDi()),
    ]
}).catch(err => console.error(err));