import { NgModule } from "@angular/core"
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http"
import { TokenInterceptor } from "./main/interceptors/token.interceptor"
import { DatePipe } from "@angular/common"

@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    DatePipe,
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
