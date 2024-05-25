import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, getAuth, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DataMethodsService } from './data-methods.service';

@Injectable({
  providedIn: 'root'
})

export class SignInOutService {

  login:string | null = 'Login';
  signout:string | null = null;
  firestore: Firestore = inject(Firestore);
  data!: Observable<any[]>;
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  userList:any[] = [];
  credential:any;
  
  constructor(private dataMethods: DataMethodsService) { }

  googleSignIn() {
    this.auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        this.credential = GoogleAuthProvider.credentialFromResult(result)!;
        const user = result.user;
        const aCollection = collection(this.firestore, 'Users')
        this.data = collectionData(aCollection)
        this.data.subscribe(res => {
          for (let i in res){
            this.userList.push(res[i].email)
          }

          if (this.userList.includes(user.email) == false){
            const isModer = false;
            const newId = res.length;
            const f = {isModer, id:newId, userName:user.displayName, email:user.email};
            this.dataMethods.addData(f, this.firestore, 'Users');  
          }
          // Добавил сюда опустошение списка юзерор из фаербейса, чтобы после прогонки и поиска есть ли юзер в базе, этот списочек всеравно 
          // очищался, тк он заполнялся, если много раз туда-сюда логиниться
          this.userList = []
        })

        this.login = result.user.displayName;
        this.signout = 'logined';
        
      }).catch((error) => {
        console.log(error)
        const errorCode = error.code;
        const errorMessage = error.message;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });

  }

  signOut() {
    signOut(this.auth);
    this.login = 'Login'
    this.signout = null;
    this.credential = undefined;
  }
}
