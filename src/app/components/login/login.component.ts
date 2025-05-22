import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { createClient } from '@supabase/supabase-js'
import { environment } from '../../../environments/environment';
import { from } from 'rxjs';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey)

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule, FormsModule, MatCardModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formbuilder = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);
  hide = signal(true);
  errorFirebase : string | null = null;

  form = this.formbuilder.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['',[Validators.required]]
  });

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() : void{
    const rawForm = this.form.getRawValue();
    /**this.authService.login(rawForm.correo ,rawForm.contrasena)
    .subscribe({
      next: () => {
        this.router.navigateByUrl('/home');},
      error: (err) => {
        console.log(err.code);
        this.errorFirebase = 'Las credenciales no coinciden';
      }
    });**/
    this.login(rawForm.correo ,rawForm.contrasena).subscribe({
      next: () => {
        this.router.navigateByUrl('/home');},
      error: (err) => {
        console.log(err.code);
        this.errorFirebase = 'Las credenciales no coinciden';
      }
    });
  }

login(correo: string, contrasena: string) {
  const promise = supabase.auth.signInWithPassword({
    email: correo,
    password: contrasena,
  });

  return from(promise.then((response) => {
    if (response.error) {
      throw response.error; // Esto es clave
    }
    return response;
  }));
}

  setCredentials(correo: string, contrasena: string) {
    this.form.setValue({ correo, contrasena});
  }

}
