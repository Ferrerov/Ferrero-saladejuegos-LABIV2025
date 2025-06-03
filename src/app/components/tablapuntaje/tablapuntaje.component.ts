import { Component, EventEmitter, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ResultadoInterface } from '../../interfaces/resultado.interface';
import {MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButton, MatFabButton } from '@angular/material/button';
import { SupabaseDbService } from '../../services/supabase-db-service.service';


const ELEMENT_DATA: ResultadoInterface[] = [
  {usuario: 'user1', juego: 'preguntados', puntaje: 10, fecha_jugado: new Date(Date.now()), orden: 'asc'},
  {usuario: 'user2', juego: 'preguntados', puntaje: 45, fecha_jugado: new Date(Date.now()), orden: 'asc'},
  {usuario: 'user3', juego: 'mayormenor', puntaje: 222, fecha_jugado: new Date(Date.now()), orden: 'asc'},
];

@Component({
  selector: 'app-tablapuntaje',
  standalone: true,
  imports: [MatTableModule, MatSortModule, CommonModule, MatFabButton],
  templateUrl: './tablapuntaje.component.html',
  styleUrl: './tablapuntaje.component.scss'
})
export class TablapuntajeComponent {
  @Input() puntajeRequerido: string = "";
  @Input() ordenPuntos: 'asc' | 'desc' = 'asc';
  @Input() tipoPuntaje: string = "";
  //@ViewChild(MatSort) sort!: MatSort;
  supabase = inject(SupabaseDbService);
  resultadosSuscripcion!: Subscription;

  displayedColumns: string[] = ['posicion', 'usuario', 'puntaje', 'fecha_jugado'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource!: MatTableDataSource<ResultadoInterface>;
  @Output() ver = new EventEmitter<any>();

  constructor(){
    this.resultadosSuscripcion = this.supabase.getResultados().subscribe((resultados) => {
      console.log('Resultados obtenidos:', resultados);
      const sortedResultados = resultados.sort((a, b) => {
        if (this.ordenPuntos === 'asc') {
          return a.puntaje - b.puntaje;
        } else {
          return b.puntaje - a.puntaje;
        }
      });
      this.dataSource =  new MatTableDataSource(sortedResultados);
      this.dataSource.filterPredicate = (data: ResultadoInterface, filter: string) => {
        return data.juego === filter;
      };
      this.dataSource.filter = this.puntajeRequerido;
    });
  }

  obtenerResultados(){
    return this.supabase.getResultados();
  }

  cerrarVentana() {
    this.ver.emit(false);
  }
}
