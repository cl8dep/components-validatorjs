import Rules from "./Rules";
import ErrorMessages from "./ErrorMessages";

interface IHandlerProps {
  rules: Rules,
  initialData?: any;
  validationMessages?: ErrorMessages;
  stateUpdater?: any;
  formStateName?:any;
}

export default IHandlerProps;