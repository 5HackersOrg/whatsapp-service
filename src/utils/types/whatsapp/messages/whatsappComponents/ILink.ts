import type { Iinteractive } from "../interactiveType.js";

export interface ILink extends Iinteractive {
  interactive: {
    type: "cta_url";
    header: {
      type: "text";
      text: string;
    };
    body: {
      text: string;
    };
    footer: {
      text: string;
    };
    action: {
      name: "cta_url";
      parameters: {
        display_text: string;
        url: string;
      };
    };
  };
}
