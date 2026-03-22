import * as vscode from 'vscode';
import WebSocket from 'ws';
import { HeartbeatPayload } from './heartbeat';
import { OfflineQueue } from './queue';
import { updateStatusError, updateStatusLive } from './statusBar';

export class CodePulseClient {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private backoffStragegy = [1000, 2000, 5000, 10000, 30000];
  private backoffIndex = 0;
  
  constructor(
    private serverUrl: string, 
    private apiKey: string, 
    private queue: OfflineQueue
  ) {
    this.connect();
  }

  private connect() {
    if (this.ws) {
      this.ws.removeAllListeners();
      try { this.ws.close(); } catch(e){}
    }

    try {
      this.ws = new WebSocket(this.serverUrl, {
        headers: { "x-api-key": this.apiKey }
      });
    } catch(err) {
      this.handleDisconnect();
      return;
    }

    this.ws.on('open', () => {
      console.log("CodePulse: WebSocket Connected.");
      updateStatusLive();
      this.backoffIndex = 0; // Reset backoff
      this.flushQueue();
    });

    this.ws.on('close', () => {
      console.log("CodePulse: WebSocket Closed.");
      this.handleDisconnect();
    });

    this.ws.on('error', (err) => {
      console.error("CodePulse: WebSocket Error", err);
      // close event will fire next
    });
  }

  private handleDisconnect() {
    updateStatusError();
    const delay = this.backoffStragegy[Math.min(this.backoffIndex++, this.backoffStragegy.length - 1)];
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.reconnectTimeout = setTimeout(() => {
      console.log("CodePulse: Reconnecting...");
      this.connect();
    }, delay);
  }

  private flushQueue() {
    const payloads = this.queue.getQueue();
    if (payloads.length > 0) {
      payloads.forEach(p => this.send(p, true));
      this.queue.clear();
      console.log(`CodePulse: Flushed ${payloads.length} queued events.`);
    }
  }

  public send(payload: HeartbeatPayload, isFlush = false) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    } else if(!isFlush) {
      // Offline, push to queue
      this.queue.add(payload);
    }
  }

  public dispose() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
