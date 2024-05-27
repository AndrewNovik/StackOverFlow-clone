import { Component } from '@angular/core';
import { UtilityService } from '../utility.service';
import { ActivatedRoute } from '@angular/router';
import { DataMethodsService } from '../data-methods.service';
import { SignInOutService } from '../sign-in-out.service';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ObservableInput, Subject, of, take, takeUntil, zip } from 'rxjs';

@Component({
  selector: 'app-question-label',
  templateUrl: './question-label.component.html',
  styleUrl: './question-label.component.css'
})
export class QuestionLabelComponent {

  public QuestionId:any;
  newId:number = 0;
  destroed = new Subject();
  questionWall: boolean | undefined;
  // отдельный вопрос или массив, мб прокинуть генерики на разные типы данных



  constructor (
    public dataMethods: DataMethodsService, 
    public signInOut: SignInOutService,
    public utility: UtilityService,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
    this.dataMethods.dataQuestions$.pipe(takeUntil(this.destroed)).subscribe(data => {
      const id = this.route.snapshot.paramMap.get('id');
      // Выбор нужного вопроса с помощью снепшота ссылки
      if ( id != null) {
        for (let x of data){
          if (x.id == id){
            
            this.QuestionId = x;
            console.log(this.QuestionId)
              
            this.questionWall = false;
          }   
        }
      } else {
        this.questionWall = true;
      }
      
    })
    this.signInOut.currentUser();
  }

  myForm = new FormGroup({
    questionTitle: new FormControl('', Validators.required),
    questionBody: new FormControl('',Validators.required)
  })
  
  answerForm = new UntypedFormGroup({
    answers: new UntypedFormControl('', Validators.required),
  })

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
