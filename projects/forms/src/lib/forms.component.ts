import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgxFormData, NgxSettings} from './interface';
import {FormGroup} from '@angular/forms';
import {FormsService} from './forms.service';

@Component({
  selector: 'ngx-forms',
  templateUrl: './forms.component.html',
  styles: []
})
export class FormsComponent implements OnInit {

  @Input() set FormData(value: NgxFormData) {
    this._data = value;
    this._data.settings = this._setSettings(value.settings);
    const cg: any = this._service.create(this._data.fields);
    this._form = cg.fbGroup;
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
  }

  onFieldValueChange(event: any) {
    if (this._matches) {
      const key = Object.keys(event)[0];
      // let mat: any;
      const mat: any = this._matches.find(a => a.toMatch === key);

      if (mat) {
        this._form.controls[mat.model].updateValueAndValidity();
      }
    }
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
        defaultSettings[i] = settings.hasOwnProperty(i) ? settings[i] : defaultSettings[i];
      }
      return defaultSettings;
    }
  }

  ngOnInit() {
  }

}
