import { Injectable } from '@angular/core';
import { DbServiceService } from './db-service.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SincronizacaoServiceService {

  constructor(private dbService: DbServiceService) { }

  public async AddSync() {
    const db = this.dbService.instance;

    db.executeSql(`insert into sincronizacao (sincronizacao) values ('${moment().format('YYYY-MM-DD HH:MM:SS')}')`, [])
      .then(() => { })
      .catch(e => console.log(e));
  }
}
