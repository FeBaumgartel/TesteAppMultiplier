import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  public produtos: Array<{ nome: string; peso: string; preco: string }> = [];
  constructor() {
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
