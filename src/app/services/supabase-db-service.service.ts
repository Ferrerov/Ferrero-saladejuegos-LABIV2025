import { inject, Injectable, signal } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { MensajeInterface } from '../interfaces/mensaje.interface';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseDbService {
  supabase = createClient(environment.apiUrl, environment.publicAnonKey);
  mensajesSig = signal<MensajeInterface[]>([]);

  getMensajes():Observable<MensajeInterface[]>{
    const promesa = this.supabase.from('mensajes').select('*');
    return from(promesa).pipe(
      map((response) => {
        return response.data ?? [];
      })
    );
  }

  addMensaje(uid:string, usuario:string, mensaje:string):Observable<MensajeInterface>{
    const mensajeCreado = {mensaje, usuario ,uid};
    const promesa = this.supabase.from('mensajes').insert(mensajeCreado).select('*').single();
    return from(promesa).pipe(map((response) => response.data!));
  }
}
