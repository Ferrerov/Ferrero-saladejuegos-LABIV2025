import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if(auth.currentUser()) {
    console.log("puede pasar");
    return true
  }

  console.log("no puede pasar");
  return router.createUrlTree(['/login']);
};
