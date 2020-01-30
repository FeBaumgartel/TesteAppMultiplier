import { Injectable } from '@angular/core';
import { DbServiceService } from './db-service.service';
import { Produto } from './models/produto';
import * as moment from 'moment';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class ProdutoServiceService {
  public listIdsDeletados = [];
  public produtos: Array<Produto> = [];
  public produtosSync = [];
  constructor(private dbService: DbServiceService, private http: HTTP) { }

  public async syncProducts() {
    const db = this.dbService.instance;
    var produtos = new Array<Produto>();

    await db.executeSql(`select * from produtos where deleted_at IS NULL `, [])
      .then(async (a) => {
        for (let i = 0; i < a.rows.length; i++) {
          this.produtosSync = [];
          const produto = a.rows.item(i);
          this.produtosSync.push({
            id: produto.id,
            nome: produto.nome,
            peso: produto.peso,
            preco: produto.preco
          });
          await this.http.post('http://192.168.18.164:8000/api/produto', { produtos: this.produtosSync }, {})
            .then(async (a) => {
              if (produto.id == null) {
                let id = JSON.parse(a.data)[0].id;

                await db.executeSql(`update produtos set id = ${id} where idLocal = '${produto.idLocal}'`, [])
                  .then(a => { })
                  .catch(e => console.log(e));
              }
            })
            .catch(e => { console.log(e) });
        }
      })
      .catch(e => console.log(e));

    await this.http.get('http://192.168.18.164:8000/api/produto', {}, {})
      .then(async (data) => {
        produtos = JSON.parse(data.data).data;
        for (let i = 0; i < produtos.length; i++) {

          await db.executeSql(`select * from produtos where deleted_at IS NULL AND id = ${produtos[i].id}`, [])
            .then(async (a) => {
              if (a.rows.length != 0) {
                for (let j = 0; j < a.rows.length; j++) {
                  var produto = a.rows.item(j);

                  await db.executeSql(`update produtos set nome = '${produtos[i].nome}', preco = '${produtos[i].preco}', peso = '${produtos[i].peso}', created_at = '${produtos[i].created_at}', updated_at = '${produtos[i].updated_at}' where idLocal = '${produto.idLocal}'`, [])
                    .then(a => { })
                    .catch(e => console.log(e));
                }
              } else {
                await db.executeSql(`insert into produtos (id, nome, preco, peso, created_at, updated_at) values (${produtos[i].id}, '${produtos[i].nome}', '${produtos[i].preco}', '${produtos[i].peso}', '${produtos[i].created_at}', '${produtos[i].updated_at}')`, [])
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

  public async syncDeletedProducts() {
    const db = this.dbService.instance;

    await db.executeSql(`select * from produtos where deleted_at IS NOT NULL`, [])
      .then(async a => {
        const produtos = [];
        for (let j = 0; j < a.rows.length; j++) {
          produtos.push(a.rows.item(j));
        }
        if (produtos.length > 0) {
          await this.http.post('http://192.168.18.164:8000/api/produto/delete', { produtos: produtos }, {})
            .then(async (a) => {
              produtos.forEach(async(element) => {
                await db.executeSql(`delete from produtos where idLocal = '${element.idLocal}'`, [])
                .then(async a => {
                })
                .catch(e => console.log(e));
              });
            })
            .catch(e => console.log(e));
        }
      })
      .catch(e => console.log(e));

    await this.http.get('http://192.168.18.164:8000/api/produto/deleted', {}, {})
      .then(async (data) => {
        var produtos = JSON.parse(data.data).data;
        for (let i = 0; i < produtos.length; i++) {
          await db.executeSql(`delete from produtos where id = ${produtos[i].id}`, [])
            .then(() => { })
            .catch(e => console.log(e));
        }
      })
      .catch(e => console.log(e));
  }

  public async getProdutos() {
    const db = this.dbService.instance;
    this.produtos = new Array<Produto>();
    await db.executeSql(`select * from produtos where deleted_at IS NULL`, [])
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
    await db.executeSql(`select * from produtos where idLocal = ${id} limit 1`, [])
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
    await db.executeSql(`insert into produtos (nome, preco, peso, created_at, updated_at) values ('${produto.nome}',${produto.preco},${produto.peso}, '${moment().format('YYYY-MM-DD HH:MM:SS')}', '${moment().format('YYYY-MM-DD HH:MM:SS')}')`, [])
      .then(() => { console.log('Incluido'); })
      .catch(e => console.log(e));
  }

  public async deleteProdutos(produtoId) {
    const db = this.dbService.instance;
    await db.executeSql(`select * from produtos where idLocal = ${produtoId}`, [])
      .then(a => {
        var produto = new Produto();
        for (let i = 0; i < a.rows.length; i++) {
          produto = a.rows.item(i);
          if (produto.id == null) {
            db.executeSql(`delete from produtos where idLocal = ${produtoId}`, [])
              .then(() => {
                console.log('Deletado');
              })
              .catch(e => console.log(e));
          } else {
            db.executeSql(`update produtos set deleted_at = '${moment().format('YYYY-MM-DD HH:MM:SS')}' where idLocal = ${produtoId}`, [])
              .then(() => {
                console.log('Deletado');
              })
              .catch(e => console.log(e));
          }
        }
      })
      .catch(e => console.log(e));
  }

  public async putProdutos(produto: Produto) {
    const db = this.dbService.instance;
    var list = [];
    await db.executeSql(`update produtos set nome = '${produto.nome}', preco = '${produto.preco}', peso = '${produto.peso}', updated_at = '${moment().format('YYYY-MM-DD HH:MM:SS')}' where idLocal = '${produto.idLocal}'`, [])
      .then(a => {
        for (var i = 0; i < a.rows.length; i++) {
          list.push(a.rows.item(i));
        }
      })
      .catch(e => console.log(e));
    return list;
  }
}
