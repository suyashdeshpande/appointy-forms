import {NgModule} from '@angular/core';
import {FormsComponent} from './forms.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FormsService} from './forms.service';
import {FieldsComponent} from './fields.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [FormsComponent, FieldsComponent],
  exports: [FormsComponent],
  providers: [FormsService]
})
export class NgxFormsModule {
}
