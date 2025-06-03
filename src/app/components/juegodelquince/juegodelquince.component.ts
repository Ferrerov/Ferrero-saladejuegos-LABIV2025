import { Component, inject, Input } from '@angular/core';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Observable, Subject, timer, takeUntil, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TablapuntajeComponent } from '../tablapuntaje/tablapuntaje.component';
import { SupabaseDbService } from '../../services/supabase-db-service.service';

@Component({
  selector: 'app-juegodelquince',
  standalone: true,
  imports: [MatFabButton, MatIcon, AsyncPipe, CommonModule, TablapuntajeComponent],
  templateUrl: './juegodelquince.component.html',
  styleUrls: ['./juegodelquince.component.scss']
})
export class JuegodelquinceComponent {
  grilla = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 0],
  ];
  esManual:boolean = true;
  movimientos:number = 0;
  stop$ = new Subject<boolean>();
  timer$: Observable<string> | undefined;
  comenzo: boolean = false;
  ganador:boolean = false;
  authService = inject(AuthService);
  verPuntajes:boolean = false;
  supabase = inject(SupabaseDbService);
  

  iniciarCronometro() {
    this.timer$ = timer(0, 10).pipe( 
      takeUntil(this.stop$),
      map(t => this.formatearTiempo(t * 10))
    );
  }

  frenarCronometro()
  {
    this.stop$.next(true);
    console.log(this.timer$);
  }

  formatearTiempo(ms: number): string {
    const minutos = Math.floor(ms / 60000);
    const segundos = Math.floor((ms % 60000) / 1000);
    return `${this.formatearNumero(minutos)}:${this.formatearNumero(segundos)}`;
  }

  formatearNumero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  onClick(e: Event): void {
    const unaFicha = e.target as HTMLElement;
    //console.log(unaFicha);
    const fila = Number(unaFicha.id[0]);
    //console.log(fila);
    const columna = Number(unaFicha.id[1]);
    //console.log(columna);

    this.modificarEstadoFichas('none');

    if (columna > 0 && this.grilla[fila][columna - 1] === 0) {
      unaFicha.style.left = unaFicha.offsetLeft - 150 + 'px';
      this.actualizarGrilla([fila, columna], [fila, columna - 1], unaFicha);
    } else if (columna < 2 && this.grilla[fila][columna + 1] === 0) {
      unaFicha.style.left = unaFicha.offsetLeft + 150 + 'px';
      this.actualizarGrilla([fila, columna], [fila, columna + 1], unaFicha);
    } else if (fila > 0 && this.grilla[fila - 1][columna] === 0) {
      unaFicha.style.top = unaFicha.offsetTop - 150 + 'px';
      this.actualizarGrilla([fila, columna], [fila - 1, columna], unaFicha);
    } else if (fila < 2 && this.grilla[fila + 1][columna] === 0) {
      unaFicha.style.top = unaFicha.offsetTop + 150 + 'px';
      this.actualizarGrilla([fila, columna], [fila + 1, columna], unaFicha);
    }

    
    setTimeout(() => {
      this.modificarEstadoFichas('all');
    }, 300);
    if (this.esManual && this.comenzo) {
      if(!this.ganador)
      {
        this.verificarVictoria();
      }
    }
  }

  actualizarGrilla(from: number[], to: number[], unaFicha: HTMLElement): void {
    const filaActual = from[0];
    const columnaActual = from[1];
    const filaObjetivo = to[0];
    const columnaObjetivo = to[1];

    unaFicha.id = '' + filaObjetivo + columnaObjetivo;
    this.grilla[filaObjetivo][columnaObjetivo] = 1;
    this.grilla[filaActual][columnaActual] = 0;
    if(this.esManual) this.movimientos++;
  }

  mezclar(): void {
    this.movimientos = 0;
    this.ganador = false;
    for (let i = 0; i < 200; i++) {
      setTimeout(() => {
        this.moverAleatorio();
        if(i === 199)
        {
          this.esManual = true;
          this.reactivarTransicion();
          this.comenzo = true;
        }
      }, 100);
    }
  }

  moverAleatorio(): void {
    const posicionesMovibles: number[][] = [];
    this.esManual = false;
  
    for (let fila = 0; fila < 3; fila++) {
      for (let columna = 0; columna < 3; columna++) {
        if (this.grilla[fila][columna] === 1) {
          if (
            (columna > 0 && this.grilla[fila][columna - 1] === 0) || // izquierda
            (columna < 2 && this.grilla[fila][columna + 1] === 0) || // derecha
            (fila > 0 && this.grilla[fila - 1][columna] === 0) || // arriba
            (fila < 2 && this.grilla[fila + 1][columna] === 0) // abajo
          ) {
            posicionesMovibles.push([fila, columna]);
          }
        }
      }
    }
  
    const indice = Math.floor(Math.random() * posicionesMovibles.length);
    const [fila, columna] = posicionesMovibles[indice];
    const unaFicha = document.getElementById(`${fila}${columna}`) as HTMLElement;

    if (unaFicha) {
      unaFicha.style.transition = 'none';
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      unaFicha.dispatchEvent(event);
    }
  }
  
  verificarVictoria(): void {
    const estadoGanador = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 0],
    ];
      //console.log('verificando');
      let ganado = this.validarOrden();

      if (ganado) {
        this.guardarResultados();
        this.ganador = ganado;
        console.log('¡Ganaste!');
        this.frenarCronometro();
      }
  }

  reactivarTransicion()
  {
    console.log('reactivadno animacion');
    const fichas = document.querySelectorAll('.ficha');
    fichas.forEach((ficha: Element) => {
      (ficha as HTMLElement).style.transition = 'all .3s';
    });
  }

  modificarEstadoFichas(estado:string)
  {
    const fichas = document.querySelectorAll('.ficha');
    fichas.forEach((ficha: Element) => {
      (ficha as HTMLElement).style.pointerEvents = estado;
    });
  }

  validarOrden(): boolean {
    const fichas = document.querySelectorAll('.ficha');
    let ordenado = true;
  
    fichas.forEach(ficha => {
      const fichaElement = ficha as HTMLElement;
      const fichaId = fichaElement.id;
      const primeraClase = fichaElement.classList[0];
  
      if (fichaId !== primeraClase) {
        ordenado = false;
        return;
      }
    });
  
    if (ordenado) {
      //console.log('Las fichas estan ordenadas');
      return true;
    } else {
      //console.log('Las fichas no estan ordenadas');
      return false;
    }
  }
  guardarResultados() {
    this.supabase
      .addResultado(this.authService.currentUser()!.username, 'juegodelocho', this.movimientos, 'asc')
      .subscribe({
        next: (res) => console.log('Resultado:', res),
        error: (err) => console.error('Error:', err),
      });
  }

  verVentana(ver: boolean) {
    this.verPuntajes = ver;
  }
}
