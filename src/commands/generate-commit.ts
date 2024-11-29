import {
  window,
  ExtensionContext,
  extensions,
  workspace,
  ProgressLocation,
} from "vscode";
import { getSelectedModel } from "./helpers";
import { addModel } from "./add-model";
import cp from "child_process";
import { generateCommitMessageAI } from "../stuff/ai";

export const generateCommitMessage = async (context: ExtensionContext) => {
  const model = await getSelectedModel(context);
  if (!model) {
    window
      .showInformationMessage("No models found", "Add model")
      .then((selected) => {
        if (selected === "Add model") {
          addModel(context);
        }
      });
    return;
  }

  window.withProgress(
    {
      location: ProgressLocation.Notification,
      title: "Generating message",
      cancellable: false,
    },
    async () => {
      const diff = getDiffText();
      const message = await generateCommitMessageAI(model, diff);
      if (message) {
        setCommitMessage(context, message);
      }
    }
  );
};

const getDiffText = () => {
  const diff = cp.execSync(
    `git -C "${workspace.workspaceFolders?.[0].uri.path}" diff`
  );
  return diff.toString();
};

const setCommitMessage = (context: ExtensionContext, message: string) => {
  const gitExtension = extensions.getExtension("vscode.git")?.exports;
  if (!gitExtension) {
    window.showErrorMessage("Git extension is not available.");
    return;
  }

  const api = gitExtension.getAPI(1);
  if (!api) {
    window.showErrorMessage("Failed to access Git API.");
    return;
  }

  if (api.repositories.length === 1) {
    api.repositories[0].inputBox.value = message; // Set commit message
  }
};
