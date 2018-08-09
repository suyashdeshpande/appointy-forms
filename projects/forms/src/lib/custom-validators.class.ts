export class CustomValidators {
  static match(key: string) {
    return (control: any) => {
      if (control.value && control.root.controls) {
        return control.root.controls[key].value !== control.value ? {
          'match': {
            'currentValue': control.value,
            'requiredValue': control.root.controls[key].value,
            'mustMatchField': key
          }
        } : null;
      }
      return null;
    };
  }
}
