export type ChatHistoryTurn = {
  role: "user" | "assistant";
  content: string;
};

export type ChatRequest = {
  message: string;
  history: ChatHistoryTurn[];
};

export type ChatSource = {
  id: string;
  title: string;
  sourcePath?: string;
  content: string;
};

export type ChatProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  color?: string;
};

export type ChatResponse = {
  answer: string;
  sources: ChatSource[];
  products: ChatProduct[];
  unsupported: boolean;
};

export type ChatMessage = {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  response?: ChatResponse;
};
