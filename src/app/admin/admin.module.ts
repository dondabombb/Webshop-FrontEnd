import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReUseModule} from "../re-use/re-use.module";
import {AdminPanelComponent} from "./admin-panel/admin-panel.component";






@NgModule({
  declarations: [
    AdminPanelComponent
  ],
  imports: [
    CommonModule,
    ReUseModule,
  ],
  exports: [
    AdminPanelComponent
  ]
})
export class AdminModule { }
