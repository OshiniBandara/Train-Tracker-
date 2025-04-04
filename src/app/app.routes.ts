import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DelayreportComponent } from './delayreport/delayreport.component';
import { TrainscheduleComponent } from './trainschedule/trainschedule.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import {AddTrainRecordComponent} from './addrecord/addrecord.component'


export const routes: Routes = [
    { path: '', component: HomeComponent }, // Default route
    { path: 'delayreport', component: DelayreportComponent },
    { path: 'trainschedule', component: TrainscheduleComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'addrecord', component: AddTrainRecordComponent },
    

];
