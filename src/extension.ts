import { ExtensionContext, commands } from "vscode";
import {
  addModel,
  generateCommitMessage,
  removeModel,
  selectModel,
} from "./commands";

export function activate(context: ExtensionContext) {
  const allCommands = [
    generateCommitMessage,
    addModel,
    removeModel,
    selectModel,
  ];

  allCommands.forEach((command) => {
    context.subscriptions.push(
      commands.registerCommand(`differ.${command.name}`, () => command(context))
    );
  });
}

export function deactivate() {}
