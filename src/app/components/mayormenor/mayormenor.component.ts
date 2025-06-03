import { Component, inject, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CartaInterface, MazoCartasInterface } from '../../interfaces/carta.interface';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { TablapuntajeComponent } from '../tablapuntaje/tablapuntaje.component';
import { AuthService } from '../../services/auth.service';
import { SupabaseDbService } from '../../services/supabase-db-service.service';


@Component({
  selector: 'app-mayormenor',
  standalone: true,
  imports: [MatCard, MatFabButton, MatIcon, CommonModule,TablapuntajeComponent],
  templateUrl: './mayormenor.component.html',
  styleUrl: './mayormenor.component.scss'
})
export class MayormenorComponent implements OnInit{
  apiService = inject(ApiService);
  imagenCarta: string = "https://www.deckofcardsapi.com/static/img/back.png";
  mazo: MazoCartasInterface | null = null;
  cartaActual: CartaInterface | null = null;
  cartaAnterior: CartaInterface | null = null;
  puntos: number = 0;
  vidas: number = 4;
  primeraCartaDada: boolean = false;
  animacionActiva: boolean = false;
  verPuntajes: boolean = false;
  authService = inject(AuthService);
  supabase = inject(SupabaseDbService);

  ngOnInit(): void {
    this.obtenerMazo();
  }

  obtenerMazo(){
    this.apiService.getMazo().subscribe(mazo => {
      this.mazo = mazo;
      console.log(this.mazo);
    });
  }

  darCarta(){
    this.apiService.getCarta(this.mazo!.deck_id).subscribe(mazo => {
      this.cartaAnterior = this.cartaActual;
      this.cartaActual = mazo.cards[0];
      this.imagenCarta = this.cartaActual.image;
      console.log(mazo.cards[0]);
      if(!this.primeraCartaDada) this.primeraCartaDada = true;
      this.activarAnimacion();
    });
  }

  darDeNuevo(){
    this.apiService.getMazoMezclado(this.mazo!.deck_id).subscribe(mazo => {
      this.mazo = mazo;
      this.darCarta();
      console.log(this.mazo);
      this.vidas = 4;
      this.puntos = 0;
    });
  }

  predecirValor(prediccion: string) {
    if (this.mazo) {
      this.apiService.getCarta(this.mazo.deck_id).subscribe(mazo => {
        this.cartaAnterior = this.cartaActual;
        this.cartaActual = mazo.cards[0];
        this.imagenCarta = this.cartaActual.image;
        this.activarAnimacion();
        console.log(this.cartaActual);
  
        if (this.cartaAnterior && this.cartaActual) {
          const valorAnterior = this.obtenerValorNumerico(this.cartaAnterior.value);
          const valorActual = this.obtenerValorNumerico(this.cartaActual.value);
  
          if ((prediccion === 'mayor' && valorActual > valorAnterior) || 
              (prediccion === 'menor' && valorActual < valorAnterior)) {
            this.puntos++;
            console.log('Adivinaste, puntos:', this.puntos);
          } else if (valorActual === valorAnterior){
            console.log('Son iguales, no ganas ni perdes puntos:', this.puntos);
          }
          else {
            this.vidas--;
            console.log('Fallaste, vidas restantes:', this.vidas);
          }
        }
        if(this.vidas == 0)
        {
          this.guardarResultados();
          setTimeout(()=>{
            this.imagenCarta = "https://www.deckofcardsapi.com/static/img/back.png";
            this.activarAnimacion();
          }, 1500);
        }
      });
    }
  }
  

  obtenerValorNumerico(valor: string): number {
    const valores: { [key: string]: number } = {
      'ACE': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'JACK': 11, 'QUEEN': 12, 'KING': 13
    };
    return valores[valor] || 0;
  }

  activarAnimacion() {
    this.animacionActiva = true;
    setTimeout(() => {
      this.animacionActiva = false;
    }, 500); // La duración de la animación es de 0.5s
  }

    guardarResultados() {
    this.supabase
      .addResultado(this.authService.currentUser()!.username, 'mayormenor', this.puntos, 'desc')
      .subscribe({
        next: (res) => console.log('Resultado:', res),
        error: (err) => console.error('Error:', err),
      });
  }

  verVentana(ver: boolean) {
    this.verPuntajes = ver;
  }
}
