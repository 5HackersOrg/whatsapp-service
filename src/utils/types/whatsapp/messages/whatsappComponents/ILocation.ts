import type { Iinteractive } from "../interactiveType.js";

export interface ILocationRequest extends Iinteractive {
  interactive: {
    type: "location_request_message";
    body: {
      text: string;
    };
    action: {
      name: "send_location";
    };
  };
}
