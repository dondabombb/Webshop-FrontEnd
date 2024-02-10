import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReUseModule} from "../re-use/re-use.module";
import {AdminPanelComponent} from "./admin-panel/admin-panel.component";
import {EditItemComponent} from "./edit-item/edit-item.component";
import {CreateItemComponent} from "./create-item/create-item.component";






@NgModule({
  declarations: [
    AdminPanelComponent,
    EditItemComponent,
    CreateItemComponent
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
