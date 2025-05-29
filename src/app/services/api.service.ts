import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartaInterface, MazoCartasInterface } from '../interfaces/carta.interface';
import { map, Observable } from 'rxjs';
import { EquipoInterface } from '../interfaces/equipo.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http = inject(HttpClient);
  constructor() { }

  getMazo(): Observable<MazoCartasInterface>{
    return this.http.get<MazoCartasInterface>('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
  }

  getCarta(deck:string): Observable<MazoCartasInterface>{
    return this.http.get<MazoCartasInterface>('https://www.deckofcardsapi.com/api/deck/' + deck + '/draw/?count=1');
  }

  getMazoMezclado(deck:string): Observable<MazoCartasInterface>{
    return this.http.get<MazoCartasInterface>('https://www.deckofcardsapi.com/api/deck/' + deck + '/shuffle/');
  }

  getEquipo(equipo: string): Observable<EquipoInterface[]> {
    console.log( 'Equipo buscado: ' + equipo);
    return this.http.get<{ teams: EquipoInterface[] }>('https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=' + equipo)
      .pipe(
        map(response => response.teams)
      );
  }
}
