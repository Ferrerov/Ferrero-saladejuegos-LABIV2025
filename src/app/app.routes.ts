import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'registro', loadComponent: () => import('./components/registro/registro.component').then(m => m.RegistroComponent) },
  { path: 'quiensoy', loadComponent: () => import('./components/quiensoy/quiensoy.component').then(m => m.QuiensoyComponent) },
  { path: 'encuesta', loadComponent: () => import('./components/encuesta/encuesta.component').then(m => m.EncuestaComponent) },
  { path: 'juegos', loadChildren: () => import('./juegos/juegos.module').then(m => m.JuegosModule) },
];
