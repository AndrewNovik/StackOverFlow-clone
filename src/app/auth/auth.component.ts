import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Auth, GoogleAuthProvider, getAuth, signInWithPopup, signOut, user } from '@angular/fire/auth';



@Component({
  selector: 'app-auth',
  templateUrl: 'auth.component.html',
  styleUrls: ['auth.component.css']
})
export class AuthComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  data!: Observable<any[]>;

  
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);


  constructor() {
    this.getData();
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {console.log(user)});
  }

  googleSignIn() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result)!;
        const token = credential.accessToken;
        const user = result.user;
        const f = {name:user.displayName}
        this.addData(f);
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
  }

  addData(f:any){
    const aCollection = collection(this.firestore, 'items')
    addDoc(aCollection, f).then(()=>{
    }).catch((err)=>{
      console.log(err)
    })
  }

  getData(){
    const aCollection = collection(this.firestore, 'items')
    this.data = collectionData(aCollection, { idField: 'id' })
    console.log(this.data)
  }

  updateData(id:string){
    const aCollection = doc(this.firestore, 'items', id)
    const updataData = {
      name: 'updated'
    }

    updateDoc(aCollection, updataData).then(()=>{
      console.log('Good');
    }).catch((err)=>{
      console.log(err)
    })
  }

  deleteData(id:string){
    const aCollection = doc(this.firestore, 'items', id)
    deleteDoc(aCollection).then(()=>{
      console.log('Good');
    }).catch((err)=>{
      console.log(err)
    })
  }
}
