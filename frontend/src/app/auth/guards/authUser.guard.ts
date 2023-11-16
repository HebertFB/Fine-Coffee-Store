import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

export const authUserGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const userService = inject(UserService);
  const isAdmin = userService.currentUser.isAdmin;

  if (userService.currentUser.token && !isAdmin) {
    return true;
  }
  if (userService.currentUser.token && isAdmin) {
    router.navigate(['/'], { queryParams: { returnUrl: state.url } })
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
  return false;

};
