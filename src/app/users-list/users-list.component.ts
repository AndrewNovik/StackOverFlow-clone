import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
  firestore: Firestore = inject(Firestore);
  data!: Observable<any[]>;
  usersList: string[] = [];
  moderEmailList: string[] = [];


  constructor() {
    this.getUserssData();
  }

  getUserssData(){
    const aCollection = collection(this.firestore, 'Users')
    this.data = collectionData(aCollection)
    this.data.subscribe(res => {
      for (let i in res){
        if (res[i].isModer != true && this.usersList.includes(res[i].userName) != true){
          this.usersList.push(res[i].userName)
          this.moderEmailList.push(res[i].email)
// как тут норм соотнести что пушим элем в массив. Как указать тип переменных
        }
        }
      });
  }


}
