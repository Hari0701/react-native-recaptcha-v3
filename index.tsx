import * as React from "react";
import ReCaptchaComponent from "./src/ReCaptchaComponent";

export type IProps = {
  captchaDomain: string;
  onReceiveToken?: (captchaToken: string) => void;
  siteKey: string;
  action: string;
};

class ReCaptchaV3 extends React.PureComponent<IProps> {
  private _captchaRef = React.createRef<ReCaptchaComponent>();
  private _tokenResolver: ((token: string) => void) | null = null;

  /**
   * Triggers the CAPTCHA and returns the token when available.
   */
  public getToken(): Promise<string> {
    return new Promise((resolve) => {
      this._tokenResolver = resolve;
      this._captchaRef.current?.refreshToken();
    });
  }

  private handleToken = (token: string) => {
    if (this._tokenResolver) {
      this._tokenResolver(token);
      this._tokenResolver = null;
    }

    // Optional callback for consumer
    if (this.props.onReceiveToken) {
      this.props.onReceiveToken(token);
    }
  };

  render() {
    return (
      <ReCaptchaComponent
        ref={this._captchaRef}
        action={this.props.action}
        captchaDomain={this.props.captchaDomain}
        siteKey={this.props.siteKey}
        onReceiveToken={this.handleToken}
      />
    );
  }
}

export default ReCaptchaV3;
