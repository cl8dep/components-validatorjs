import {forEachField, isDefined, noop, removeEmptyRules} from "./utils";
import IHandlerProps from "../types/IHandlerProps";
import Value from "../types/Value";
import InitialData from "../types/InitialData";
import Rules from "../types/Rules";
import Validator from "validatorjs";
import FormState from "../types/FormState";
import ErrorMessages from "../types/ErrorMessages";
import ValidationResult from "../types/ValidationResult";

const DEF_STATE_FIELD_NAME = 'formState';

export function getInitialState(fields: string[] = [], options: {initialData?: InitialData} = {}) {
  const { initialData } = options;
  const formState: FormState = { isValid: false, isPristine: true };
  for (let i = 0; i < fields.length; i += 1) {
    const f = fields[i];
    formState[f] = {
      isValid: false,
      isPristine: true,
      isValidated: false,
      value: initialData ? [f] : '',
      validation: {},
    };
  }
  return formState;
}


class Handler {

  fields: string[];
  _validationRules: Rules;
  _formState: any;
  _invalidations: any;
  _validationMessages: ErrorMessages | undefined;
  _stateFieldName: any;
  _stateUpdater: any;
  _initialFormState: any;
  
  static getData(state: any) {
    const formData: any = {};
    forEachField(state, (field: any, stateFieldValue: any) => {
      formData[field] = stateFieldValue.value;
    });
    return formData;
  }

  constructor(props: IHandlerProps) {
    const{rules, validationMessages, stateUpdater, formStateName, initialData} = props;
    if (!rules) {
      throw Error('The rules are required.');
    }
    this.fields = Object.keys(rules);
    this._validationRules = removeEmptyRules(rules);
    this._validationMessages = validationMessages;
    this._stateUpdater = stateUpdater || noop;
    this._stateFieldName = formStateName || DEF_STATE_FIELD_NAME;
    this._prepareState(initialData);
  }

  _prepareState(data: InitialData) {
    this._formState = getInitialState(this.fields, {initialData: data});
    this._initialFormState = this._formState;
    this._invalidations = {};
  }

  getStateFieldName() {
    return this._stateFieldName;
  }

  resetForm(data?: InitialData) {
    if (data) {
      this._formState = getInitialState(this.fields, {initialData: data});
      this._initialFormState = this._formState;
      this._invalidations = {};
    } else {
      this._formState = this._initialFormState;
    }
    return this;
  }

  clearForm() {
    this._formState = getInitialState(this.fields, {});
    return this;
  }

  getFormState() {
    return this._formState;
  }

  handleFormChange(field: string | object, value: Value) {
    if (typeof field === "string") {
      this._fieldChange({ [field]: value });
    } else if (typeof field === "object") {
      this._fieldChange(field);
    } else {
      throw new TypeError(`The field argument must be a string or an object but ${Object.prototype.toString.call(field)} was founded.`);
    }
    return this;
  }

  _fieldChange(fields: any) {
    const changes: {[item: string]: any} = {};
    let existChanges = false;
    forEachField(fields, (prop, value) => {
      if (isDefined(this._formState[prop]) && this._formState[prop].value !== value) {
        existChanges = true;
        changes[prop] = { ...this._formState[prop], value, isPristine: false };
      }
    });
    if (existChanges) {
      this._formState = { ...this._formState, ...changes, isPristine: false };
    }
  }

  invalidateField(field: string, value: Value, msg: string) {
    if (value !== undefined) {
      this._invalidations[field] = { value, msg };
    }
    return this;
  }

  validateForm() {
    const validation = new Validator(
      Handler.getData(this._formState),
      this._validationRules,
      this._validationMessages
    );
    let isValid = validation.passes();
    const { errors } = validation;
    const validationResult: ValidationResult = {};
    forEachField(this._validationRules, (fieldName) => {
      const { isPristine } = this._formState[fieldName];
      validationResult[fieldName] = {
        isValid: isPristine ? true : !errors.first(fieldName),
        isValidated: !isPristine,
        isPristine,
        value: this._formState[fieldName].value,
        primaryMessage: isPristine ? undefined : errors.first(fieldName),
      };

      // If the field is already invalid we don't check invalidation's
      if (validationResult[fieldName].isValid) {
        const { value, msg } = this._invalidations[fieldName] || { value: null };
        if (this._formState[fieldName].value === value) {
          isValid = false;
          validationResult[fieldName] = {
            ...validationResult[fieldName], isValid: false, isValidated: true, primaryMessage: msg,
          };
        }
      }
    });
    this._formState = { ...this._formState, ...validationResult, isValid };
    return this;
  }

  updateState(extras = {}) {
    this._stateUpdater({ [this._stateFieldName]: this.getFormState(), ...extras });
    return this;
  }
}

export default Handler;