import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';
import { PasswordsMatchValidator } from 'src/app/shared/validators/password_match_validator';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  registerForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';

  constructor(private formBuilder: FormBuilder, private userService: UserService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(8)]],
      numberHouse: ['', [Validators.required, Validators.minLength(1)]],
      cep: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(3)]],
      stateUF: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      district: ['', [Validators.required, Validators.minLength(5)]],
      complement: ['', [Validators.minLength(4)]],
    }, {
      validators: PasswordsMatchValidator('password', 'confirmPassword')
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get fc() {
    return this.registerForm.controls;
  }

  toCapitalize(text: string): string {
    return text.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase());
  }

  submit() {
    this.isSubmitted = true;

    if (this.registerForm.invalid) return;

    const fv = this.registerForm.value;
    const user: IUserRegister = {
      name: this.toCapitalize(fv.name),
      email: fv.email,
      password: fv.password,
      confirmPassword: fv.confirmPassword,
      address: this.toCapitalize(fv.address),
      phone: fv.phone,
      numberHouse: fv.numberHouse,
      cep: fv.cep,
      city: this.toCapitalize(fv.city),
      stateUF: fv.stateUF.toUpperCase(),
      district: this.toCapitalize(fv.district),
      complement: this.toCapitalize(fv.complement)
    };

    this.userService.register(user).subscribe(_ => {
      this.router.navigateByUrl(this.returnUrl);
    })
  }

}
