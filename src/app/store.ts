import { Compilation } from "../compiler/compilation";
import { Action } from "redux";
import { AppInsights } from "applicationinsights-js";

export enum ActionType {
    SetText
}

export interface BaseAction extends Action {
    readonly type: ActionType;
}

export interface SetTextAction extends BaseAction {
    text: string;
}

export class ActionFactory {
    private constructor() {
    }

    public static setText(text: string): SetTextAction {
        return {
            type: ActionType.SetText,
            text: text
        };
    }
}

export interface AppState {
    readonly compilation: Compilation;
    readonly appInsights: Microsoft.ApplicationInsights.IAppInsights;
}

export function reduce(state: AppState | undefined, action: BaseAction): AppState {
    if (!state) {
        return createInitialState();
    }

    switch (action.type) {
        case ActionType.SetText: {
            return {
                compilation: new Compilation((action as SetTextAction).text),
                appInsights: state.appInsights
            };
        }

        default: {
            return state;
        }
    }
}

export function createInitialState(): AppState {
    AppInsights.downloadAndSetup!({
        // TODO: build script needs to fix these two values:
        disableTelemetry: true,
        instrumentationKey: "xxxx-xxx-xxx-xxx-xxxxxxx",

        verboseLogging: true,
        disableExceptionTracking: false,
        disableAjaxTracking: false
    });

    appInsights.queue.push(() => {
        appInsights.context.addTelemetryInitializer(envelope => {
            const telemetryItem = envelope.data.baseData;
            telemetryItem.properties = telemetryItem.properties || {};

            // Add these properties to all logs:
            telemetryItem.properties.urlReferrer = document.referrer;
        });
    });

    return {
        compilation: new Compilation(`
' A new Program!
TextWindow.WriteLine("What is your name?")
name = TextWindow.Read()
TextWindow.WriteLine("Hello " + name + "!")`),
        appInsights: appInsights
    };
}
