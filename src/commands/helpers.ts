import { ExtensionContext, QuickPickItem, window } from "vscode";
import { Model, Store } from "../stuff/types";
import { addModel } from "./add-model";

export const getStore = async (context: ExtensionContext) => {
    const storeString = await context.secrets.get("differ.store");
    if (!storeString) {
        return {
            selectedModelName: "",
            models: [],
        };
    }
    return JSON.parse(storeString) as Store;
};

export const getSelectedModel = async (context: ExtensionContext) => {
    const store = await getStore(context);
    return store.models.find(m => m.name === store.selectedModelName);
};

export const getStoredModels = async (context: ExtensionContext) => {
    const store = await getStore(context);
    return store.models;
};

export const showModelPicker = async (context: ExtensionContext, title: string = "Pick model") => {
    const models = await getStoredModels(context);
    if (models.length === 0) {
        window.showInformationMessage("No models found", "Add model").then(
            selected => {
                if (selected === "Add model") {
                    addModel(context);
                }
            }
        );
        return;
    }
    return await window.showQuickPick(models.map(m => ({label: m.name, description: m.baseUrl})),{
        title,
        canPickMany: false,
        placeHolder: "Pick model",
    });
};

export const addModelToStore = async (context: ExtensionContext, model: Model) => {
    const store = await getStore(context);
    store.models.push(model);
    store.selectedModelName = model.name;
    await context.secrets.store("differ.store", JSON.stringify(store));
    window.showInformationMessage("Model added successfully");
};

export const removeModelFromStore = async (context: ExtensionContext, modelName: string) => {
    const store = await getStore(context);
    store.models = store.models.filter(m => m.name !== modelName);
    if (store.selectedModelName === modelName) {
        store.selectedModelName = "";
    }
    await context.secrets.store("differ.store", JSON.stringify(store));
    window.showInformationMessage("Model removed successfully");
};

export const setSelectedModel = async (context: ExtensionContext, modelName: string) => {
    const store = await getStore(context);
    if (!store.models.find(m => m.name === modelName)) {
        window.showErrorMessage("Model not found");
        return;
    }
    store.selectedModelName = modelName;
    await context.secrets.store("differ.store", JSON.stringify(store));
    window.showInformationMessage("Model selected successfully");
};
