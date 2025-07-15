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
            var _a, _b;
            if (this._tokenResolver) {
                this._tokenResolver(token);
                this._tokenResolver = null;
            }
            (_b = (_a = this.props).onReceiveToken) === null || _b === void 0 ? void 0 : _b.call(_a, token);
        };
    }
    /**
     * Triggers CAPTCHA and returns token.
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
