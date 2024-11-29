import { ExtensionContext, QuickPickItem, window } from "vscode";
import { getStoredModels, setSelectedModel, showModelPicker } from "./helpers";

export const selectModel = async (context: ExtensionContext) => {
    
    const selected = await showModelPicker(context, "Pick model to select as current");
    if (!selected) {
        return;
    }

    await setSelectedModel(context, selected.label);

};