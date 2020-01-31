import { Component } from '@angular/core';
import { Produto } from '../models/produto';
import { ProdutoServiceService } from '../produto-service.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create',
  templateUrl: 'create.page.html',
  styleUrls: ['create.page.scss'],
})
export class CreatePage {

  protected produto: Produto = new Produto();
  constructor(private ProdutoService: ProdutoServiceService, private router: Router, private toastController: ToastController) { }

  public async createProduct() {
    if (await this.validacao())
      return;

    await this.ProdutoService.postProdutos(this.produto);
    this.produto.nome = null;
    this.produto.preco = null;
    this.produto.peso = null;
    this.router.navigate(['/listaProduto']);
  }

  private async validacao() {
    var replace = / /gi
    var nome = await this.produto.nome.replace(replace, "");
    if (nome == null || nome == "" || nome == undefined) {
      let toast = await this.toastController.create({
        message: 'Nome não pode estar vazio ou inválido.',
        duration: 2000
      });
      toast.present();
      return true;
    }
    if (this.produto.preco == null || this.produto.preco == undefined) {
      let toast = await this.toastController.create({
        message: 'Preço não pode estar vazio ou inválido.',
        duration: 2000
      });
      toast.present();
      return true;
    }
    if (this.produto.peso == null || this.produto.peso == undefined) {
      let toast = await this.toastController.create({
        message: 'Peso não pode estar vazio ou inválido.',
        duration: 2000
      });
      toast.present();
      return true;
    }
    if (this.produto.nome.length > 50) {
      let toast = await this.toastController.create({
        message: 'Nome não pode ter mais de 50 caracteres.',
        duration: 2000
      });
      toast.present();
      return true;
    }
  }
}
