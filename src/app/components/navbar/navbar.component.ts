import { Component } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { from } from 'rxjs';
import { environment } from '../../../environments/environment';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey)


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  logout() {
    return from(supabase.auth.signOut());
  }
}
