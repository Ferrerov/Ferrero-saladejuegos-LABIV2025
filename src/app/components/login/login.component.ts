import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCard, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule, FormsModule, MatCardModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

}
