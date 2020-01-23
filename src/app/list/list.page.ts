import { Component, OnInit } from '@angular/core';
import { DbServiceService } from '../db-service.service';


@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  public produtos: Array<{ nome: string; peso: string; preco: string }> = [];
  constructor(private dbService:DbServiceService) {

    for (let i = 0; i < 10; i++) {
      this.produtos.push({
        nome: 'Produto ' + i,
        peso: ''+i,
        preco: ''+i
      });
    }
  }

  ngOnInit() {
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
