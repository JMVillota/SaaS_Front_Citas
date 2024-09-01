import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/login/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUserValue) {
    // Usuario autenticado, permite el acceso
    return true;
  }

  // Usuario no autenticado, redirige al login
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
  return false;
};