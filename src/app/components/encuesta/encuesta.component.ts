import { Component, signal, ChangeDetectionStrategy, inject, ViewEncapsulation } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatCard } from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { SupabaseDbService } from '../../services/supabase-db-service.service';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule, FormsModule, MatCheckboxModule, MatRadioModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EncuestaComponent {
  router = inject(Router);
  formbuilder = inject(FormBuilder);
  authService = inject(AuthService);
  hide = signal(true);
  errorFirebase : string | null = null;
  supabase = inject(SupabaseDbService);

  form = this.formbuilder.nonNullable.group({
    nombre: ['', [Validators.required]],
    apellido: ['', Validators.required],
    edad: ['',[Validators.required, Validators.min(18), Validators.max(99)],],
    telefono: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
    calidadJuegos: ['', [Validators.required,]],
    juegosSeleccionados: this.formbuilder.array([], this.validarCheck()),
    sugerencia: ['', [Validators.required,]]
  });

  onSubmit() : void{
    const rawForm = this.form.getRawValue();
    const juegosSeleccionados = this.juegosSeleccionados.controls.map((control) => control.value as string); 
    this.guardarEncuesta(rawForm.nombre, rawForm.apellido, Number(rawForm.edad), rawForm.telefono, rawForm.calidadJuegos, juegosSeleccionados, rawForm.sugerencia);
    console.log(rawForm);
    console.log('encuesta exitosa')
    this.router.navigateByUrl('/home');
  }

  guardarEncuesta(nombre: string, apellido: string, edad: number, telefono: string, calidadJuegos:string, juegosSeleccionados:string[], sugerencia:string){
    this.supabase
      .addEncuesta(this.authService.currentUser()!.uid,nombre, apellido, edad, telefono, calidadJuegos, juegosSeleccionados, sugerencia)
      .subscribe({
        next: (res) => console.log('Resultado:', res),
        error: (err) => console.error('Error:', err),
      });
  }

  get juegosSeleccionados(): FormArray {
    return this.form.get('juegosSeleccionados') as FormArray;
  }
  
  toggleCheckbox(value: string, event: any): void {
    if (event.checked) {
      this.juegosSeleccionados.push(this.formbuilder.control(value));
    } else {
      const index = this.juegosSeleccionados.controls.findIndex((control) => control.value === value);
      this.juegosSeleccionados.removeAt(index);
    }
  }
  validarCheck(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const checkboxesSeleccionados = control.value || [];
      const valido = checkboxesSeleccionados.length > 0;
      return valido ? null : { unoRequerido: true };
    };
  }
}
