import {
  Component,
  signal,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
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
  //changeDetection: ChangeDetectionStrategy.OnPush,
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
    .register(rawForm.correo, rawForm.contrasena, rawForm.usuario)
    .subscribe({
      next: () => this.router.navigateByUrl('/home'),
      error: (err) => {
        console.log(err);
      if (err.code === 'correo-existente') {
          this.errorSupabase = 'El correo ingresado ya esta registrado';
        } else if (
          err.message.toLowerCase().includes('invalid')
        ) {
          this.errorSupabase = 'El correo ingresado no es valido';
        } else {
          this.errorSupabase = 'Error al registrarse';
        }
      },
    });
}
}
