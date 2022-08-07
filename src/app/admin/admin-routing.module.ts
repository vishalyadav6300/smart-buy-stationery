import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProductsComponent } from '../view-products/view-products.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AdminComponent } from './admin.component';
import { SummaryComponent } from './summary/summary.component';
import { TranscationComponent } from './transcation/transcation.component';

const routes: Routes = [{ path: '', component: AdminComponent ,children:[
  {path:"add-product",component:AddProductComponent},
  {path:"view-products",component:ViewProductsComponent},
  {path:"transcations",component:TranscationComponent},
  {path:"summary",component:SummaryComponent},
  {path:'',redirectTo:"add-product",pathMatch:"full"}
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
