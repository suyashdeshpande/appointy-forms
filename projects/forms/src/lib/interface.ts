export interface NgxFormData {
  fields: NgxFields[];
  settings?: NgxSettings;
  classes?: NgxClasses;
}

export interface NgxFields {
  type: 'text' | 'password' | 'number' | 'select' | 'radio' | 'checkbox' | 'textarea';
  key: string;
  label?: string;
  placeholder?: string;
  value?: number | string | string[];
  order?: number;
  emitChanges: boolean;
  options: { value: string | number, name: string, disabled: boolean }[];
  classes?: {
    wrapper?: string;
    label?: string | string[];
    fields?: string | string[];
    error?: string | string[];
  };
  validation?: NgxValidation | NgxValidation[];
}

export interface NgxSettings {
  submitButton?: boolean;
  submitButtonText?: string;
  submitButtonExtraValidation?: boolean;
  singleErrorMessage?: boolean;
  showValidation?: boolean;
  errorOnDirty?: boolean;
}

export interface NgxClasses {
  form?: string | string[];
  submit?: string | string[];
}
export interface NgxValidation {
  // [type: string]: {
  //   value?: any;
  //   message?: string;
  // };
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom' | 'match';
  value?: number | string;
  message?: string;
}

