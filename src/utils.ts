import DebounceOptions from "./types/DebounceOptions";
import IChainableApi from "./types/IChainableApi";
import Rules from "./types/Rules";
import {isPristineField, isValidField} from "./constants";
import IField from "./types/IField";
import Handler from "./Handler";

export const buildEvent = (name: string, value: any) => ({
  target: {
    value, name
  }
});


export function createChainableApi(hoc: any) {
  return {
    validateForm: hoc._validateForm.bind(hoc),
    invalidateField: hoc._invalidateField.bind(hoc),
    setFieldValue: hoc._setFieldValue.bind(hoc),
    getFormStateSync: hoc._getFormStateSync.bind(hoc),
    resetForm: hoc._resetForm.bind(hoc),
    updateState: hoc._updateState,
    getFormData: Handler.getData,
  }
}

export function noop(): number {
  return 0;
}

export function isDefined(obj: any): boolean {
  return obj !== null && obj !== undefined
}

export function isTypeOf(obj: any, type: string): boolean {
  return Object.prototype.toString.call(obj) === type;
}

export function removeEmptyRules(rules: Rules): Rules {
  return Object.entries(rules)
    .filter(([_, v]) => v && v.length > 0)
    .reduce((bag: any, [k, v]) => {
      bag[k] = v;
      return bag;
    }, {});
}

export function forEachField(state: any, proc: (fieldName: string, state: any) => void) {
  Object.keys(state)
    .forEach(key => (key !== isValidField && key !== isPristineField) ? proc(key, state[key]) : null);
}

export function asFunction(obj: any) {
  return typeof obj === 'function' ? obj : () => obj;
}

export function debounce(fn: (arg: boolean) => IChainableApi | null, delay: number, opts: DebounceOptions) {
  fn = fn || noop;
  // @ts-ignore
  const options = {leading: true, ...opts};

  let leadingUsed = false;
  let timer: NodeJS.Timeout | null = null;
  const debounced = (...args: any) => {
    if (timer) {
      clearTimeout(timer);
    }
    if (options.leading && !leadingUsed) {
      fn(Boolean(...args));
      leadingUsed = true;
    } else {
      timer = setTimeout(() => {
        fn(Boolean(...args));
        timer = null;
      }, delay);
    }
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };

  return debounced;
}

export function isInvalidField(field: IField) {
  return field.isValidated && !field.isValid && !field.isPristine;
}



