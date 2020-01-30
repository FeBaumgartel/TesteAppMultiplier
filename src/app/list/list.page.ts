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
  private inicio;
  private fim;
  constructor(private ProdutoService: ProdutoServiceService, private SincronizacaoService: SincronizacaoServiceService, private router: Router, private spinnerDialog: SpinnerDialog) {

  }

  async ionViewWillEnter() {
    this.spinnerDialog.show();
    this.inicio = 0;
    this.fim = 9;
    this.produtos = [];
    this.addProdutos();
  }
  public async Sync() {
    this.spinnerDialog.show();
    // await this.SincronizacaoService.AddSync();
    await this.ProdutoService.syncProducts();
    await this.ProdutoService.syncDeletedProducts();
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
      console.log('Done');
      this.addProdutos();
      event.target.complete();
    }, 500);
  }

  async addProdutos() {
    await this.ProdutoService.getProdutos()
      .then(async(a) => {
        console.log(this.inicio);
        console.log(this.fim);
        var inserir = a.slice(this.inicio, this.fim);
        console.log(inserir);
        for (let i = 0; i < inserir.length; i++) {
          await this.produtos.push(inserir[i]);
        }
      });
    this.inicio += 10;
    this.fim += 10;
    this.spinnerDialog.hide();
  }

  ngOnInit() {
  }
}
