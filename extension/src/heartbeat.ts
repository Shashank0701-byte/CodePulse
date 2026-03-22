import * as vscode from 'vscode';
import { getGitBranch } from './git';
import { HeartbeatSchema } from '@codepulse/shared';
// Zod typing infer
import type { z } from 'zod';

export type HeartbeatPayload = z.infer<typeof HeartbeatSchema>;

export async function createHeartbeat(): Promise<HeartbeatPayload | null> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return null;
  }

  const document = editor.document;
  // Ignore output panels or internal vscode logs
  if (document.uri.scheme !== 'file') {
    return null;
  }

  const filePath = document.uri.fsPath;
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
  const projectName = workspaceFolder ? workspaceFolder.name : "Unknown Project";

  // Check git branch via CLI
  let branchName = "main"; // default
  try {
    const gitBranch = await getGitBranch(filePath);
    if (gitBranch) {
      branchName = gitBranch;
    }
  } catch(e) { /* ignore */ }

  const payload = {
    file: filePath,
    language: document.languageId,
    project: projectName,
    branch: branchName,
    editor: "vscode",
    timestamp: Date.now()
  };

  // Ensure it matches the strict backend schema natively
  const valid = HeartbeatSchema.safeParse(payload);
  if (valid.success) {
    return valid.data;
  } else {
    console.error("Payload failed schema validation locally:", valid.error);
    return null;
  }
}
