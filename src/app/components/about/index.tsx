import * as React from "react";
import { strings } from "../../loc";

export class About extends React.Component {
  public render(): JSX.Element {
    return (
      <div className="animated fadeIn">
        {strings.app.aboutText}
      </div>
    );
  }
}
