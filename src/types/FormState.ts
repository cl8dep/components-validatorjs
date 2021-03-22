type FormState = {
  isValid: boolean;
  isPristine: boolean;
  [item: string]: {
    isValid: boolean;
    isPristine: boolean;
    isValidated: boolean;
    value?: any;
    validation?: object;
  } | boolean
}

export default FormState;