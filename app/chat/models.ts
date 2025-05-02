export interface ChatMessage {
  id: number;
  chatId: number;
  userId: number;
  message: string;
  timestamp: number;
  name: string;
}

export interface InputChatMessage {
  chatId: number;
  userId: number;
  message: string;
}
