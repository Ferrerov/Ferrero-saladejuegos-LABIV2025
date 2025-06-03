import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { EquipoInterface } from '../../interfaces/equipo.interface';
import { MatButton, MatFabButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { TablapuntajeComponent } from '../tablapuntaje/tablapuntaje.component';
import { SupabaseDbService } from '../../services/supabase-db-service.service';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [MatButton, CommonModule, MatIcon, TablapuntajeComponent, MatFabButton],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.scss',
})
export class PreguntadosComponent implements OnInit {
  imagen: string = '';
  apiService = inject(ApiService);
  equipo: EquipoInterface | null = null;
  equipoNuevo: EquipoInterface | null = null;
  comenzo: boolean = false;
  pregunta: string = '¿A qué equipo pertenece este escudo?';
  equipos: string[] = [
    'Arsenal',
    'Manchester_United',
    'Liverpool',
    'Chelsea',
    'Tottenham',
    'Real_Madrid',
    'Barcelona',
    'Atletico_Madrid',
    'Sevilla',
    'Valencia',
    'Juventus',
    'AC_Milan',
    'Roma',
    'Napoli',
    'Marseille',
    'Lyon',
    'Monaco',
    'Lille',
    'Boca_Juniors',
    'River_Plate',
    'Flamengo',
    'Palmeiras',
    'Santos',
    'Corinthians',
    'Sao_Paulo',
    'Gremio',
    'Internacional',
    'Cruzeiro',
    'Nacional',
    'Peñarol',
    'Independiente',
    'Racing_Club',
    'San_Lorenzo',
  ];
  opciones: string[] = [];
  respuestaCorrecta: string = '';
  vidas: number = 4;
  puntos: number = 0;
  nuevaImagen: string = '';
  nuevasOpciones: string[] = [];
  nuevaRespuestaCorrecta: string = '';
  authService = inject(AuthService);
  juego: string = 'preguntados';
  verPuntajes: boolean = false;
  supabase = inject(SupabaseDbService);

  ngOnInit(): void {}

  setearVariables() {
    this.imagen = '';
    this.equipo = null;
    this.equipoNuevo = null;
    this.comenzo = false;
    this.equipos = [
      'Arsenal',
      'Manchester_United',
      'Liverpool',
      'Chelsea',
      'Tottenham',
      'Real_Madrid',
      'Barcelona',
      'Atletico_Madrid',
      'Sevilla',
      'Valencia',
      'Juventus',
      'AC_Milan',
      'Roma',
      'Napoli',
      'Marseille',
      'Lyon',
      'Monaco',
      'Lille',
      'Boca_Juniors',
      'River_Plate',
      'Flamengo',
      'Palmeiras',
      'Santos',
      'Corinthians',
      'Sao_Paulo',
      'Gremio',
      'Internacional',
      'Cruzeiro',
      'Nacional',
      'Peñarol',
      'Independiente',
      'Racing_Club',
      'San_Lorenzo',
    ];
    this.opciones = [];
    this.respuestaCorrecta = '';
    this.vidas = 4;
    this.puntos = 0;
    this.nuevaImagen = '';
    this.nuevasOpciones = [];
    this.nuevaRespuestaCorrecta = '';
  }
  comenzarJuego() {
    this.setearVariables();
    this.seleccionarPrimerEquipo();
  }
  seleccionarPrimerEquipo() {
    const indiceCorrecto = Math.floor(Math.random() * this.equipos.length);
    const opcionesIncorrectas: string[] = [];
    this.respuestaCorrecta = this.equipos[indiceCorrecto];
    this.equipos.splice(indiceCorrecto, 1);

    while (opcionesIncorrectas.length < 2) {
      const indice = Math.floor(Math.random() * this.equipos.length);
      const equipo = this.equipos[indice];
      if (!opcionesIncorrectas.includes(equipo)) {
        opcionesIncorrectas.push(equipo);
      }
    }

    this.opciones = [this.respuestaCorrecta, ...opcionesIncorrectas].sort(
      () => Math.random() - 0.5
    );
    this.obtenerEquipo(this.respuestaCorrecta);
  }

  seleccionarEquipo() {
    const opcionesIncorrectas: string[] = [];
    const indiceCorrecto = Math.floor(Math.random() * this.equipos.length);

    if (this.equipos.length < 3) {
      console.error('No hay suficientes equipos para continuar el juego.');
      return;
    }
    this.nuevaRespuestaCorrecta = this.equipos[indiceCorrecto];
    this.equipos.splice(indiceCorrecto, 1);
    while (opcionesIncorrectas.length < 2) {
      const indice = Math.floor(Math.random() * this.equipos.length);
      const equipo = this.equipos[indice];
      if (!opcionesIncorrectas.includes(equipo)) {
        opcionesIncorrectas.push(equipo);
      }
    }

    this.nuevasOpciones = [
      this.nuevaRespuestaCorrecta,
      ...opcionesIncorrectas,
    ].sort(() => Math.random() - 0.5);
    this.obtenerEquipo(this.nuevaRespuestaCorrecta);
  }

  obtenerEquipo(equipo: string) {
    this.apiService.getEquipo(equipo).subscribe((equipos) => {
      if (equipos && equipos.length > 0) {
        this.equipoNuevo = equipos[0];
        this.nuevaImagen = equipos[0].strBadge;
        if (!this.comenzo) {
          this.imagen = equipos[0].strBadge;
          console.log(equipos[0].strBadge);
          this.comenzo = true;
          this.seleccionarEquipo();
        }
      } else {
        console.error('No se encontro el equipo: ' + equipo);
      }
    });
  }

  seleccionarOpcion(opcion: string, event: Event) {
    const botonSeleccionado = event.currentTarget as HTMLButtonElement;
    const botonesOpciones = document.querySelectorAll('.opcion button');
    botonesOpciones.forEach((boton: Element) => {
      (boton as HTMLButtonElement).disabled = true;
    });

    if (opcion === this.respuestaCorrecta) {
      botonSeleccionado.classList.add('correcta');
      this.puntos++;
    } else {
      botonSeleccionado.classList.add('incorrecta');
      this.vidas--;
      botonesOpciones.forEach((boton: Element) => {
        if (
          boton.textContent?.trim() === this.respuestaCorrecta.replace('_', ' ')
        ) {
          boton.classList.add('correcta');
        }
      });
    }

    setTimeout(() => {
      botonSeleccionado.classList.remove('correcta', 'incorrecta');
      botonesOpciones.forEach((boton: Element) => {
        boton.classList.remove('correcta', 'incorrecta');
        (boton as HTMLButtonElement).disabled = false;
      });

      this.respuestaCorrecta = this.nuevaRespuestaCorrecta;
      this.opciones = [...this.nuevasOpciones];
      this.imagen = this.nuevaImagen;

      if (this.vidas == 0) {
        this.guardarResultados();
        this.comenzo = false;
      } else {
        this.seleccionarEquipo();
      }
    }, 2500);
  }

  guardarResultados() {
    this.supabase
      .addResultado(
        this.authService.currentUser()!.username,
        'preguntados',
        this.puntos,
        'desc'
      )
      .subscribe({
        next: (res) => console.log('Resultado:', res),
        error: (err) => console.error('Error:', err),
      });
  }
  verVentana(ver: boolean) {
    this.verPuntajes = ver;
  }
}
