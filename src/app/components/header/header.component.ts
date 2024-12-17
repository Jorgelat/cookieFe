import { Component, Input, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { Service } from 'src/app/services/service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
 
  @Input() cookies: number = 0;
  username: string = ''
  constructor(private service: Service){

  }

  ngOnInit(): void {
    this.username = this.service.user?.name || '';
  }
  
  logout(): void {    
   this.service.logOut();
  }
  
}
