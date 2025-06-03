import { inject, Injectable, signal, computed } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { MensajeInterface } from '../interfaces/mensaje.interface';
import { ResultadoInterface } from '../interfaces/resultado.interface';

@Injectable({ providedIn: 'root' })
export class SupabaseDbService {
  private supabase = createClient(
    environment.apiUrl,
    environment.publicAnonKey
  );

  private mensajesSignal = signal<MensajeInterface[]>([]);
  mensajes$ = computed(() =>
    this.mensajesSignal()
      .slice()
      .sort(
        (a: MensajeInterface, b: MensajeInterface) =>
          new Date(a.fecha_envio).getTime() - new Date(b.fecha_envio).getTime()
      )
  );

  private mensajesChannel: RealtimeChannel | null = null;

  constructor() {
    this.listenMensajes();
    this.loadMensajes();
  }

  private loadMensajes(): void {
    this.getMensajes().subscribe((mensajes: MensajeInterface[]) => {
      this.mensajesSignal.set(mensajes);
    });
  }

  private listenMensajes(): void {
    if (this.mensajesChannel) return;

    this.mensajesChannel = this.supabase
      .channel('mensajes-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mensajes' },
        (payload) => {
          const nuevo = payload.new as MensajeInterface;
          const actual = this.mensajesSignal();
          this.mensajesSignal.set([...actual, nuevo]);
        }
      )
      .subscribe();
  }

  removeMensajes(): void {
    if (this.mensajesChannel) {
      this.supabase.removeChannel(this.mensajesChannel);
      this.mensajesChannel = null;
    }
  }

  getMensajes(): Observable<MensajeInterface[]> {
    const promesa = this.supabase.from('mensajes').select('*');
    return from(promesa).pipe(map((res) => res.data ?? []));
  }

  addMensaje(
    uid: string,
    usuario: string,
    mensaje: string
  ): Observable<MensajeInterface> {
    const mensajeCreado = {
      uid,
      usuario,
      mensaje,
      fecha_envio: new Date(),
    };
    const promesa = this.supabase
      .from('mensajes')
      .insert(mensajeCreado)
      .select('*')
      .single();
    return from(promesa).pipe(map((res) => res.data!));
  }

  getResultados(): Observable<ResultadoInterface[]> {
    const promesa = this.supabase.from('resultados').select('*');
    return from(promesa).pipe(map((res) => res.data ?? []));
  }

  addResultado(
    usuario: string,
    juego: string,
    puntaje: number,
    orden: string
  ): Observable<string> {
    const fecha_jugado = new Date();
    const resultadoCreado = { usuario, juego, puntaje, orden, fecha_jugado };
    const promesa = this.supabase
      .from('resultados')
      .insert(resultadoCreado)
      .select('*')
      .single();
    return from(promesa).pipe(map((res) => res.data!));
  }

  addEncuesta(
    uid: string,
    nombre: string,
    apellido: string,
    edad: number,
    telefono: string,
    calidadJuegos: string,
    juegosSeleccionados: string[],
    sugerencia: string
  ): Observable<string> {
    const fecha_creada = new Date();
    const encuestaCreada = {
      uid,
      nombre,
      apellido,
      edad,
      telefono,
      calidadJuegos,
      juegosSeleccionados,
      sugerencia,
      fecha_creada,
    };
    const promesa = this.supabase
      .from('encuestas')
      .insert(encuestaCreada)
      .select('*')
      .single();
    return from(promesa).pipe(map((res) => res.data!));
  }

  addLog(correo_usuario: string, fecha_ingreso: Date): Observable<any> {
    const logCreado = { correo_usuario, fecha_ingreso };
    const promesa = this.supabase
      .from('logsSesiones')
      .insert(logCreado)
      .select('*')
      .single();
    return from(promesa).pipe(map((res) => res.data!));
  }
}
