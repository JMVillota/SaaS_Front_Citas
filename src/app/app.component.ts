import { Component, OnInit, OnDestroy } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from '../app/service/login/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
    private authSubscription: Subscription;

    constructor(
        private primengConfig: PrimeNGConfig,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true;

        // Suscribirse al evento de cierre de sesión
        this.authSubscription = this.authService.onLogout().subscribe(() => {
            this.router.navigate(['/auth/login']);
        });

        // Inicializar el temporizador de expiración del token si hay un usuario actual
        if (this.authService.currentUserValue) {
            this.authService.initializeTokenExpirationTimer();
        }
    }

    ngOnDestroy() {
        // Asegurarse de cancelar la suscripción al destruir el componente
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
    }
}