import { Component, OnDestroy, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc} from '@angular/fire/firestore';

import { FormControl, FormGroup, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { Auth, GoogleAuthProvider, getAuth, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Observable, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-askquestion',
  templateUrl: './askquestion.component.html',
  styleUrl: './askquestion.component.css'
})
export class AskquestionComponent implements OnDestroy{

  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  destroed = new Subject();
  firestore: Firestore = inject(Firestore);
  data!: Observable<any[]>;


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
    this.user$.pipe(takeUntil(this.destroed)).subscribe(user => {
      myForm.addControl('authorEmail', new FormControl(user?.email, Validators.required));
      if(myForm.valid){

        const aCollection = collection(this.firestore, 'questions')
        this.data = collectionData(aCollection, { idField:'id'})
        console.log(this.data);
        const isAnswered = false;
        const answers = [{}];
        const f = {isAnswered, ...myForm.value, answers};
        this.addData(f);
        alert('Надейтесь, что вам ответят :)')

        this.myForm.reset();
      } else {
        alert('Заполните нормально свой вопрос или авторизуйтесь!')
      }
    });    
  }

  addData(f:any){
    const aCollection = collection(this.firestore, 'questions')
    addDoc(aCollection, f).then((res) => {console.log(res)}).catch((err)=>{console.log(err)})
  }  


  // let promise = new Observable(function(obs) {
    //   setInterval(() => obs.next('svsdv'), 1000);
    // });
  // promise = new Promise(function(resolver, reject) {});
}
