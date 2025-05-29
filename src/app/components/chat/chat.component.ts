import { Component, inject, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SupabaseDbService } from '../../services/supabase-db-service.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardHeader, MatCardFooter, MatCardTitle, MatCardContent, MatFormField, MatIconModule, MatInput, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  supabaseDbService = inject(SupabaseDbService);
  nuevoMensaje: string = '';
  mensajes: any = [{}];
  chatMinimizado = true;
  @ViewChild('mensajesContainer') mensajesContainer!: ElementRef;
  mensajesSubscription!: Subscription;

  ngOnInit(): void {
    this.cargarMensajes();
  }
  ngOnDestroy(): void {
    if (this.mensajesSubscription) {
      this.mensajesSubscription.unsubscribe();
    }
    console.log('destroy chat');
  }

  EnviarMensaje(){
    console.log(this.nuevoMensaje);
    this.guardarMensaje();
    this.nuevoMensaje = '';
  }

  scrollToBottom(): void {
    try {
      this.mensajesContainer.nativeElement.scrollTop = this.mensajesContainer.nativeElement.scrollHeight;
    } catch (err) {
      //console.error('Error al hacer scroll');
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  guardarMensaje()
  {
    const usuarioActual = this.authService.currentUser()!;
    let fecha_envio = new Date();
    //this.firestoreService.addMensaje(usuarioActual.uid!, usuarioActual.usuario, this.nuevoMensaje, fecha_envio);
    this.supabaseDbService.addMensaje(usuarioActual.uid!, usuarioActual.username, this.nuevoMensaje).subscribe((mensaje) => {
      console.log('Mensaje guardado:', mensaje);
      this.cargarMensajes();
    });
  }
  minimizarChat() {
    this.chatMinimizado = !this.chatMinimizado;
  }

  cargarMensajes(){
    if (this.mensajesSubscription) {
      this.mensajesSubscription.unsubscribe();
    }
    this.mensajesSubscription = this.supabaseDbService.getMensajes().subscribe((mensajes) => {
      this.mensajes = mensajes.sort((a, b) => {
        return new Date(a.fecha_envio).getTime() - new Date(b.fecha_envio).getTime();
      });
      this.supabaseDbService.mensajesSig.set(this.mensajes);
    });
  }
}
