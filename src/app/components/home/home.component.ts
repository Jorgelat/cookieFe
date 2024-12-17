import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from 'src/app/services/service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  points: number = 0; // Puntos actuales del jugador
  autoClickerBaseCost: number = 50; // Costo base de un autoclicker
  numAutoClickers: number = 0; // Número de autoclickers comprados
  autoClickerCost: number = this.autoClickerBaseCost; // Costo actual del próximo autoclicker

  constructor(private service: Service, private router: Router) {
    this.updateAutoBuy();
   }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '');
    if (!user?.name) {
      alert('No estás logueado.');
      this.router.navigate(['/login']);
    } else {
      this.service.user = user;
      this.points = this.service.user.points;
      this.autoClickerBaseCost = this.service.user.autoClickerBaseCost;
      this.numAutoClickers = this.service.user.numAutoClickers;
      this.autoClickerCost = this.autoClickerBaseCost;
      this.buyAutoMergeClicker();
    }
  }

  clickCookie(): void {
    this.points++;
    this.service.updateModelServiceUserClicks(this.points, this.autoClickerCost, this.numAutoClickers)
  }

  updateAutoBuy(): void{
    this.autoClickerCost = this.autoClickerBaseCost + (this.autoClickerBaseCost * this.numAutoClickers);
  }

  buyAutoClicker(): void {
    if (this.points >= this.autoClickerCost) {
      this.points -= this.autoClickerCost;
      this.numAutoClickers++;
      this.updateAutoBuy();
      this.buyAutoMergeClicker();
    }
  }
  buyAutoMergeClicker(): void {
      var refreshIntervalId  = setInterval(() => {     
        this.points += this.numAutoClickers;
        this.service.updateModelServiceUserClicks(this.points, this.autoClickerCost, this.numAutoClickers)
        if(this.points >= this.autoClickerCost){
          this.points = this.autoClickerCost
          clearInterval(refreshIntervalId);
        }
      }, 100);
  }

  get canBuyAutoClicker(): boolean {
    return this.points >= this.autoClickerCost;
  }

}
