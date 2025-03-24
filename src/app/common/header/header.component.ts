import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  //get user name as input
  @Input() username:string='';
constructor(){

}
logout(){
  localStorage.removeItem('auth');
}
}
