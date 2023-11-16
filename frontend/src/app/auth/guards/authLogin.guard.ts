import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

export const authLoginGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const userService = inject(UserService);

  if (!userService.currentUser.token) {
    return true;
  }

  router.navigate(['/'], { queryParams: { returnUrl: state.url } })
  return false;

};
