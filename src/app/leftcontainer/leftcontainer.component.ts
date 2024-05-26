import { Component } from '@angular/core';
import { SignInOutService } from '../sign-in-out.service';

@Component({
  selector: 'app-leftcontainer',
  templateUrl: './leftcontainer.component.html',
  styleUrl: './leftcontainer.component.css'
})
export class LeftcontainerComponent {

  constructor(public signInOut: SignInOutService){

  }

}
