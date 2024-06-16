import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const token = localStorage.getItem('angular17token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const tokenValid = await this.userService.verifyToken(token);
    if (!tokenValid) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
