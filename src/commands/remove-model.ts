import { ExtensionContext, QuickPickItem, window } from "vscode";
import { removeModelFromStore, showModelPicker } from "./helpers";

export const removeModel = async (context: ExtensionContext) => {
    
    const selected = await showModelPicker(context, "Pick model to remove");
    if (!selected) {
        return;
    }

    await removeModelFromStore(context, selected.label);

};