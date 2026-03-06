type text = {
  body: string;
};
type locationProps = {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
};
type media = {
  mime_type: string;
  sha256: string;
  id: string;
};
type audio = {
  voice: boolean;
} & media;
type video = media;
type image = media;
type document = {
  filename: string;
  url: string;
} & media;
export type TextMessage = {
  type: "text";
  info: text;
};
export type DocumentMessage = {
  type: "document";

  info: document;
};
export type VideoMessage = {
  type: "video";
  info: video;
};
export type ImageMessage = {
  type: "image";
  info: image;
};
export type AudioMessage = {
  type: "audio";
  info: audio;
};
export type LocationMessage = {
  type: "location";
  info: locationProps;
};
type ListReplyMessage = {
  type: "list_reply";
  info: {
    repliedToMessageId: string;
    id: string;
    title: string;
    description: string;
  };
};
type ButtonReplyMessage = {
  type: "button_reply";
  info: {
    repliedToMessageId: string;
    id: string;
    title: string;
  };
};
export type MessageInfo = {
  userPhoneNumber: string;
} & (
  | AudioMessage
  | LocationMessage
  | ImageMessage
  | DocumentMessage
  | VideoMessage
  | TextMessage
  | ListReplyMessage
  | ButtonReplyMessage
);
