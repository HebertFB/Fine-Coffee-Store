import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { IUserUpdate } from 'src/app/shared/interfaces/IUserUpdate';
import { Order } from 'src/app/shared/models/Order';
import { User } from 'src/app/shared/models/User';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  @Input()
  isUpdateProfile: boolean = false;

  user: User = {} as User;
  updateForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '/profile';

  ordersCurrentUser: Order[] = [];

  @Input()
  openOrders: number = 0;

  profileLoaded: boolean = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService,
    private router: Router, private orderService: OrderService) {
    this.user = this.userService.currentUser;
  }

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      let { id, email, name, phone, address, numberHouse, cep, city, stateUF, district, complement } = this.userService.currentUser;
      this.updateForm = this.formBuilder.group({
        id: [id],
        email: [email, Validators.required],
        name: [name, Validators.required],
        phone: [phone, Validators.required],
        address: [address, Validators.required],
        numberHouse: [numberHouse, Validators.required],
        cep: [cep, Validators.required],
        city: [city, Validators.required],
        stateUF: [stateUF, Validators.required],
        district: [district, Validators.required],
        complement: [complement]
      });

      this.orderService.getUserOrders(this.user.id).subscribe(
        (userOrders) => {
          resolve();
          this.ordersCurrentUser = userOrders;

          for (let order in this.ordersCurrentUser) {
            if (this.ordersCurrentUser[order].statusOrder != 'CANCELADO' &&
              this.ordersCurrentUser[order].statusOrder != 'FINALIZADO') {
              this.openOrders += 1;
            }
          }
        },
        (error) => {
          reject(error);
        });
      this.profileLoaded = true;
    });
  }

  get fc() {
    return this.updateForm.controls;
  }

  callUpdateForm() {
    if (this.isUpdateProfile === false) {
      this.isUpdateProfile = true;
    } else {
      this.isUpdateProfile = false;
    }
  }

  toCapitalize(text: string): string {
    return text.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase());
  }

  async submit() {
    this.isSubmitted = true;

    if (this.updateForm.invalid) return;

    const userId = this.updateForm.controls.id.value;

    const fv = this.updateForm.value;
    const user: IUserUpdate = {
      name: this.toCapitalize(fv.name),
      phone: fv.phone,
      address: this.toCapitalize(fv.address),
      numberHouse: fv.numberHouse,
      cep: fv.cep,
      city: this.toCapitalize(fv.city),
      stateUF: fv.stateUF.toUpperCase(),
      district: this.toCapitalize(fv.district),
      complement: this.toCapitalize(fv.complement)
    };

    this.userService.update(userId, user).subscribe(async _ => {
      await this.loadProfile();
      this.user = this.userService.currentUser;
      this.router.navigateByUrl(this.returnUrl);
    });

    this.callUpdateForm();
  }

  showUpdateUserAlert() {
    const message = `${this.user.name} tem certeza que deseja atualizar sua conta?`;

    Swal.fire({
      title: 'Atenção!!',
      html: message.replace(/\n/g, '<br>'),
      icon: 'question',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.submit();
      }
      else {
        await this.loadProfile();
        this.callUpdateForm();
      }
    });
  }

  async deleteUser(userId: string) {
    if (this.user.isOwner) {
      this.showFailedDeleteOwnerAlert();
    }
    if (this.openOrders != 0 && !this.user.isOwner) {
      this.showFailedDeleteUserAlert();
    }
    if (this.openOrders === 0 && !this.user.isOwner) {
      this.showConfirmDeleteAlert(userId);
    }
  }

  logout() {
    this.userService.logout();
  }

  async deleteUserAccount(userId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      this.userService.delete(userId).subscribe(
        () => {
          resolve();
          this.logout();
        },
        (error) => {
          reject(error);
        }
      );
    })
  }

  showFailedDeleteOwnerAlert() {
    const message = `Erro ao excluir sua conta ${this.user.name}!!\nContas owners não podem ser excluídas.`;

    Swal.fire({
      title: 'Exclusão negada!!',
      html: message.replace(/\n/g, '<br>'),
      icon: 'error',
      showCancelButton: false,
      showCloseButton: true,
      cancelButtonColor: '#d33',
    });
  }

  showFailedDeleteUserAlert() {
    const message = `Erro ao excluir sua conta ${this.user.name}, pois há orders em aberto!!\nCancele ou aguarde a finalização das orders em aberto e tente novamente.`;

    Swal.fire({
      title: 'Exclusão negada!!',
      html: message.replace(/\n/g, '<br>'),
      icon: 'error',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Voltar',
      confirmButtonText: 'Pedidos'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigateByUrl('/orders');
      }
    });
  }

  async showConfirmDeleteAlert(userId: string) {
    const message = `${this.user.name} tem certeza que deseja excluir sua conta?\nTodos os seus dados seram excluidos.`;

    Swal.fire({
      title: 'Atenção!!',
      html: message.replace(/\n/g, '<br>'),
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.deleteUserAccount(userId);
      }
    });
  }

}
