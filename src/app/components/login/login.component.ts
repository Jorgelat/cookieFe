import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Service, UValue } from 'src/app/services/service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class LoginComponent {
  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required])    
  });

  constructor(private router: Router, private service: Service) {}

  async login() {
    if (this.form.controls['name'].value) {
      const Ok = await this.findUser(this.form.controls['name'].value);
      if(Ok){        
        this.router.navigate(['/home']);
      }
    } else {
      alert('Por favor ingresa tu nombre de usuario y contraseña.');
    }
  }  

  async findUser(userName: string): Promise<boolean>{
    return new Promise<boolean>((resolve) => {
      this.service.getUser(userName).subscribe({
        next: (ret: UValue) => {
          if (ret && ret.name) {
            this.service.user = ret;
            localStorage.setItem('user', JSON.stringify(ret));
            resolve(true);
          } else {
            this.service.resetUser();
            this.service.addUser(userName).subscribe((saved: boolean)=> {
              if(saved){ 
                this.service.user.name = userName;
                this.service.user.autoClickerBaseCost = 50;
                this.service.user.numAutoClickers = 0;
                this.service.user.points = 0;
                localStorage.setItem('user', JSON.stringify(this.service.user));
                resolve(true);
              }
            });  
          }   
        },
        error: (error) => {
          alert('Error de usuario')
          resolve(false);
        },
      });
    });    
  }

  async addUser(userName: string): Promise<boolean>{
    return new Promise<boolean>(() => {
      return this.service.addUser(userName).subscribe();
    }); 
  }


}
