import { IAppStrings, appStrings } from "./app";
import * as LocalizedStrings from "react-localization";

export interface ISupportedLanguages {
    en: Object;
}

interface IStringCollection {
    app: IAppStrings;

    setLanguage(language: string): void;
}

export const strings: IStringCollection = {
    app: new LocalizedStrings.default(appStrings) as any,

    setLanguage(language: string): void {
        (this.app as any).setLanguage(language);
    }
};
