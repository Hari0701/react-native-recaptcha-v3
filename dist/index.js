"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReCaptchaComponent_1 = require("./src/ReCaptchaComponent");
class ReCaptchaV3 extends React.PureComponent {
    constructor() {
        super(...arguments);
        this._captchaRef = React.createRef();
        this._tokenResolver = null;
        this.handleToken = (token) => {
            if (this._tokenResolver) {
                this._tokenResolver(token);
                this._tokenResolver = null;
            }
            // Optional callback for consumer
            if (this.props.onReceiveToken) {
                this.props.onReceiveToken(token);
            }
        };
    }
    /**
     * Triggers the CAPTCHA and returns the token when available.
     */
    getToken() {
        return new Promise((resolve) => {
            var _a;
            this._tokenResolver = resolve;
            (_a = this._captchaRef.current) === null || _a === void 0 ? void 0 : _a.refreshToken();
        });
    }
    render() {
        return (React.createElement(ReCaptchaComponent_1.default, { ref: this._captchaRef, action: this.props.action, captchaDomain: this.props.captchaDomain, siteKey: this.props.siteKey, onReceiveToken: this.handleToken }));
    }
}
exports.default = ReCaptchaV3;
