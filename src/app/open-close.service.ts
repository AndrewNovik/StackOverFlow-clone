import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class OpenCloseService {

  answerAreaOpen:string[]

  constructor() {
    this.answerAreaOpen = []
   }

  public openAnswerForm(id:string) {
    if (this.answerAreaOpen.includes(id) == false){
      this.answerAreaOpen.push(id);
    }
    return this.answerAreaOpen
  }

  public closeAnswerForm(id:string){
    for (let i=0;i<this.answerAreaOpen.length;i++){
      if (this.answerAreaOpen[i]==id){
        this.answerAreaOpen.splice(i,1)
      }
    }
    return this.answerAreaOpen
  }
}
