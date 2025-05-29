import { Injectable, inject, signal } from '@angular/core';
import { AuthResponse, createClient, type User } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuarioInterface } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  supabase = createClient(environment.apiUrl, environment.publicAnonKey);
  currentUser = signal<UsuarioInterface | null>(null);

  register(email: string, username:string, password: string): Observable<AuthResponse> {
    const promise = this.supabase.auth.signUp(
    {
      email,
      password,
      options: {
        data: {
          username,
        },
      }
    });
    return from(promise);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const promise = this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    return from(promise);
  }

  logout(): void {
    this.supabase.auth.signOut();
  }
}
