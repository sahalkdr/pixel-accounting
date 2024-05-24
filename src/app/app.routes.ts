import { Routes } from '@angular/router';
import {LoginComponent} from "./layouts/login/login.component";
import {SignupComponent} from "./layouts/signup/signup.component";
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { ItemsComponent } from './layouts/items/items.component';
export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'dashboard', component: DashboardComponent, children: [
        { path: 'items', component: ItemsComponent }
        ] 
        }

];