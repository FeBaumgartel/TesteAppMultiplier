import { Component, OnInit } from '@angular/core';
import { DbServiceService } from '../db-service.service';
import { ProdutoServiceService } from '../produto-service.service';


@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  public produtos: Array<{ nome: string; peso: string; preco: string }> = [];
  constructor(private ProdutoService: ProdutoServiceService) {}

  async ionViewWillEnter() {

    var list = [];
    await this.ProdutoService.getProdutos()
      .then(a => {
        list.push(a);
      });
    for (let i = 0; i < list[0].length; i++) {
      this.produtos.push({
        nome: list[0][i].nome,
        peso: list[0][i].peso,
        preco: list[0][i].preco
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
