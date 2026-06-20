import { Routes } from '@angular/router';
import { Profile } from './profile/profile';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: 'profile', component: Profile },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'home', component: HomeComponent},
  { path: "**", redirectTo: "" }
];