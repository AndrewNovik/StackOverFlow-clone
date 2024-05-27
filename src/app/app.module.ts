import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthComponent } from './auth/auth.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from './env';
import { NavbarComponent } from './navbar/navbar.component';
import { SitebodyComponent } from './sitebody/sitebody.component';
import { LeftcontainerComponent } from './leftcontainer/leftcontainer.component';
import { CentercontainerComponent } from './centercontainer/centercontainer.component';
import { RightcontainerComponent } from './rightcontainer/rightcontainer.component';
import { ModersListComponent } from './moders-list/moders-list.component';
import { UsersListComponent } from './users-list/users-list.component';
import { AskquestionComponent } from './askquestion/askquestion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsksAndAnswersComponent } from './asks-and-answers/asks-and-answers.component';
import { SortRatingsPipe } from './sort-ratings.pipe';
import { QuestionLabelComponent } from './question-label/question-label.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    NavbarComponent,
    SitebodyComponent,
    LeftcontainerComponent,
    CentercontainerComponent,
    RightcontainerComponent,
    ModersListComponent,
    UsersListComponent,
    AskquestionComponent,
    AsksAndAnswersComponent,
    SortRatingsPipe,
    QuestionLabelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
