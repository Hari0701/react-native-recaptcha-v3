import * as React from "react";
export type IProps = {
    captchaDomain: string;
    onReceiveToken: (captchaToken: string) => void;
    siteKey: string;
    action: string;
};
export type IState = {};
declare class ReCaptchaV3 extends React.PureComponent<IProps, IState> {
    private _captchaRef;
    refreshToken: () => void;
    render(): React.JSX.Element;
}
export default ReCaptchaV3;
