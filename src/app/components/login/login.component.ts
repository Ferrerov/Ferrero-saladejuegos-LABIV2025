import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SupabaseDbService } from '../../services/supabase-db-service.service';



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
  errorSupabase : string | null = null;
  supabase = inject(SupabaseDbService);

  form = this.formbuilder.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['',[Validators.required]]
  });

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit(): void {
  const rawForm = this.form.getRawValue();
  this.authService.login(rawForm.correo, rawForm.contrasena).subscribe(result => {
    console.log(result.data);
    console.log(result.error);
    if (result.error) {
      this.errorSupabase = 'Las credenciales no son validas';
    } else {
      this.guardarLogSesion();
      this.router.navigateByUrl('/home');
    }
  })
}

  setCredentials(correo: string, contrasena: string) {
    this.form.setValue({ correo, contrasena});
  }

  guardarLogSesion(){
    this.supabase
      .addLog(
        this.authService.currentUser()!.email,
        new Date(Date.now())
      )
      .subscribe({
        next: (res) => console.log('Resultado:', res),
        error: (err) => console.error('Error:', err),
      });
  }
}
