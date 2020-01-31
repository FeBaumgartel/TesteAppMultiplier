import { Component, OnInit } from '@angular/core';
import { Produto } from '../models/produto';
import { ProdutoServiceService } from '../produto-service.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-list',
  templateUrl: 'update.page.html',
  styleUrls: ['update.page.scss']
})
export class UpdatePage implements OnInit {
  protected produto: Produto = new Produto();
  id: string;
  constructor(private ProdutoService: ProdutoServiceService, private router: Router, private route: ActivatedRoute) { }

  public async updateProduct() {
    await this.ProdutoService.putProdutos(this.produto);
    this.produto.nome = null;
    this.produto.preco = null;
    this.produto.peso = null;
    this.router.navigate(['/listaProduto']);
  }

  async ionViewWillEnter() {
    this.id = this.route.snapshot.paramMap.get('id');
    await this.ProdutoService.getProdutoById(this.id)
      .then(a => {
        this.produto=a;
      });
  }
  
  ngOnInit() {
  }
}
