import type { Iinteractive } from "../interactiveType.js";

export interface IList extends Iinteractive {
  interactive: {
    type: "list";
    header: {
      type: "text";
      text: string;
    };
    body: {
      text: string;
    };
    footer: {
      text: "Powered by whatsHire";
    };
    action: {
      button: "View Options";
      sections: section[];
    };
  };
}
type section = {
  title: string;
  rows: row[];
};
type row = {
  id: string;
  title: string;
  description: string;
};
