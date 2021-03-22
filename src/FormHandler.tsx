import {asFunction, createChainableApi, debounce} from "./utils";
import React, {PureComponent} from "react";
import Handler from "./Handler";
import FormHandlerProps from "./types/FormHandlerProps";
import IChainableApi from "./types/IChainableApi";
import IEvent from "./types/IEvent";
import Value from "./types/Value";

function FormHandler(props: FormHandlerProps) {
  const {
    rules,
    validationMessages,
    shouldRefresh = (props: any, prevProps: any) => false,
    initialData,
    validationDelay = 500
  } = props;

  const getInitialData = asFunction(initialData);
  return (WrappedComponent: any) => class FormHandlerHOC extends PureComponent {

    state = {
      formState: {}
    };
    private readonly _chainableApi: IChainableApi;
    private _prevProps: any;
    private readonly _initialData: any;
    private _formHandler: Handler;
    private readonly _validateFormDebounced;

    constructor(props: any) {
      super(props);
      this._prevProps = null;
      this._chainableApi = createChainableApi(this);
      this._initialData = getInitialData(props);
      this._formHandler = new Handler({
        rules,
        initialData: this._initialData,
        stateUpdater: this.setState.bind(this),
        validationMessages: asFunction(validationMessages)(props),
      });
      this.state = {
        formState: this._formHandler.getFormState(),
      };
      this._validateFormDebounced = debounce(this._validateForm, validationDelay, {leading: false});
    }

    componentDidMount() {
      if (this._initialData) {
        this._validateForm();
      }
    }

    componentWillUnmount() {
      this._validateFormDebounced.cancel();
    }

    _updateState = () => {
      this._formHandler.updateState();
    };

    _validateForm = (updateState = true) => {
      this._formHandler.validateForm();
      if (updateState) {
        this._updateState();
      }
      return this._chainableApi;
    };

    _onFormChange = (event: IEvent) => {
      const {value, name} = event.target;
      if (!name) {
        console.error('No "name" attr found. Are you missing the name attribute in one of your forms fields.');
      }
      this._setFieldValue(name, value);
      this._updateState();
      this._validateFormDebounced();
      return this._chainableApi;
    };

    _setFieldValue = (name: string, value: Value) => {
      this._formHandler.handleFormChange(name, value);
      return this._chainableApi;
    };

    _getFormStateSync = () => this._formHandler.getFormState();

    _invalidateField = (field: string, value: any, msg: string) => {
      this._formHandler.invalidateField(field, value, msg);
      return this._chainableApi;
    };

    _resetForm = () => {
      this._formHandler.resetForm();
      this._updateState();
      return this._chainableApi;
    };

    _clearForm = () => {
      this._formHandler.clearForm();
      this._updateState();
      return this._chainableApi;
    };

    _checkRefresh() {
      if (shouldRefresh(this.props, this._prevProps)) {
        this._formHandler.resetForm(getInitialData(this.props));
        setTimeout(() => this._updateState());
      }
      this._prevProps = this.props;
    }

    render() {
      const {formState} = this.state;
      this._checkRefresh();
      return (
        <WrappedComponent
          {...this.props}
          formState={formState}
          formInitialData={this._initialData}
          getFormStateSync={this._getFormStateSync}
          setFieldValue={this._setFieldValue}
          onFormChange={this._onFormChange}
          validateForm={this._validateForm}
          invalidateField={this._invalidateField}
          resetForm={this._resetForm}
          clearForm={this._clearForm}
          getFormData={Handler.getData}
        />
      )
        ;
    }
  };
}

export default FormHandler;