"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const react_native_webview_1 = require("react-native-webview");
const constants_1 = require("./constants");
const getExecutionFunction = (siteKey, action) => {
    return `
    window.grecaptcha.execute('${siteKey}', { action: '${action}' }).then(function(token) {
      window.ReactNativeWebView.postMessage(token);
    });
  `;
};
const getInvisibleRecaptchaContent = (siteKey, action) => {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://www.google.com/recaptcha/api.js?render=${siteKey}"></script>
        <script>
          window.onload = function() {
            grecaptcha.ready(function() {
              ${getExecutionFunction(siteKey, action)}
            });
          };
        </script>
      </head>
      <body></body>
    </html>
  `;
};
class ReCaptchaComponent extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.webViewRef = null;
    }
    refreshToken() {
        if (!this.webViewRef)
            return;
        if (constants_1.platform.isIOS) {
            this.webViewRef.injectJavaScript(getExecutionFunction(this.props.siteKey, this.props.action));
        }
        else if (constants_1.platform.isAndroid) {
            this.webViewRef.reload();
        }
    }
    render() {
        return (React.createElement(react_native_1.View, { style: { height: 0, width: 0, flex: 0 } },
            React.createElement(react_native_webview_1.WebView, { ref: (ref) => (this.webViewRef = ref), javaScriptEnabled: true, originWhitelist: ["*"], mixedContentMode: "always", source: {
                    html: getInvisibleRecaptchaContent(this.props.siteKey, this.props.action),
                    baseUrl: this.props.captchaDomain,
                }, onMessage: (e) => {
                    this.props.onReceiveToken(e.nativeEvent.data);
                } })));
    }
}
exports.default = ReCaptchaComponent;
