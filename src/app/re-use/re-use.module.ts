import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonComponent} from "./button/button.component";
import {RouterLink} from "@angular/router";
import {HeaderComponent} from "./header/header.component";



@NgModule({
  declarations: [
    ButtonComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterLink
  ],
  exports: [
    ButtonComponent,
    HeaderComponent
  ]
})
export class ReUseModule { }
