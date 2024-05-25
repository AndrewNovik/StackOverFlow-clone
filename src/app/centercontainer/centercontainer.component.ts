import { Component, OnInit, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc} from '@angular/fire/firestore';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, Subject, take, takeUntil, zip } from 'rxjs';
import { OpenCloseService } from '../open-close.service';
import { DataMethodsService } from '../data-methods.service';

@Component({
  selector: 'app-centercontainer',
  templateUrl: './centercontainer.component.html',
  styleUrl: './centercontainer.component.css'
})

export class CentercontainerComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  private aCollection = collection(this.firestore, 'questions');
  data$: Observable<any[]> = collectionData(this.aCollection, { idField:'id'});

  private aCollectionUsers = collection(this.firestore, 'Users');
  dataUsers$:Observable<any[]> = collectionData(this.aCollectionUsers, { idField:'id'});

  adminEmail:string = 'vitalevich16@gmail.com';
  IsAdmin = false;
  dataAnswers:string[] = [];
  destroed = new Subject();

  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  currentUserEmail?:string | null = '';



  constructor(public openClose: OpenCloseService, public dataMethods: DataMethodsService) { }

  deepEqual (obj1: any, obj2: any){
    return JSON.stringify(obj1)===JSON.stringify(obj2);
  }

  ngOnInit(): void {
    this.getData();

  }

  getData(){
    this.user$.subscribe(res => {
      if(this.adminEmail === res?.email){
        this.IsAdmin = true;
      }
      this.currentUserEmail = res?.email;
    });
  }

  DeleteQuestion(id:string){
    const aCollection = doc(this.firestore, 'questions', id)
    console.log()
    deleteDoc(aCollection).then(()=>{
      // console.log('Good');
    }).catch((err)=>{
      console.log(err)
    })
  }

  answerForm = new UntypedFormGroup({
    answers: new UntypedFormControl('', Validators.required),
  })

  newId:number = 0; // нужна была временное хранилище

  handleFormSend(newForm: FormGroup, id:string){
    zip(this.user$, this.data$).pipe(take(1)).subscribe(([user,data]) => {
      
      if(newForm.valid){
        let answersArr: { answerId:number; answerAuthorEmail: string; body: string; isTrue: boolean; rate: number; }[] = [];
        const a = newForm.getRawValue(); 
        for (let x of data){
          if (x.id == id){
            for (let m of x.answers){
              if(this.deepEqual(m,{}) == true){
                answersArr = [];
                
              } else{
                this.newId = m.answerId+1
                answersArr.push(m)
              }
            }        
          }     
        }
        answersArr.push({answerId: this.newId, answerAuthorEmail:`${user?.email}`, body:`${a.answers}`, isTrue:false, rate:0});
        this.dataMethods.updateData(id, this.firestore, 'questions', {
          answers:answersArr,
        }); 

        
        
        alert('Надеемся что это ответ здорового человека!')
        
        this.answerForm.reset();
        this.openClose.closeAnswerForm(id);
      } else {
        alert('Заполните нормально свой ответ или авторизуйтесь!')
      }
    }); 

  }
    
  changeRate(id:string, i:number, value:number){
    this.data$.pipe(take(1)).subscribe(data => {
      let answersArr: {}[] | { answerId:number; answerAuthorEmail: string; body: string; isTrue: boolean; rate: number; }[] = [];
      for (let x of data){
        if (x.id == id){
          for (let m of x.answers){
            if (m.answerId == i){
              m.rate = m.rate+value
            }
            answersArr.push(m)
          }       
        }     
      }
      this.dataMethods.updateData(id, this.firestore, 'questions',{
        answers: answersArr
        });
    })
  }


  checkRightAnswer(id:string, i:any){
    this.data$.pipe(take(1)).subscribe(data => {
      let answersArr: {}[] | { answerId:number; answerAuthorEmail: string; body: string; isTrue: boolean; rate: number; }[] = [];
      for (let x of data){
        if (x.id == id){
          for (let m of x.answers){
            
            if (m.answerId == i){
              m.isTrue = true
            }
            answersArr.push(m)
          }       
        }     
      }
      this.dataMethods.updateData(id, this.firestore, 'questions',{
        answers: answersArr
        });
    })
  }
}
