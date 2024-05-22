import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-moders-list',
  templateUrl: './moders-list.component.html',
  styleUrl: './moders-list.component.css'
})
export class ModersListComponent {
  firestore: Firestore = inject(Firestore);
  data!: Observable<any[]>;
  moderList: string[] = [];
  moderEmailList: string[] = [];


  constructor() {
    this.getAdminUsersData();
  }

  getAdminUsersData(){
    const aCollection = collection(this.firestore, 'Users')
    this.data = collectionData(aCollection)
    this.data.subscribe(res => {
      for (let i in res){
        if (res[i].isModer == true && this.moderList.includes(res[i].userName) != true){
          this.moderList.push(res[i].userName)
          this.moderEmailList.push(res[i].email)
          console.log(this.moderList) // как тут норм соотнести что пушим элем в массив. Как указать тип переменных
        }
      }
    });
  }
}
