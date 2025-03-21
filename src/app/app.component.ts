import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialogModule} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule} from '@angular/material/input';
import { ApiService } from './services/api.service'; 
import { MatTableModule} from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    RouterModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    MatInputModule,
    MatTableModule, 
    MatCardModule ],
  providers: [ApiService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'train-tracker';
  userType: string | null = '';
  homeLink: string = '';

  isAuthenticated$: Observable<boolean>;

  constructor(private apiService: ApiService,private router: Router) {
    this.isAuthenticated$ = this.apiService.isAuthenticated$;
  }

  ngOnInit() {
    const userType = localStorage.getItem('userType');
    
    if (!userType) {
      // If not logged in, redirect to login page
      this.router.navigate(['/login']);
    } else if (userType === 'Admin') {
      // If logged in as Admin, redirect to /adminhome
      this.router.navigate(['/adminhome']);
    } else if (userType === 'StandardUser') {
      // If logged in as StandardUser, redirect to /userhome
      this.router.navigate(['/userhome']);
    }
  }

  onLogout() {
    this.apiService.logout();
    this.userType = null;
    this.router.navigate(['/login']);
  }
}
