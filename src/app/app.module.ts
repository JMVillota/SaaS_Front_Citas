import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { ProductService } from './service/product.service';
import { CountryService } from './service/country.service';
import { CustomerService } from './service/customer.service';
import { EventService } from './service/event.service';
import { IconService } from './service/icon.service';
import { NodeService } from './service/node.service';
import { PhotoService } from './service/photo.service';
import { ApiKeyInterceptor } from './interceptors/api-key.interceptor';
import { TokenInterceptor } from '../app/interceptors/Token.interceptor'; // Importa el nuevo interceptor

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [
        AppRoutingModule, 
        AppLayoutModule,
        HttpClientModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: ApiKeyInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }, // Añade el nuevo interceptor
        CountryService, 
        CustomerService, 
        EventService, 
        IconService, 
        NodeService,
        PhotoService, 
        ProductService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}