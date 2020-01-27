import { Component } from '@angular/core';
import { Produto } from '../models/produto';
import { ProdutoServiceService } from '../produto-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: 'create.page.html',
  styleUrls: ['create.page.scss'],
})
export class CreatePage {

  protected produto: Produto = new Produto();

  constructor(private ProdutoService: ProdutoServiceService, private router: Router) { }

  public async createProduct() {
    await this.ProdutoService.postProdutos(this.produto);
    this.produto.nome = null;
    this.produto.preco = null;
    this.produto.peso = null;
    this.router.navigate(['/listaProduto']);
  }
}
