import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MpgComponent } from './mpg/mpg.component';

@NgModule({
  declarations: [MpgComponent],
  imports: [
    CommonModule
  ],
  exports: [
    MpgComponent
  ]
})
export class MpgModule { }
