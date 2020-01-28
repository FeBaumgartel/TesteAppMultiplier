import { Injectable } from '@angular/core';
import { DbServiceService } from './db-service.service';
import { Produto } from './models/produto';
import * as moment from 'moment';
import { HTTP } from '@ionic-native/http/ngx';
import { runInThisContext } from 'vm';


@Injectable({
  providedIn: 'root'
})
export class ProdutoServiceService {
  public produtos: Array<Produto> = [];
  constructor(private dbService: DbServiceService, private http: HTTP) { }

  public async sincCloudProducts() {
    const db = this.dbService.instance;
    var produtos: Array<Produto>;
    this.http.get('http://192.168.18.164:8000/api/produto', {}, {})
      .then(data => {
        produtos = JSON.parse(data.data).data;

        for (let i = 0; i < produtos.length; i++) {
          db.executeSql(`select * from produtos where deleted_at IS NULL AND id = ` + produtos[0].id + ` limit 1`, [])
            .then(a => {
              for (let j = 0; j < a.rows.length; j++) {
                const produto = a.rows.item(j);
                db.executeSql(`update produtos set nome = '` + produtos[0].nome + `', preco = '` + produtos[0].preco + `', peso = '` + produtos[0].peso + `', created_at = '` + produtos[0].created_at + `', updated_at = '` + produtos[0].updated_at + `' where idLocal = '` + produto.idLocal + `'`, [])
                  .then(a => { })
                  .catch(e => console.log(e));
              }
            })
            .catch(e => console.log(e));
        }
      })
      .catch(error => {
        console.log(error.status);
        console.log(error.error);
      });
  }

  public async sincLocalProducts() {
    const db = this.dbService.instance;
    var maxSync;
    this.produtos = new Array<Produto>();
    db.executeSql(`select max(sincronizacao) from sincronizacao`, [])
      .then(a => {
        for (let i = 0; i < a.rows.length; i++) {
          maxSync = a.rows.item(i);
        }
      })
      .catch(e => console.log(e));

    db.executeSql(`select * from produtos where deleted_at IS NULL AND updated_at = '` + maxSync + `'`, [])
      .then(a => {
        for (let i = 0; i < a.rows.length; i++) {
          const produto = a.rows.item(i);
          this.produtos.push({
            idLocal: produto.idLocal,
            id: produto.id,
            nome: produto.nome,
            peso: produto.peso,
            preco: produto.preco,
            created_at: produto.created_at,
            updated_at: produto.updated_at,
            deleted_at: produto.deleted_at
          });
        }
      })
      .catch(e => console.log(e));

    var json = JSON.stringify(this.produtos);
    this.http.post('http://192.168.18.164:8000/api/produto', { json }, {})
      .then(data => {
        var produtos = JSON.parse(data.data).data;
        for (let i = 0; i < produtos.length; i++) {
          db.executeSql(`update produtos set id=` + produtos[i].id + `, updated_at = '` + produtos[i].updated_at + `', created_at = '` + produtos[i].created_at + `' where idLocal = ` + produtos[i].idLocal, [])
            .then(() => { })
            .catch(e => console.log(e));
        }
      })
      .catch(e => console.log(e));
  }

  public async sincDeletedProducts(){
    const db = this.dbService.instance;
    this.http.post('http://192.168.18.164:8000/api/produto/deleted', { }, {})
    .then(data=>{
      var produtos = JSON.parse(data.data).data;
      for(let i=0;i<produtos.length;i++){
        db.executeSql(`delete from produtos where id = ` + produtos[i].id, [])
            .then(() => { })
            .catch(e => console.log(e));
      }
    })
    .catch(e => console.log(e));
  }

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
            preco: produto.preco,
            created_at: produto.created_at,
            updated_at: produto.updated_at,
            deleted_at: produto.deleted_at
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
            preco: produto.preco,
            created_at: produto.created_at,
            updated_at: produto.updated_at,
            deleted_at: produto.deleted_at
          });
        }
      })
      .catch(e => console.log(e));
    return produto;
  }

  public async postProdutos(produto: Produto) {
    const db = this.dbService.instance;
    await db.executeSql(`insert into produtos (nome, preco, peso, created_at, updated_at) values ('` + produto.nome + `',` + produto.preco + `,` + produto.peso + `, '` +
      moment().format('YYYY-MM-DD HH:MM:SS') + `', '` + moment().format('YYYY-MM-DD HH:MM:SS') + `')`, [])
      .then(() => { console.log('Incluido'); })
      .catch(e => console.log(e));
  }
  public async deleteProdutos(produtoId) {
    const db = this.dbService.instance;
    await db.executeSql(`update produtos set deleted_at = '` + moment().format('YYYY-MM-DD HH:MM:SS') + `' where idLocal = ` + produtoId, [])
      .then(() => {
        console.log('Deletado');
      })
      .catch(e => console.log(e));
  }

  public async putProdutos(produto: Produto) {
    const db = this.dbService.instance;
    var list = [];
    await db.executeSql(`update produtos set nome = '` + produto.nome + `', preco = '` + produto.preco + `', peso = '` + produto.peso + `', updated_at = '` + moment().format('YYYY-MM-DD HH:MM:SS') + `' where idLocal = '` + produto.idLocal + `'`, [])
      .then(a => {
        for (var i = 0; i < a.rows.length; i++) {
          list.push(a.rows.item(i));
        }
      })
      .catch(e => console.log(e));
    return list;
  }
}
