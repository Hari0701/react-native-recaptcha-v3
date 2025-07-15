import * as React from "react";
type IProps = {
    captchaDomain: string;
    onReceiveToken?: (captchaToken: string) => void;
    siteKey: string;
    action: string;
};
declare class ReCaptchaComponent extends React.PureComponent<IProps> {
    private webViewRef;
    refreshToken(): void;
    render(): React.JSX.Element;
}
export default ReCaptchaComponent;
