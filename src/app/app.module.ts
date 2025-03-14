import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {
    provideTanStackQuery,
    QueryClient,
    withDevtools,
} from '@tanstack/angular-query-experimental';

import { routes } from './app.routes';

import { AppComponent } from './app.component';
import WalletButtonComponent from './components/wallet-button/wallet-button.component';

@NgModule({
    declarations: [
        AppComponent,
        WalletButtonComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        RouterModule.forRoot(routes),
    ],
    providers: [
        provideHttpClient(withFetch()),
        provideTanStackQuery(new QueryClient(), withDevtools()),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
