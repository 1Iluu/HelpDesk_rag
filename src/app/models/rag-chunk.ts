export interface RagChunk {
  text: string;
  partial: boolean;
  role?: 'model' | 'user' | 'tool' | 'system';
  final?: boolean;
  raw?: any;       
}
export interface CreateSessionResponse {
  sessionId: string;
}