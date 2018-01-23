import { Compilation } from "../compiler/compilation";
import { Action } from "redux";

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
}

export function reduce(state: AppState | undefined, action: BaseAction): AppState {
    if (!state) {
        return {
            compilation: new Compilation("")
        };
    }

    switch (action.type) {
        case ActionType.SetText: {
            return {
                compilation: new Compilation((action as SetTextAction).text)
            };
        }

        default: {
            return state;
        }
    }
}
