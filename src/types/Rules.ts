//import {TypeCheckingRule} from "../Validator/index";

interface Rules {
  [attribute: string]: string | Array<string /*| TypeCheckingRule*/> | Rules;
}

export default Rules;