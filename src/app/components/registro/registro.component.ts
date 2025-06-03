import { Component, signal, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCard,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent {
  router = inject(Router);
  formbuilder = inject(FormBuilder);
  authService = inject(AuthService);
  StrongPasswordRegx: RegExp =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}/;

  hide = signal(true);
  errorSupabase: string | null = null;

  form = this.formbuilder.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    usuario: ['', Validators.required],
    contrasena: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
        ),
        Validators.minLength(8),
      ],
    ],
  });

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    this.authService
      .register(rawForm.correo, rawForm.usuario, rawForm.contrasena)
      .subscribe((result) => {
        console.log(result.data);
        console.log(result.error);
        console.log(result.error?.code);
        if (result.error) {
          switch (result.error.code) {
            case 'user_already_exists':
              this.errorSupabase = 'El correo ingresado ya esta registrado';
              break;
            case 'email_address_invalid':
              this.errorSupabase = 'El correo ingresado no es valido';
              break;
            default:
              this.errorSupabase = 'Error al registrarse';
          }
        } else {
          this.router.navigateByUrl('/home');
        }
      });
  }
}
