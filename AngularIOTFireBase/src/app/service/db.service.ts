import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

export default class iotData {
  published = false;
}
@Injectable({
  providedIn: 'root'
})
export class DbService {
  private dbPath = '/';

  dbDataRef: AngularFireList<iotData> = null;

  constructor(private db: AngularFireDatabase) {
    this.dbDataRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<iotData> {
    return this.dbDataRef;
  }

  create(iotData: iotData): any {
    return this.dbDataRef.push(iotData);
  }

  update(key: string, value: any): Promise<void> {
  // let data = {};
  // data[key] = value;
  //   return this.db.object('/' + key + '/')
  //     .update(data);
    return this.dbDataRef.update(key, value);
  }
  updateBy(key: string, value: any) {
    let data = {};
    data[key] = value;
    return this.db.object('/' + key + '/')
  }
  delete(key: string): Promise<void> {
    return this.dbDataRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.dbDataRef.remove();
  }
}
