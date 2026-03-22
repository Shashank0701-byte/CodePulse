import * as vscode from 'vscode';
import { initStatusBar, disposeStatusBar } from './statusBar';
import { OfflineQueue } from './queue';
import { CodePulseClient } from './client';
import { createHeartbeat } from './heartbeat';

let client: CodePulseClient | null = null;
let lastHeartbeatTime = 0;
const DEBOUNCE_MS = 30000; // 30 seconds

export function activate(context: vscode.ExtensionContext) {
  console.log('CodePulse extension activated.');

  // Initialize UI
  initStatusBar();

  // Load configuration
  const config = vscode.workspace.getConfiguration('codepulse');
  const apiKey = config.get<string>('apiKey');
  const serverUrl = config.get<string>('serverUrl');

  if (!apiKey) {
    vscode.window.showWarningMessage('CodePulse: Please set your API Key in Settings to enable real-time presence.');
    return;
  }

  // Init client queue + connection
  const queue = new OfflineQueue(context);
  client = new CodePulseClient(serverUrl || 'ws://localhost:3001', apiKey, queue);

  // Hook into VS Code lifecycle
  const triggerHeartbeat = async () => {
    const now = Date.now();
    // Throttle heartbeats strictly to 1 per 30 seconds
    if (now - lastHeartbeatTime >= DEBOUNCE_MS && client) {
      lastHeartbeatTime = now;
      const payload = await createHeartbeat();
      if (payload) {
        client.send(payload);
      }
    }
  };

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(triggerHeartbeat),
    vscode.window.onDidChangeActiveTextEditor(triggerHeartbeat),
    vscode.window.onDidChangeWindowState(triggerHeartbeat)
  );
}

export function deactivate() {
  disposeStatusBar();
  if (client) {
    client.dispose();
  }
}
