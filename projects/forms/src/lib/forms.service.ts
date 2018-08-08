import {Injectable} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {NgxFields, NgxValidation} from './interface';
import {ignoreElements} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  create(fields: NgxFields[]) {
    const temp = {},
      toReturn = {},
      matches = [];

    fields.forEach((field: NgxFields) => {
      const val = field.value || '';
      let validators = null;

      if (field.validation) {
        if (Array.isArray(field.validation)) {
          validators = [];
          field.validation.forEach((v) => validators = [...validators, setValidators(v, field)]);
        } else {
          validators = setValidators(field.validation);
        }
      }
      temp[field.key] = new FormControl(val, validators);
    });
    toReturn['fbGroup'] = new FormGroup(temp);

    if (matches.length) {
      toReturn['matches'] = matches;
    }

    return toReturn;

    function setValidators(item: NgxValidation, original?: any) {
      switch (item.type) {
        case 'required':
          return Validators.required;
        case 'minLength':
          return Validators.minLength(<number>item.value);
        case 'maxLength':
          return Validators.maxLength(<number>item.value);
        case 'pattern':
          return Validators.pattern(<string>item.value);
        case 'custom':
          return item.value;
        // case 'match': matches = [...matches, {toMatch: item.value, model: original.key}];
      }
    }
  }

  constructor() {
  }
}
