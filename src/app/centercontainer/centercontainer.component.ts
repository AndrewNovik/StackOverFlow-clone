import { Component, OnInit} from '@angular/core';
import { FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject, take, takeUntil, zip } from 'rxjs';
import { DataMethodsService } from '../data-methods.service';
import { SignInOutService } from '../sign-in-out.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-centercontainer',
  templateUrl: './centercontainer.component.html',
  styleUrl: './centercontainer.component.css'
})

export class CentercontainerComponent implements OnInit {

  dataAnswers:string[] = [];
  destroed = new Subject();

  constructor(
    public dataMethods: DataMethodsService, 
    public signInOut: SignInOutService,
    public utility: UtilityService
  
  ) { }

  ngOnInit(): void {
    this.signInOut.currentUser();
  }

  delQuestion(id:string){
    const base = 'questions';
    this.dataMethods.DeleteQuestion(id, this.dataMethods.firestore, base);
  }

  answerForm = new UntypedFormGroup({
    answers: new UntypedFormControl('', Validators.required),
  })

  newId:number = 0; // нужна была временное хранилище

  handleFormSend(newForm: FormGroup, id:string){
    zip(this.dataMethods.user$, this.dataMethods.dataQuestions$).pipe(take(1)).subscribe(([user,data]) => {
      if(newForm.valid){
        let answersArr: { answerId:number; answerAuthorEmail: string; body: string; isTrue: boolean; rate: number; }[] = [];
        const a = newForm.getRawValue(); 
        for (let x of data){
          if (x.id == id){
            for (let m of x.answers){
              if(this.utility.deepEqual(m,{}) == true){
                answersArr = [];
                
              } else{
                this.newId = m.answerId+1
                answersArr.push(m)
              }
            }        
          }     
        }
        answersArr.push({answerId: this.newId, answerAuthorEmail:`${user?.email}`, body:`${a.answers}`, isTrue:false, rate:0});
        this.dataMethods.updateData(id, 'questions', {
          answers:answersArr,
        }); 

        alert('Ответ принят!')
        
        this.answerForm.reset();
        this.utility.closeAnswerForm(id);
      } else {
        alert('Ошибка авторизации или формы ответа!')
      }
    }); 
  }
}
