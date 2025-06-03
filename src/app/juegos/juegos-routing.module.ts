import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'ahorcado', loadComponent: () => import('../components/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent), canActivate: [authGuard] },
  { path: 'mayormenor', loadComponent: () => import('../components/mayormenor/mayormenor.component').then(m => m.MayormenorComponent), canActivate: [authGuard] },
  { path: 'preguntados', loadComponent: () => import('../components/preguntados/preguntados.component').then(m => m.PreguntadosComponent), canActivate: [authGuard] },
  { path: 'juegodelquince', loadComponent: () => import('../components/juegodelquince/juegodelquince.component').then(m => m.JuegodelquinceComponent), canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { 

  
}
