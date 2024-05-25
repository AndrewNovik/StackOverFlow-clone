import { Component} from '@angular/core';
import { SignInOutService } from '../sign-in-out.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  header_logo:string = 'Stackoverflow clone';

  constructor(public signInOut: SignInOutService) { }

}
