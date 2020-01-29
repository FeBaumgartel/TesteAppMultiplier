import { Component, OnInit } from '@angular/core';
import { ProdutoServiceService } from '../produto-service.service';
import { Router } from '@angular/router';
import { Produto } from '../models/produto';
import { SincronizacaoServiceService } from '../sincronizacao-service.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  public produtos: Array<Produto> = [];
  constructor(private ProdutoService: ProdutoServiceService, private SincronizacaoService: SincronizacaoServiceService, private router: Router, private spinnerDialog: SpinnerDialog) { }

  async ionViewWillEnter() {
    this.spinnerDialog.show();
    this.produtos = [];
    this.ProdutoService.getProdutos()
      .then(a => {
        console.log(a);
        this.produtos = a;
        this.spinnerDialog.hide();
      });
  }
  public async Sync() {

    // await this.SincronizacaoService.AddSync();
    await this.ProdutoService.syncCloudDeletedProducts();
    await this.ProdutoService.syncProducts();
    this.ionViewWillEnter();
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
