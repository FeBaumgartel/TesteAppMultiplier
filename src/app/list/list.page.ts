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
  private pagina;
  constructor(private ProdutoService: ProdutoServiceService, private SincronizacaoService: SincronizacaoServiceService, private router: Router, private spinnerDialog: SpinnerDialog) {

  }

  async ionViewWillEnter() {
    this.pagina = 1;
    this.spinnerDialog.show();
    this.produtos = [];
    this.addProdutos();
  }
  public async Sync() {
    this.pagina = 1;
    this.spinnerDialog.show();
    // await this.SincronizacaoService.AddSync();
    await this.ProdutoService.syncDeletedProducts();
    await this.ProdutoService.syncProducts();
    this.spinnerDialog.hide();
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

  loadData(event) {
    setTimeout(() => {
      this.addProdutos();
      event.target.complete();
    }, 500);
  }

  async addProdutos() {
    await this.ProdutoService.getProdutos(this.pagina)
      .then(async (a) => {
        console.log(this.produtos);
        for (let i = 0; i < a.length; i++) {
          await this.produtos.push(a[i]);
        }
      });
    this.pagina++;

    this.spinnerDialog.hide();
  }

  ngOnInit() {
  }
}
