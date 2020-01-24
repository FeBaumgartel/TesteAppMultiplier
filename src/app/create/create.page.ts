import { Component } from '@angular/core';
import { DbServiceService } from '../db-service.service';
import { Produto } from '../models/produto';
import { ProdutoServiceService } from '../produto-service.service';

@Component({
  selector: 'app-create',
  templateUrl: 'create.page.html',
  styleUrls: ['create.page.scss'],
})
export class CreatePage {

  protected produto: Produto = new Produto();

  constructor(private ProdutoService: ProdutoServiceService) { }

  public async createProduct() {
    await this.ProdutoService.postProdutos(this.produto);
  }
}
