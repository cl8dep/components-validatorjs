type ValidationResult = {
  [item: string]: {
    isValid: boolean;
    isPristine: boolean;
    isValidated: boolean;
    value?: any;
    validation?: object;
    primaryMessage?: string | false;
  }
}

export default ValidationResult;