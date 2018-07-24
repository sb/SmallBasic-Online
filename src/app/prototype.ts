import * as app from "./app";
import {Observable} from "rxjs";

export class prototypeCtrl {
    public constructor() {
        let addEllipse: any = document.querySelector("#addEllipse");
        Observable.fromEvent(addEllipse, "click").subscribe(() => {
            console.log("addEllipse");
        });
    }
}
app.appModule.controller("prototypeCtrl", prototypeCtrl);
