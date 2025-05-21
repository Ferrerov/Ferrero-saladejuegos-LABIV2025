import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [MatGridListModule, MatButtonModule, CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent {

  letras: string[] = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',' ',' ', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ',' ',' ', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
  letrasDeshabilitadas: { [key: string]: boolean } = {};
  cantErroresMaximos: number = 11;
  cantErrores: number = 0;
  cantLetrasUnicas: number = 0;
  cantAciertos: number = 0;
  private palabras: string[][] = [
    ["T", "A", "L", "A", "D", "R", "O"],
    ["M", "I", "L", "L", "O", "N", "A", "R", "I", "O"],
    ["C", "U", "E", "R", "V", "O"],
    ["C", "A", "L", "A", "M", "A", "R"],
    ["A", "C", "A", "D", "E", "M", "I", "A"],
    ["R", "O", "J", "O"]
  ];
  public palabraSeleccionada: string[] = [];
  public palabraOculta: string[] = [];
  private errores: number = 0;
  iniciado: boolean = false;
  victoria: boolean = false;
  derrota: boolean = false;
  private fechaInicio: Date | null = null;
  verPuntajes: boolean = false;

  public inicializarJuego(): void {
    console.log("inicializar");
    this.iniciado = true;
    const indiceAleatorio = Math.floor(Math.random() * this.palabras.length);
    this.palabraSeleccionada = this.palabras[indiceAleatorio];
    this.palabraOculta = Array(this.palabraSeleccionada.length).fill("_");
    this.cantLetrasUnicas = new Set(this.palabraSeleccionada).size;
    this.cantErrores = 0;
    this.cantAciertos = 0;
    this.letrasDeshabilitadas = {};
    this.victoria = false;
    this.derrota = false;
    console.log('Palabra seleccionada: ' , this.palabraSeleccionada);
    console.log('Cant letras unicas: ' , this.cantLetrasUnicas);
    this.fechaInicio = new Date();
  }

  public comprobarLetra(letra: string): void {
    letra = letra.toUpperCase();
    let acierto = false;

    for (let i = 0; i < this.palabraSeleccionada.length; i++) {
      if (this.palabraSeleccionada[i] === letra) {
        this.palabraOculta[i] = letra;
        acierto = true;
      }
    }
    if (acierto === false) {
      this.cantErrores++;
      console.log(this.cantErrores);
    }
    else{
      this.cantAciertos++;
    }
    this.verificarEstadoJuego();
  }

  private verificarEstadoJuego(): void {
    if(this.cantAciertos === this.cantLetrasUnicas)
    {
      this.victoria = true;
      this.VerificarTiempoJuego();
    }
    else if(this.cantErrores === this.cantErroresMaximos){
      this.derrota = true;
      this.VerificarTiempoJuego();
    }
  }
  OnClickBotonLetra(letra: string) {
    this.letrasDeshabilitadas[letra] = true;
    console.log(`Letra ${letra} deshabilitada`);
    this.comprobarLetra(letra);
  }

  VerificarTiempoJuego(): string{
    const fechaFin:Date = new Date();
    const tiempoTranscurrido = fechaFin.getTime() - this.fechaInicio!.getTime();
    const minutos = Math.floor(tiempoTranscurrido / 60000);
    const segundos = Math.floor((tiempoTranscurrido % 60000) / 1000);
    const milisegundos = tiempoTranscurrido % 1000;
    const minutosStr = minutos.toString().padStart(2, '0');
    const segundosStr = segundos.toString().padStart(2, '0');
    const milisegundosStr = milisegundos.toString().padStart(3, '0');
    
    console.log(`${minutosStr}:${segundosStr}:${milisegundosStr}`);
    return `${minutosStr}:${segundosStr}:${milisegundosStr}`;
  }

}
