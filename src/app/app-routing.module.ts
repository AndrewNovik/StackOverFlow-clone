import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModersListComponent } from './moders-list/moders-list.component';
import { UsersListComponent } from './users-list/users-list.component';
import { SitebodyComponent } from './sitebody/sitebody.component';
import { AskquestionComponent } from './askquestion/askquestion.component';
import { AsksAndAnswersComponent } from './asks-and-answers/asks-and-answers.component';

const routes: Routes = [
  { path: 'moders', component: ModersListComponent },
  { path: 'users', component: UsersListComponent },
  { path: 'askque', component: AskquestionComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: SitebodyComponent },
  { path: 'ask/:id', component: AsksAndAnswersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
