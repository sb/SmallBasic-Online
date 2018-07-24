import { Observable } from "rxjs";
import * as angular from "angular";

let appModule = angular.module("myApp", []);
export class prototypeCtrl {
    public constructor() {
        let addEllipse: any = document.querySelector("#addEllipse");
        Observable.fromEvent(addEllipse, "click").subscribe(() => {
            console.log("addEllipse");
        });
    }
}
appModule.controller("prototypeCtrl", prototypeCtrl);
