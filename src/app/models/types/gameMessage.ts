export type GameMessage = {
  message: string
  type: MessageType
}

export enum MessageType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
}
