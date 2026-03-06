import type { Iinteractive } from "../interactiveType.js";

export interface IButton extends Iinteractive {
  interactive: {
    type: "button";
    footer?: {
      text: string;
    };
    header?: {
      type: "image";
      image: {
        link: string;
      };
    };
    body: {
      text: string;
    };
    action: {
      buttons: button[];
    };
  };
}
type button = {
  type: "reply";
  reply: {
    id: string;
    title: string;
  };
};
