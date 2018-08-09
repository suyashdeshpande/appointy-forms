import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {NgxFormData, NgxSettings} from './interface';
import {ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {FormsService} from './forms.service';

@Component({
  selector: 'ngx-forms',
  templateUrl: './forms.component.html',
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormsComponent),
      multi: true
    }
  ]
})
export class FormsComponent implements OnInit, ControlValueAccessor {

  @Input() set FormData(value: NgxFormData) {
    this._data = value;
    this._data.settings = this._setSettings(value.settings);
    const cg: any = this._service.create(this._data.fields);
    this._form = cg.fbGroup;

    console.log('_form ', this._form);

    this._matches = cg.matches;
    this.comp = {
      data: this._data,
      form: this._form,
      settings: {
        singleErrorMessage: this._data.settings.singleErrorMessage,
        errorOnDirty: this._data.settings.errorOnDirty,
        showValidation: this._data.settings.showValidation,
        extraValidation: this._data.settings.submitButtonExtraValidation || true
      }
    };
  }

  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onChanges: EventEmitter<any> = new EventEmitter();

  comp: any;

  private _data: NgxFormData;
  private _form: FormGroup;
  private _matches: string[];

  constructor(private _service: FormsService) {
  }

  submit() {
    this.onSubmit.emit(this._form.value);
    this.onChangeFn(this._form);
    console.log('after submit _form', this._form);
  }

  onFieldValueChange(event: any) {
    if (this._matches) {
      const key = Object.keys(event)[0];
      // let mat: any;
      const mat: any = this._matches.find((a: any) => a.toMatch === key);

      if (mat) {
        this._form.controls[mat.model].updateValueAndValidity();
      }
    }
    console.log('on field value change matches', this._matches);
    this.onChanges.emit(event);
  }

  sortFields() {
    this._data.fields.sort((a, b) => a.order - b.order);
  }

  private _setSettings(settings: NgxSettings) {
    const defaultSettings: NgxSettings = {
      submitButtonExtraValidation: null,
      showValidation: true,
      errorOnDirty: true,
      singleErrorMessage: true,
      submitButton: true,
      submitButtonText: 'Submit'
    };

    if (settings) {
      for (const i in defaultSettings) {
        if (settings.hasOwnProperty(i)) {
          defaultSettings[i] = settings[i];
        } else {
          defaultSettings[i] = defaultSettings [i];
        }
      }
      return defaultSettings;
    }
  }

  ngOnInit() {
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  // setDisabledState(isDisabled: boolean): void {
  // }

  writeValue(obj: any): void {
    if (obj instanceof FormGroup) {
      this._form = obj;

    }
  }

  onChangeFn = (value: FormGroup) => {};
  onTouchedFn = () => {};

}
