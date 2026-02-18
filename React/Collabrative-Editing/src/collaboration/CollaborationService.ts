/**
 * Collaboration Service
 * Manages WebSocket connection for real-time collaborative diagram editing
 */

import type { DiagramState, CollaborationMessage, MessageType } from '../types/diagramTypes';

type MessageCallback = (message: CollaborationMessage) => void;

export class CollaborationService {
  private ws: WebSocket | null = null;
  private serverUrl: string;
  private messageCallbacks: MessageCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private clientId: string;

  constructor(serverUrl: string = 'ws://localhost:8080') {
    this.serverUrl = serverUrl;
    this.clientId = this.generateClientId();
  }

  /**
   * Generate a unique client ID
   */
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Connect to the WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.serverUrl);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          
          // Request current diagram state
          this.requestState();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: CollaborationMessage = JSON.parse(event.data);
            this.notifyCallbacks(message);
          } catch (error) {
           
          }
        };

        this.ws.onerror = (error) => {

          reject(error);
        };

        this.ws.onclose = () => {

          this.attemptReconnect();
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Attempt to reconnect to the server
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      
      setTimeout(() => {
        this.connect().catch(() => {
         
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {

    }
  }

  /**
   * Request the current diagram state from the server
   */
  requestState(): void {
    this.sendMessage({
      type: 'REQUEST_STATE' as MessageType,
      payload: null,
      clientId: this.clientId,
      timestamp: Date.now()
    });
  }

  /**
   * Send diagram update to all connected clients
   */
  sendDiagramUpdate(state: DiagramState): void {
    this.sendMessage({
      type: 'DIAGRAM_UPDATE' as MessageType,
      payload: { state },
      clientId: this.clientId,
      timestamp: Date.now()
    });
  }

  /**
   * Send a message to the server
   */
  private sendMessage(message: CollaborationMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message: WebSocket is not connected');
    }
  }

  /**
   * Subscribe to incoming messages
   */
  onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all registered callbacks
   */
  private notifyCallbacks(message: CollaborationMessage): void {
    // Don't process messages from this client
    if (message.clientId === this.clientId) {
      return;
    }

    this.messageCallbacks.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
       
      }
    });
  }

  /**
   * Disconnect from the server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.messageCallbacks = [];
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get client ID
   */
  getClientId(): string {
    return this.clientId;
  }
}

// Export a singleton instance
export const collaborationService = new CollaborationService();
