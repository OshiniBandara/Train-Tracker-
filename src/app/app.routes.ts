import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrainscheduleComponent } from './trainschedule/trainschedule.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AddTrainRecordComponent} from './addrecord/addrecord.component'
import { UserhomeComponent } from './userhome/userhome.component';
import { EditTrainRecordComponent } from './edit-train-record/edit-train-record.component';
import { AuthGuard } from './auth.guard';


export const routes: Routes = [
    // { path: '', component: HomeComponent},
    // { path: 'trainschedule', component: TrainscheduleComponent },
    // { path: 'about', component: AboutComponent },
    // { path: 'contact', component: ContactComponent },
    // { path: 'signup', component: SignupComponent },
    // { path: 'login', component: LoginComponent },
    // { path: 'addrecord', component: AddTrainRecordComponent },
    // { path: 'userhome', component: UserhomeComponent },
    // { path: 'edit-train-record/:id', component: EditTrainRecordComponent },

    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login at app start
    { path: 'login', component: LoginComponent }, // Login route
    { path: 'signup', component: SignupComponent }, // Signup route

    // Protected routes
    {
        path: 'adminhome',
        component: HomeComponent,
        canActivate: [AuthGuard]  // Protecting admin home route
    },
    {
        path: 'userhome',
        component: UserhomeComponent,
        canActivate: [AuthGuard]  // Protecting user home route
    },
    
    // Other routes
    { path: 'trainschedule', component: TrainscheduleComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'addrecord', component: AddTrainRecordComponent, canActivate: [AuthGuard] }, // Protect add record route
    { path: 'edit-train-record/:id', component: EditTrainRecordComponent, canActivate: [AuthGuard] }, // Protect edit record route

    { path: '**', redirectTo: '/login' } 
    
];
