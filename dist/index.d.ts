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
     * Triggers the CAPTCHA and returns the token when available.
     */
    getToken(): Promise<string>;
    private handleToken;
    render(): React.JSX.Element;
}
export default ReCaptchaV3;
