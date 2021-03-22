import Rules from "./Rules";
import InitialData from "./InitialData";

interface FormHandlerProps {
  rules: Rules;
  validationMessages: object;
  shouldRefresh: () => boolean;
  initialData: InitialData;
  validationDelay: number
}

export default FormHandlerProps;