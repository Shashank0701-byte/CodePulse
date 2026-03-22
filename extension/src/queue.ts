import * as vscode from 'vscode';
import { HeartbeatPayload } from './heartbeat';

const QUEUE_KEY = "codepulse.offlineHeartbeats";

export class OfflineQueue {
  constructor(private context: vscode.ExtensionContext) {}

  add(payload: HeartbeatPayload) {
    const queue = this.getQueue();
    queue.push(payload);
    
    // Prevent state bloat. At 1/30 seconds, 500 records is ~4 hours of offline queue.
    if(queue.length > 500) {
      queue.shift();
    }
    
    this.context.globalState.update(QUEUE_KEY, queue);
  }

  getQueue(): HeartbeatPayload[] {
    return this.context.globalState.get<HeartbeatPayload[]>(QUEUE_KEY, []);
  }

  clear() {
    this.context.globalState.update(QUEUE_KEY, []);
  }
}
