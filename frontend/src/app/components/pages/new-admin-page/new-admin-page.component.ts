import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/services/user.service';
import { IUserNewAdmin } from 'src/app/shared/interfaces/IUserNewAdmin';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-admin-page',
  templateUrl: './new-admin-page.component.html',
  styleUrls: ['./new-admin-page.component.css']
})
export class NewAdminPageComponent implements OnInit {

  users: User[] = [];

  @Input()
  userId!: string;

  isChecked!: boolean;

  isEmpty: boolean = false;

  usersLoaded: boolean = false;

  constructor(private userService: UserService, private toastrService: ToastrService) { }

  async ngOnInit(): Promise<void> {
    await this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let usersObservable: Observable<User[]>;

      usersObservable = this.userService.getAll();
      usersObservable.subscribe(
        (user) => {
          resolve();
          this.users = user;
          this.usersLoaded = true;

          if (!user) {
            this.isEmpty = true;
          }
        },
        (error) => {
          reject(error);
        }
      )

    });
  }

  updateIsChecked(isAdminStatus: boolean): void {
    this.isChecked = isAdminStatus;
  }

  async newAdmin(userId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let user: IUserNewAdmin = {
        isAdmin: this.isChecked
      };

      this.userService.newAdmin(userId, user).subscribe(
        () => {
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async showUpdateUserAdminAlert(userId: string, userName: string) {
    const message = `Deseja realmente atualizar o campo isAdmin do usuário ${userName}?`;

    Swal.fire({
      title: 'Atenção!!',
      html: message.replace(/\n/g, '<br>'),
      icon: 'question',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.newAdmin(userId);
          await this.loadUsers();
        } catch (error) {
          this.toastrService.error('Checkbox com valor já existente!', 'Falha ao atualizar');
        }
      }
      if (result.isDismissed) {
        await this.loadUsers();
      }
    });
  }

}
