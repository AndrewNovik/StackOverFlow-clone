import { Component, OnDestroy, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc} from '@angular/fire/firestore';

import { FormControl, FormGroup, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { Auth, GoogleAuthProvider, getAuth, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DataMethodsService } from '../data-methods.service';
import { SignInOutService } from '../sign-in-out.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-askquestion',
  templateUrl: './askquestion.component.html',
  styleUrl: './askquestion.component.css'
})
export class AskquestionComponent implements OnDestroy{



  destroed = new Subject();

  constructor (
    public dataMethods: DataMethodsService, 
    public signInOut: SignInOutService,
    public utility: UtilityService
  ) {}

  
  ngOnDestroy(): void {
    this.destroed.next(null);
  }

  ngOnInit(): void {
  }

  myForm = new FormGroup({
    questionTitle: new FormControl('', Validators.required),
    questionBody: new FormControl('',Validators.required)
  })
  

  public handleFormSend(myForm:FormGroup){
    this.dataMethods.user$.pipe(takeUntil(this.destroed)).subscribe(user => {
      myForm.addControl('authorEmail', new FormControl(user?.email, Validators.required));
      if(myForm.valid){

        const isAnswered = false;
        const answers = [{}];
        const f = {isAnswered, ...myForm.value, answers};
        this.signInOut.addData(f, this.dataMethods.firestore, 'questions');
        alert('Ответ принят!')

        this.myForm.reset();
      } else {
        alert('Заполните нормально свой вопрос или авторизуйтесь!')
      }
    });    
  } 
}
