import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataMethodsService {

  constructor() { }

  
  
  addData(f:any,firestoreObj:Firestore, base:string){
    const aCollection = collection(firestoreObj, base)
    addDoc(aCollection, f).then((res) => {console.log(res)}).catch((err)=>{console.log(err)})
  }



  updateData(id:string, firestoreObj:Firestore, base: string, f:any){
    const aCollection = doc(firestoreObj, base, id)
    updateDoc(aCollection, f)
      .then(()=>{
      }).catch((err)=>{
        console.log(err)
      })
  }

  
}
