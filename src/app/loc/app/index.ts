import { enAppStrings } from "./en";
import { ISupportedLanguages } from "..";

export interface IAppStrings {
    codeEditorTitle: string;

    aboutTitle: string;
    aboutText: string;

    productName: string;
    productVersion: string;
    productDescription: string;
}

export const appStrings: ISupportedLanguages = {
    en: enAppStrings
};
