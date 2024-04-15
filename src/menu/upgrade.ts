import { Outputs } from "./constants";
import { Data } from "./type";

export default function ({ input, output, data, setDeclaredStyle, removeDeclaredStyle, getDeclaredStyle }: UpgradeParams<Data>): boolean {

  output.add(Outputs.ICON_CLICK, "单击Icon", { type: "any" });

  return true;
}
