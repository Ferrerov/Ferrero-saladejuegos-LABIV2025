import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'saladejuegos';
  authService = inject(AuthService);
  ngOnInit(): void {
    this.authService.supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth:', event, session);
      if (event === 'SIGNED_IN') {
        this.authService.currentUser.set({
          email: session?.user.email!,
          username: session?.user.identities?.at(0)?.identity_data?.['username'],
          uid: session?.user.id!
      });
      } else if (event === 'SIGNED_OUT') {
        this.authService.currentUser.set(null);
      }
    });
  }
}
