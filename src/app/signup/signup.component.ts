// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-signup',
//   imports: [],
//   templateUrl: './signup.component.html',
//   styleUrl: './signup.component.scss'
// })
// export class SignupComponent {

// }

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'], 
})
export class SignupComponent {
  // Signup form data
  signupData = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
  };

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  // Handle signup form submission
  onSignup() {
    if (this.signupData.password !== this.signupData.confirm_password) {
      this.snackBar.open('Passwords do not match.', 'Close', { duration: 3000 });
      return;
    }

    if (
      this.signupData.first_name &&
      this.signupData.last_name &&
      this.signupData.email &&
      this.signupData.phone_number &&
      this.signupData.password
    ) {
      // Simulate a successful signup
      this.snackBar.open('Signup successful!', 'Close', { duration: 3000 });
      this.router.navigate(['/login']); // Redirect to login page
    } else {
      this.snackBar.open('Please fill in all fields.', 'Close', { duration: 3000 });
    }
  }
}
