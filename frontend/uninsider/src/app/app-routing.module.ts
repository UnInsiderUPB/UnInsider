import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';
import { AdminGuard } from './services/admin.guard';
import { NormalGuard } from './services/normal.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { UniversityAddComponent } from './pages/admin/university-add/university-add.component';
import { UniversityListComponent } from './components/university-list/university-list.component';
import { ReviewAddComponent } from './components/review-add/review-add.component';
import { UserManagementComponent } from './pages/admin/user-management/user-management.component';
import { UniversityTopComponent } from './components/university-top/university-top.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'signup',
    component: SignupComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: UniversityTopComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'universities',
        component: UniversityListComponent,
      },
      {
        path: 'universities/add',
        component: UniversityAddComponent,
      },
      {
        path: 'university-reviews',
        component: ReviewListComponent,
      },
      {
        path: 'university-reviews/add',
        component: ReviewAddComponent,
      },
      {
        path: 'my-reviews',
        component: ReviewListComponent,
      },
      {
        path: 'users',
        component: UserManagementComponent,
      },
    ],
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [NormalGuard],
    children: [
      {
        path: '',
        component: UniversityTopComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'universities',
        component: UniversityListComponent,
      },
      {
        path: 'university-reviews',
        component: ReviewListComponent,
      },
      {
        path: 'university-reviews/add',
        component: ReviewAddComponent,
      },
      {
        path: 'my-reviews',
        component: ReviewListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
