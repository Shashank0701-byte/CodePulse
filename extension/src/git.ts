import { exec } from 'child_process';
import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Returns the current git branch of a given filePath, or undefined if not in a git repo.
 */
export function getGitBranch(filePath: string): Promise<string | undefined> {
  return new Promise((resolve) => {
    const dir = path.dirname(filePath);
    exec('git rev-parse --abbrev-ref HEAD', { cwd: dir, timeout: 1000 }, (error, stdout) => {
      if (error) {
        resolve(undefined);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}
