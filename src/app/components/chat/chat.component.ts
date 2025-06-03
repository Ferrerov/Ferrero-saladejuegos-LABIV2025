import {
  Component,
  inject,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewChecked,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { SupabaseDbService } from '../../services/supabase-db-service.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardHeader,
    MatCardFooter,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatIconModule,
    MatInput,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  authService = inject(AuthService);
  supabaseDbService = inject(SupabaseDbService);
  nuevoMensaje = '';
  chatMinimizado = true;

  @ViewChild('mensajesContainer') mensajesContainer!: ElementRef;

  get mensajes() {
    return this.supabaseDbService.mensajes$(); // signal reactivo
  }

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.supabaseDbService.removeMensajes();
  }

  EnviarMensaje(): void {
    const usuarioActual = this.authService.currentUser()!;
    this.supabaseDbService
      .addMensaje(usuarioActual.uid!, usuarioActual.username, this.nuevoMensaje)
      .subscribe();
    this.nuevoMensaje = '';
  }

  scrollToBottom(): void {
    try {
      this.mensajesContainer.nativeElement.scrollTop =
        this.mensajesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  minimizarChat(): void {
    this.chatMinimizado = !this.chatMinimizado;
  }
}
