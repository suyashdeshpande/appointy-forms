import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {NgxFields, NgxSettings, NgxValidation} from './interface';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'ngx-fields',
  templateUrl: 'fields.component.html'
})

export class FieldsComponent {

  @HostBinding('class') get toSet() {
    return this.field && this.field.classes && this.field.classes.wrapper ? this.field.classes.wrapper : '';
  }

  @Input() set info(value: any) {
    console.log('value @input', value);

    this.field = value.fields;
    this.form = value.form;
    this.settings = value.settings;

    if (this.field.type === 'checkbox') {
      this.field.value = !this.field.value ? [] : this.field.value;
      // this.checkBoxIsRequired = this.field.validation && this.field.validation.find(a => a.type === 'required');
    }
  }

  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  field: NgxFields;
  form: FormGroup;

  checkBoxIsRequired = false;
  settings: NgxSettings;

  get showErrorMessages() {
    return this.settings.errorOnDirty ?
      !this.form.controls[this.field.key].valid && this.form.controls[this.field.key].dirty :
      !this.form.controls[this.field.key].valid;
  }

  errors() {
    if (this.field.validation && this.form.controls[this.field.key].valid) {
      let temp: any = [];
      const errors = this.form.controls[this.field.key].errors,
        errorKeys = Object.keys(errors);

      if (this.settings.singleErrorMessage) {
        temp = [...temp, this._setError(errorKeys[errorKeys.length - 1], errors)];
      } else {
        errorKeys.forEach(e => temp = [...temp, this._setError(e, errors)]);
      }
      return temp;
    }
  }

  setRadio(option: any) {
    this.form.controls[this.field.key].setValue(option.value);
    this.onValueChange(option.value);
  }

  setCheckbox(option: any) {
    let index: any;
    if (typeof this.field.value !== 'number' && typeof this.field.value !== 'string') {
      index = this.field.value.indexOf(option.value);

      if (index !== -1) {
        this.field.value.splice(index, 1);
      } else {
        this.field.value = [...this.field.value, option.value];
      }
    }

    this.form.controls[this.field.key].setValue(this.field.value);
    this.onValueChange(this.field.value);
  }

  onValueChange(event: any) {
    if (this.field.emitChanges !== false) {
      this.valueChange.emit({[this.field.key]: event});
    }
  }

  isSelectActive(option: any) {
    if (typeof this.field.value !== 'number' && typeof this.field.value !== 'string') {
      return !!this.field.value.find(a => a === option.value);
    }
  }

  checkboxValueChange() {
    if (typeof this.field.value !== 'number' && typeof this.field.value !== 'string') {
      if (this.checkBoxIsRequired) {
        if (this.field.value.length === 1) {
          this.field.options.find(a => a.value === this.field.value[0]).disabled = true;
        } else {
          this.field.options.forEach(option => option.disabled = false);
        }
      }
    }
  }

  private _setError(item: any, errors: any) {
    let errorMessage: string;
    errorMessage = this.field.validation.find(a => a.type.toLowerCase() === item).message;
    const tag: string = this.field.label || this.field.key;

    if (!errorMessage) {
      switch (item) {
        case 'required':
          errorMessage = `${tag} is required.`;
          break;

        case 'minlength':
          errorMessage = `${tag} has to be at least ${errors[item].requiredLength} characters long.`;
          break;

        case 'maxlength':
          errorMessage = `${tag} can't be longer then ${errors[item].requiredLength} characters.`;
          break;

        case 'pattern':
          errorMessage = `${tag} must match this pattern: ${errors[item].requiredPattern}.`;
          break;

        case 'match':
          errorMessage = `${tag} must match the ${errors[item].mustMatchField} field.`;
          break;
      }
    }
    return errorMessage;
  }

  constructor() {
  }

}
