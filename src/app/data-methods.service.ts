import { Injectable, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataMethodsService {

  firestore: Firestore = inject(Firestore);

  private aCollection = collection(this.firestore, 'questions');
  dataQuestions$: Observable<any[]> = collectionData(this.aCollection, { idField:'id'});

  private aCollectionUsers = collection(this.firestore, 'Users');
  dataUsers$:Observable<any[]> = collectionData(this.aCollectionUsers, { idField:'id'});

  public auth: Auth = inject(Auth);
  user$ = user(this.auth);
  

  constructor() { }

  addData(f:any, base:string){
    addDoc(collection(this.firestore, base), f)
  }

  updateData(id:string, base: string, f:any){
    updateDoc(doc(this.firestore, base, id), f)
      .then(()=>{
      }).catch((err)=>{
        console.log(err)
      })
  }

  deleteQuestion(id:string){
    deleteDoc(doc(this.firestore, 'questions', id));
  }

  changeRate(id:string, i:number, value:number){
    this.dataQuestions$.pipe(take(1)).subscribe(data => {
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
      this.updateData(id, 'questions',{
        answers: answersArr
        });
    })
  }


  checkRightAnswer(id:string, i:any){
    this.dataQuestions$.pipe(take(1)).subscribe(data => {
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
      this.updateData(id, 'questions',{
        answers: answersArr
        });
    })
  }
}
