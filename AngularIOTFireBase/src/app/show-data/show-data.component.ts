import { Component, OnInit } from '@angular/core';
import {DbService} from '../service/db.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-show-data',
  templateUrl: './show-data.component.html',
  styleUrls: ['./show-data.component.scss']
})
export class ShowDataComponent implements OnInit {

  data: any;
  currentTutorial = null;
  currentIndex = -1;
  Humidity: string;
  Temperature: string;
  message: string;


  constructor(private dbService: DbService) { }

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  refreshList(): void {
    this.currentTutorial = null;
    this.currentIndex = -1;
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    this.dbService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, value: c.payload.val() })
        )
      )
    ).subscribe(data => {

      this.data = data;
      if (this.data && this.data[0] && this.data[0].value ){
        this.Temperature = this.data[0].value.Temperature;
        this.Humidity = this.data[0].value.Humidity;
      }
    });
  }

  setActiveTutorial(tutorial, index): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }

  removeAllTutorials(): void {

    this.dbService.deleteAll()
      .then(() => this.refreshList())
      .catch(err => console.log(err));
  }
  isChecked(key, value): boolean{
    if (key.indexOf('LED') > -1){
      return value === 'on';
    } else {
      return false;
    }
  }
  isSwitch(key): boolean{
    return key.indexOf('LED') > -1;
  }
  changeValue(ledKey, value): void{
    const UpdatedValue = this.toggleValue(value);
    let obj = {};
    obj[ledKey] = UpdatedValue;
    this.updateTutorial(obj);
  }
  toggleValue(value): string{
    return (value === 'on' ) ? 'off' : 'on' ;
  }
  updateTutorial(obj): void {


    this.dbService.update('/', obj)
      .then(() => this.message = 'The tutorial was updated successfully!')
      .catch(err => console.log(err));
  }

}
