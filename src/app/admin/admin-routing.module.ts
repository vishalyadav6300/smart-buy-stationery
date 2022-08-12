import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProductsComponent } from '../view-products/view-products.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AdminComponent } from './admin.component';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { TranscationComponent } from './transcation/transcation.component';
import { VisualizationComponent } from './visualization/visualization.component';

const routes: Routes = [{ path: '', component: AdminComponent ,children:[
  {path:"add-product",component:AddProductComponent},
  {path:"view-products",component:ViewProductsComponent},
  {path:"transcations",component:TranscationComponent},
  {path:"visualization",component:VisualizationComponent},
  {path:"recommendation",component:RecommendationComponent},
  {path:'',redirectTo:"add-product",pathMatch:"full"}
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
