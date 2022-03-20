import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { RegisterComponent } from './register/register.component';
import { UsercartComponent } from './usercart/usercart.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { ViewProductsComponent } from './view-products/view-products.component';

const routes: Routes = [
  {path:"home",component:HomeComponent},
  {path:"register",component:RegisterComponent},
  {path:"login",component:LoginComponent},
  {path:"userprofile/:username",component:UserprofileComponent,children:[
    {path:"view-products",component:ViewProductsComponent},
    {path:"view-cart",component:UsercartComponent},
    {path:'',redirectTo:'view-products',pathMatch:'full'}
  ]},   
  { path: 'admin/:username', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  {path:'',redirectTo:'/home',pathMatch:'full'},
  {path:'**',component:PagenotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
