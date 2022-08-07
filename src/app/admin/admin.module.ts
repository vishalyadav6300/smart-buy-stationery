import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AddProductComponent } from './add-product/add-product.component';
import { SharedModule } from '../shared.module';
import { TranscationComponent } from './transcation/transcation.component';
import { SummaryComponent } from './summary/summary.component';


@NgModule({
  declarations: [
    AdminComponent,
    AddProductComponent,
    TranscationComponent,
    SummaryComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
