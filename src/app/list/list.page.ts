import { Component, OnInit } from '@angular/core';
import { ProdutoServiceService } from '../produto-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  public produtos: Array<{ idLocal:string; id: string; nome: string; peso: string; preco: string }> = [];
  constructor(private ProdutoService: ProdutoServiceService, private router: Router) {}

  async ionViewWillEnter() {

    var list = [];
    await this.ProdutoService.getProdutos()
      .then(a => {
        list.push(a);
      });
    for (let i = 0; i < list[0].length; i++) {
      this.produtos.push({
        idLocal: list[0][i].idLocal,
        id: list[0][i].id,
        nome: list[0][i].nome,
        peso: list[0][i].peso,
        preco: list[0][i].preco
      });
    }
  }

  public async DeleteProduct(produtoId) {
    await this.ProdutoService.deleteProdutos(produtoId);
    this.router.navigate(['/listaProduto']);
  }

  ngOnInit() {
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
