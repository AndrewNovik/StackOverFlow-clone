import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, take, takeUntil, zip } from 'rxjs';
import { FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DataMethodsService } from '../data-methods.service';
import { SignInOutService } from '../sign-in-out.service';
import { UtilityService } from '../utility.service';

@Component({
  selector: 'app-asks-and-answers',
  templateUrl: './asks-and-answers.component.html',
  styleUrl: './asks-and-answers.component.css'
})
export class AsksAndAnswersComponent{

  constructor(
    public utility: UtilityService,
    private route: ActivatedRoute,
    public dataMethods: DataMethodsService, 
    public signInOut: SignInOutService,   
  ) {}
  
  destroed = new Subject();

  answerForm = new UntypedFormGroup({
    answers: new UntypedFormControl('', Validators.required),
  })

  newId:number = 0; // нужна была временное хранилище

  handleFormSend(newForm: FormGroup, id:string){
    zip(this.dataMethods.user$, this.dataMethods.dataQuestions$).pipe(take(1)).subscribe(([user,data]) => {
      
      if(newForm.valid){
        let answersArr: {}[] | { answerId:number; answerAuthorEmail: string; body: string; isTrue: boolean; rate: number; }[] = [];
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
        this.dataMethods.updateData(id, 'questions',{
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
