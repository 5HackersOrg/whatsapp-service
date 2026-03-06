export interface Iinteractive {
  interactive: any;
}
export type TextPayload = {
  type: "text";
  text: string;
};
export type InteractivePayload = {
  type: "interactive";
  interactive: Iinteractive;
 
};
export type MessagePayload = TextPayload | InteractivePayload;
