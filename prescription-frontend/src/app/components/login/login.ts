import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html', // Fixed template reference
  styleUrls: ['./login.component.css']   // Fixed style reference
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = 'Invalid username or password';
          this.loading = false;
        }
      });
  }
}