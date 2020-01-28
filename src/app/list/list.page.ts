import { Component, OnInit } from '@angular/core';
import { ProdutoServiceService } from '../produto-service.service';
import { Router } from '@angular/router';
import { Produto } from '../models/produto';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  public produtos: Array<Produto> = [];
  constructor(private ProdutoService: ProdutoServiceService, private router: Router) { }

  async ionViewWillEnter() {
    this.ProdutoService.sincCloudProducts();
    await this.ProdutoService.getProdutos()
      .then(a => {
        this.produtos = a;
      });
  }

  public async DeleteProduct(produtoId) {
    await this.ProdutoService.deleteProdutos(produtoId);
    this.ionViewWillEnter();
  }

  public async UpdateProduct(id) {
    this.router.navigate(['/atualizaProduto/' + id]);
  }

  public async createProduct() {
    this.router.navigate(['/criaProduto']);
  }

  

  ngOnInit() {
  }
}
