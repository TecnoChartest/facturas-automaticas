import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-validar-data',
  standalone: true,
  imports: [],
  templateUrl: './validar-data.component.html',
  styleUrl: './validar-data.component.css',
})
export class ValidarDataComponent implements OnInit{
  @Input() jsonData: any;
  ngOnInit(): void {
    console.log('jsonData: ', this.jsonData)
    console.log('jsonData ID: ', this.jsonData.output.id)
    console.log('jsonData[0]: ', this.jsonData[0])
    // console.log(this.jsonData[0].output.id)
  }
}
