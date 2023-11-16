import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { USER_DELETE_URL, USER_LOGIN_URL, USER_NEW_ADMIN_URL, USER_REGISTER_URL, USER_UPDATE_URL, USER_URL } from '../shared/constants/urls';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
import { User } from '../shared/models/User';
import { IUserUpdate } from '../shared/interfaces/IUserUpdate';
import { IUserNewAdmin } from '../shared/interfaces/IUserNewAdmin';
import { Router } from '@angular/router';

const USER_KEY = 'User';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable: Observable<User>;

  constructor(private http: HttpClient, private toastrService: ToastrService, private router: Router) {
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser(): User {
    return this.userSubject.value;
  }

  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(`Bem-vindo à Fine Coffee ${user.name}!`)
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Falha no Login!');
        }
      })
    );
  }

  register(userRegister: IUserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(`Bem-vindo à Fine Coffee ${user.name}!`, 'Registrado');
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Falha ao Registrar!')
        }
      })
    )
  }

  update(userId: string, userUpdate: IUserUpdate): Observable<User> {
    return this.http.put<User>(USER_UPDATE_URL + userId, userUpdate).pipe(tap({
      next: (user) => {
        this.setUserToLocalStorage(user);
        this.userSubject.next(user);
        this.toastrService.success(
          `${user.name} seu perfil foi atualizado com sucesso.`, 'Atualizado');
      },
      error: (errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Falha na Atualização!');
      }
    })
    );
  }

  newAdmin(userId: string, userNewAdmin: IUserNewAdmin): Observable<User> {
    return this.http.put<User>(USER_NEW_ADMIN_URL + userId, userNewAdmin).pipe(tap({
      next: (user) => {
        this.toastrService.success(
          `Campo Admin de ${user.name} atualizado com sucesso.`, 'Atualizado');
      },
      error: (errorResponse) => {
      }
    })
    );
  }

  delete(userId: string): Observable<User> {
    return this.http.delete<User>(USER_DELETE_URL + userId).pipe(tap({
      next: (user) => {
        this.setUserToLocalStorage(user);
        this.userSubject.next(user);
        this.toastrService.success(`${user.name} sua conta foi excluída com sucesso.`, 'Conta excluída');
      },
      error: (errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Falha na Exclusão!');
      }
    })
    );
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(USER_URL);
  }

  logout() {
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    this.router.navigateByUrl('/');
  }

  private setUserToLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson) return JSON.parse(userJson) as User;
    return new User();
  }

}
