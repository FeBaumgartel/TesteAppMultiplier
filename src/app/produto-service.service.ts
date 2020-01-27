import { Injectable } from '@angular/core';
import { DbServiceService } from './db-service.service';
import { Produto } from './models/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoServiceService {
  public produtos: Array<Produto> = [];
  constructor(private dbService: DbServiceService) { }

  public async getProdutos() {
    const db = this.dbService.instance;
    this.produtos = new Array<Produto>();
    await db.executeSql('select * from produtos where deleted_at IS NULL', [])
      .then(a => {
        for (let i = 0; i < a.rows.length; i++) {
          const produto = a.rows.item(i);
          this.produtos.push({
            idLocal: produto.idLocal,
            id: produto.id,
            nome: produto.nome,
            peso: produto.peso,
            preco: produto.preco
          });
        }
      })
      .catch(e => console.log(e));
    return this.produtos;
  }

  public async getProdutoById(id) {
    const db = this.dbService.instance;
    this.produtos = new Array<Produto>();
    var produto = new Produto();
    await db.executeSql('select * from produtos where idLocal = ' + id + ' limit 1', [])
      .then(a => {
        for (let i = 0; i < a.rows.length; i++) {
          produto = a.rows.item(i);
          this.produtos.push({
            idLocal: produto.idLocal,
            id: produto.id,
            nome: produto.nome,
            peso: produto.peso,
            preco: produto.preco
          });
        }
      })
      .catch(e => console.log(e));
    return produto;
  }

  public async postProdutos(produto: Produto) {
    const db = this.dbService.instance;
    await db.executeSql(`insert into produtos (nome, preco, peso, created_at) values ('` + produto.nome + `',` + produto.preco + `,` + produto.peso + `, '` + new Date().toLocaleDateString() + `')`, [])
      .then(() => { console.log('Incluido'); })
      .catch(e => console.log(e));
  }

  public async deleteProdutos(produtoId) {
    const db = this.dbService.instance;
    await db.executeSql(`update produtos set deleted_at = '` + new Date().toLocaleDateString() + `' where idLocal = ` + produtoId, [])
      .then(() => {
        console.log('Deletado');
      })
      .catch(e => console.log(e));
  }

  public async putProdutos(produto: Produto) {
    const db = this.dbService.instance;
    var list = [];
    await db.executeSql(`update produtos set nome = '` + produto.nome + `', preco = '` + produto.preco + `', peso = '` + produto.peso + `', updated_at = '` + new Date().toLocaleDateString() + `' where idLocal = '` + produto.idLocal + `'`, [])
      .then(a => {
        for (var i = 0; i < a.rows.length; i++) {
          list.push(a.rows.item(i));
        }
      })
      .catch(e => console.log(e));
    return list;
  }
}
