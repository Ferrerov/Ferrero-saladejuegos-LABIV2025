import { Injectable, inject, signal } from '@angular/core';
import { createClient, type User } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuarioInterface } from '../interfaces/usuario.interface';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSig = signal<UsuarioInterface | null | undefined>(undefined);

  constructor() {
    this.loadCurrentUser();
    supabase.auth.onAuthStateChange((_, session) => {
      this.setUserFromSession(session?.user ?? null);
    });
  }

  private async loadCurrentUser() {
    const { data } = await supabase.auth.getUser();
    this.setUserFromSession(data.user ?? null);
  }

  private setUserFromSession(user: User | null) {
    if (user) {
      const usuario: UsuarioInterface = {
        uid: user.id,
        correo: user.email!,
        usuario: user.user_metadata?.['display_name']
      };
      this.currentUserSig.set(usuario);
    } else {
      this.currentUserSig.set(null);
    }
  }
  register(email: string, password: string, displayName: string): Observable<void> {
    const promise = supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        }
      }
    }).then(({ data, error }) => {
      console.log('data:', data);
      console.log('error:', error);

      if (!data.session && data.user?.identities?.length === 0) {
        const err = new Error('Correo ya registrado');
        (err as any).code = 'correo-existente';
        throw err;
      }

      if (error) throw error;
    });

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = supabase.auth.signInWithPassword({
      email,
      password
    }).then(({ error }) => {
      if (error) throw error;
    });

    return from(promise);
  }

  logout(): Observable<void> {
    const promise = supabase.auth.signOut().then(({ error }) => {
      if (error) throw error;
    });

    return from(promise);
  }
}
