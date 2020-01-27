import { Injectable } from '@angular/core';
import { DbServiceService } from './db-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProdutoServiceService {

  constructor(private dbService: DbServiceService) { }

  public async getProdutos() {
    const db = this.dbService.instance;
    var list = [];
    await db.executeSql('select * from produtos', [])
      .then(a => {
        for (var i = 0; i < a.rows.length; i++) {
          list.push(a.rows.item(i));
        }
      })
      .catch(e => console.log(e));
    return list;
  }

  public async postProdutos(produto) {
    const db = this.dbService.instance;
    await db.executeSql(`insert into produtos (nome, preco, peso) values ('` + produto.nome + `',` + produto.preco + `,` + produto.peso + `)`, [])
      .then(() =>{console.log('Incluido');})
      .catch(e => console.log(e));
  }

  public async deleteProdutos(produtoId) {
    const db = this.dbService.instance;
    await db.executeSql(`delete from produtos where idLocal=` + produtoId, [])
      .then(() =>{console.log('Deletado');})
      .catch(e => console.log(e));
  }

  public async putProdutos(produto) {
    const db = this.dbService.instance;
    await db.executeSql(`update produtos set nome= '` + produto.nome + `', preco= ` + produto.preco + `, peso= ` + produto.peso + ` where idLocal=` + produto.idLocal, [])
      .then(() =>{console.log('Atualizado');})
      .catch(e => console.log(e));
  }
}
