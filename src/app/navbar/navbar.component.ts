import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Auth, GoogleAuthProvider, getAuth, signInWithPopup, signOut, user } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  header_logo:string = 'Stackoverflow clone';
  login:string | null = 'Login';
  signout:string | null = null;

  firestore: Firestore = inject(Firestore);
  data!: Observable<any[]>;
  private auth: Auth = inject(Auth);


  user$ = user(this.auth);
  
  userList:any[] = [];

  token:string | undefined;
  credential:any;

  constructor() {
    // this.getUserData();
  }

  ngOnInit(): void {
    // this.getUserData();
  }

  googleSignIn() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        this.credential = GoogleAuthProvider.credentialFromResult(result)!;

        const user = result.user;

        // const usersEmails = this.getUserData();
        // console.log(user.email)
        const aCollection = collection(this.firestore, 'Users')
        this.data = collectionData(aCollection)
        this.data.subscribe(res => {
          for (let i in res){
            this.userList.push(res[i].email)
          }

          if (this.userList.includes(user.email) == false){
            const isModer = false;
            const answersIds: string[] = [];
            const newId = res.length;
            const questionsIds:string[] = [];
            const f = {isModer, answersIds, id:newId, questionsIds, userName:user.displayName, email:user.email};
            this.addData(f);
          }
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
    const auth = getAuth();
    signOut(auth);
    this.login = 'Login'
    this.signout = null;
    this.credential = undefined;
  }

  addData(f:any){
    const aCollection = collection(this.firestore, 'Users')
    addDoc(aCollection, f).then((res) => {console.log(res)}).catch((err)=>{console.log(err)})
  }

  getUserData(){}

  updateData(id:string){
    const aCollection = doc(this.firestore, 'Users', id)
    const updataData = {
      name: 'updated'
    }

  updateDoc(aCollection, updataData)
    .then(()=>{
      // console.log('Good');
    }).catch((err)=>{
      console.log(err)
    })
  }

  deleteData(id:string){
    const aCollection = doc(this.firestore, 'Users', id)
    deleteDoc(aCollection).then(()=>{
      // console.log('Good');
    }).catch((err)=>{
      console.log(err)
    })
  }

}
