import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  private instance;
  constructor(private sqlite: SQLite) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {

        db.executeSql('CREATE TABLE IF NOT EXISTS  produtos (idLocal bigint(20) unsigned NOT NULL AUTO_INCREMENT, id bigint(20)unsigned NOT NULL, nome varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, preco double NOT NULL, peso double NOT NULL, created_at timestamp NULL DEFAULT NULL, updated_at timestamp NULL DEFAULT NULL, deleted_at timestamp NULL DEFAULT NULL, PRIMARY KEY(id))', [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));

        db.executeSql('CREATE TABLE IF NOT EXISTS pedidos (idLocal bigint(20) unsigned NOT NULL AUTO_INCREMENT, id bigint(20)unsigned NOT NULL, status varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,cliente varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,valorTotal double NOT NULL,pesoTotal double NOT NULL,quantidadeTotal double NOT NULL,created_at timestamp NULL DEFAULT NULL,updated_at timestamp NULL DEFAULT NULL,deleted_at timestamp NULL DEFAULT NULL,PRIMARY KEY (`id`))', [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));

        db.executeSql('CREATE TABLE IF NOT EXISTS pedido_produtos (idLocal bigint(20) unsigned NOT NULL AUTO_INCREMENT, produto_id bigint(20) unsigned NOT NULL,pedido_id bigint(20) unsigned NOT NULL,quantidade int(11) NOT NULL,created_at timestamp NULL DEFAULT NULL,updated_at timestamp NULL DEFAULT NULL,deleted_at timestamp NULL DEFAULT NULL,PRIMARY KEY (produto_id,pedido_id),KEY pedido_produtos_pedido_id_foreign (pedido_id),CONSTRAINT pedido_produtos_pedido_id_foreign FOREIGN KEY (`pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,CONSTRAINT pedido_produtos_produto_id_foreign FOREIGN KEY (produto_id) REFERENCES produtos (id) ON DELETE CASCADE)', [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));

        this.instance = db;
      })
      .catch(e => console.log(e));
  }
}
