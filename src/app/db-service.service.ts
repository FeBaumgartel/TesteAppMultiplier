import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  public instance: SQLiteObject;
  constructor(private sqlite: SQLite) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {

        db.executeSql(`CREATE TABLE IF NOT EXISTS produtos (
          idLocal integer primary key AUTOINCREMENT,
          id bigint unsigned,
          nome varchar(255) NOT NULL,
          preco double NOT NULL,
          peso double NOT NULL,
          created_at timestamp NULL DEFAULT NULL,
          updated_at timestamp NULL DEFAULT NULL,
          deleted_at timestamp NULL DEFAULT NULL,
          synced_at timestamp NULL DEFAULT NULL)`, [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));

        db.executeSql(`CREATE TABLE IF NOT EXISTS pedidos (
          idLocal integer primary key AUTOINCREMENT,
          id bigint unsigned,
          status varchar(255) NOT NULL,
          cliente varchar(255) NOT NULL,
          valorTotal double NOT NULL,
          pesoTotal double NOT NULL,
          quantidadeTotal double NOT NULL,
          created_at timestamp NULL DEFAULT NULL,
          updated_at timestamp NULL DEFAULT NULL,
          deleted_at timestamp NULL DEFAULT NULL,
          synced_at timestamp NULL DEFAULT NULL)`, [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));

        db.executeSql(`CREATE TABLE IF NOT EXISTS pedido_produtos (
          idLocal integer primary key AUTOINCREMENT,
          produto_id bigint unsigned NOT NULL,
          pedido_id bigint unsigned NOT NULL,
          quantidade int(11) NOT NULL,
          created_at timestamp NULL DEFAULT NULL,
          updated_at timestamp NULL DEFAULT NULL,
          deleted_at timestamp NULL DEFAULT NULL,
          synced_at timestamp NULL DEFAULT NULL,
          FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,
          FOREIGN KEY (produto_id) REFERENCES produtos (id) ON DELETE CASCADE)`, [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));

        db.executeSql(`CREATE TABLE IF NOT EXISTS sincronizacao (
          idLocal integer primary key AUTOINCREMENT,
          id integer,
          sincronizacao timestamp DEFAULT NULL)`, [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));

        // db.executeSql(`insert into produtos (nome, preco, peso) values ('arroz',1.1,1.1)`, [])
        // .then(() => console.log('Executed SQL'))
        // .catch(e => console.log(e));

        this.instance = db;
      })
      .catch(e => console.log(e));
  }
}
