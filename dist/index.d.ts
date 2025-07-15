import * as React from "react";
export type IProps = {
    captchaDomain: string;
    onReceiveToken?: (captchaToken: string) => void;
    siteKey: string;
    action: string;
};
declare class ReCaptchaV3 extends React.PureComponent<IProps> {
    private _captchaRef;
    private _tokenResolver;
    /**
     * Triggers CAPTCHA and returns token.
     */
    getToken(): Promise<string>;
    private handleToken;
    render(): React.JSX.Element;
}
export default ReCaptchaV3;
