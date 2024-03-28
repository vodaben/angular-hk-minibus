import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-eta',
  templateUrl: './eta.page.html',
  styleUrls: ['./eta.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EtaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
