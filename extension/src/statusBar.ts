import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

export function initStatusBar() {
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = "$(pulse) CodePulse: initializing";
  statusBarItem.show();
}

export function updateStatusLive() {
  statusBarItem.text = "$(zap) CodePulse: live";
  statusBarItem.tooltip = "Connection established and sending heartbeats";
}

export function updateStatusError() {
  statusBarItem.text = "$(sync~spin) CodePulse: reconnecting";
  statusBarItem.tooltip = "Websocket dropped, attempting to reconnect...";
}

export function disposeStatusBar() {
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}
