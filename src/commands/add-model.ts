import { ExtensionContext, QuickPickItem, window } from "vscode";
import { MultiStepInput } from "../stuff/multi-step-input";
import { providers as allProviders } from "../stuff/data";
import { Provider } from "../stuff/types";
import { getModels } from "../stuff/ai";
import { addModelToStore, getStoredModels } from "./helpers";

export const addModel = async (context: ExtensionContext) => {
  const title = "Add model";
  const totalSteps = 4;

  interface State {
    title: string
    step: number
    totalSteps: number
    provider: Provider
    type: "openai" | "anthropic" | "xai"
    baseUrl: string
    token: string
    name: string
    runtime: QuickPickItem
  }

  const providers: QuickPickItem[] = allProviders.map((provider) => provider);

  const pickProvider = async (input: MultiStepInput, state: Partial<State>) => {
    state.provider = await input.showQuickPick({
      title,
      step: 1,
      totalSteps,
      placeholder: "Pick a provider",
      items: providers,
      activeItem: state.provider,
      shouldResume: shouldResume,
    });
    switch (state.provider.label) {
      case "OpenAI":
        state.type = "openai";
        break;
      case "Anthropic":
        state.type = "anthropic";
        break;
      case "xAI":
        state.type = "xai";
        break;
      default:
        break;
    }
    return (input: MultiStepInput) => inputBaseUrl(input, state);
  };

  const inputBaseUrl = async (input: MultiStepInput, state: Partial<State>) => {
    state.baseUrl = await input.showInputBox({
      title,
      step: 2,
      totalSteps,
      value: state.baseUrl || state.provider?.detail || "",
      prompt: "Input base url of API",
      validate: requiredField,
      shouldResume: shouldResume,
    });
    return (input: MultiStepInput) => inputToken(input, state);
  };

  const inputToken = async (input: MultiStepInput, state: Partial<State>) => {
    state.token = await input.showInputBox({
      title,
      step: 3,
      totalSteps,
      value: state.token || "",
      password: true,
      prompt: "Input API token",
      validate: requiredField,
      shouldResume: shouldResume,
    });
    return (input: MultiStepInput) => pickModel(input, state);
  };

  const pickModel = async (input: MultiStepInput, state: Partial<State>) => {
    let models: any[] = [];
    try {
      models = await getModels(state.baseUrl!, state.token!);
    } catch (error) {
      if (error instanceof Error) {
        window.showErrorMessage(error.message);
      }
      return undefined;
    }

    const model = await input.showQuickPick({
      title,
      step: 1,
      totalSteps,
      placeholder: "Pick a model",
      items: models.map((model) => ({ label: model.id })),
      activeItem: state.provider,
      shouldResume: shouldResume,
    });

    state.name = model.label;

    const storedModels = await getStoredModels(context);
    const modelExists = storedModels.find(
      (model) => model.name === state.name && model.baseUrl === state.baseUrl
    );
    if (modelExists) {
      window.showErrorMessage("Model already exists");
      return undefined;
    }

    await addModelToStore(context, {
      name: state.name,
      baseUrl: state.baseUrl!,
      apiKey: state.token!,
      type: state.type!,
    });
  };

  const requiredField = async (field: string) => {
    if (!field) {
      return "This field is required";
    }
  };

  const shouldResume = () => {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((_resolve, _reject) => {
      // noop
    });
  };

  const state = {} as Partial<State>;
  await MultiStepInput.run((input) => pickProvider(input, state));
  return state as State;
};
