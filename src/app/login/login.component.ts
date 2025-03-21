import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  usernameControl = new FormControl('');
  passwordControl = new FormControl('');

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onLogin() {
    debugger;
    const loginData = {
      email: this.usernameControl.value,
      password: this.passwordControl.value
    };

    if (!loginData.email || !loginData.password) {
      this.snackBar.open('Please enter both username and password.', 'Close', { duration: 3000 });
      return;
    }

    // Call the login API
    this.apiService.login(loginData).subscribe({
      next: (response) => {
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
       
        // Store the userType in localStorage
        localStorage.setItem('userType', response.UserType);

        // Redirect to user home based on the user type
        if (response?.UserType === 'StandardUser') {
          this.router.navigate(['/userhome']);
        } else if (response?.UserType === 'Admin') {
          this.router.navigate(['/adminhome']);
        }
      },
      error: (error) => {
        this.snackBar.open(error?.error?.message || 'Login failed. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}