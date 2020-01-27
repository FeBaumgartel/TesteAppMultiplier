import { Component } from '@angular/core';
import { Produto } from '../models/produto';
import { ProdutoServiceService } from '../produto-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list',
  templateUrl: 'update.page.html',
  styleUrls: ['update.page.scss']
})
export class UpdatePage {
  protected produto: Produto = new Produto();

  constructor(private ProdutoService: ProdutoServiceService, private router: Router) { }

  public async updateProduct() {
    await this.ProdutoService.putProdutos(this.produto);
    this.produto.nome=null;
    this.produto.preco=null;
    this.produto.peso=null;
    this.router.navigate(['/listaProduto']);
  }
}
