import { Component, OnInit } from '@angular/core';
import { Produto } from '../models/produto';
import { ProdutoServiceService } from '../produto-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-list',
  templateUrl: 'update.page.html',
  styleUrls: ['update.page.scss']
})
export class UpdatePage implements OnInit {
  protected produto: Produto = new Produto();
  id: string;
  constructor(private ProdutoService: ProdutoServiceService, private router: Router, private route: ActivatedRoute, private toastController: ToastController) { }

  public async updateProduct() {
    if (await this.validacao())
      return;

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
        this.produto = a;
      });
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

  ngOnInit() {
  }
}
