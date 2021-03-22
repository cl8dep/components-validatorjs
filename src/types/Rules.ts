import {TypeCheckingRule} from "../Validator";

interface Rules {
  [attribute: string]: string | Array<string | TypeCheckingRule> | Rules;
}

export default Rules;