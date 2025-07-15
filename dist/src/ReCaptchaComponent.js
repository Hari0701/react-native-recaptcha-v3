"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const react_native_webview_1 = require("react-native-webview");
const constants_1 = require("./constants");
class ReCaptchaComponent extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.webViewRef = null;
    }
    refreshToken() {
        if (!this.webViewRef)
            return;
        if (constants_1.platform.isIOS) {
            this.webViewRef.injectJavaScript(`window.executionParams.executeCaptcha();`);
        }
        else if (constants_1.platform.isAndroid) {
            // On Android, reload to clear state, then call again (with slight delay to ensure WebView is ready)
            this.webViewRef.reload();
            setTimeout(() => {
                var _a;
                (_a = this.webViewRef) === null || _a === void 0 ? void 0 : _a.injectJavaScript(`window.executionParams.executeCaptcha();`);
            }, 500);
        }
    }
    render() {
        return (React.createElement(react_native_1.View, { style: { height: 0, width: 0, flex: 0 } },
            React.createElement(react_native_webview_1.WebView, { ref: (ref) => (this.webViewRef = ref), javaScriptEnabled: true, originWhitelist: ["*"], mixedContentMode: "always", source: {
                    html: getInvisibleRecaptchaContent(this.props.siteKey, this.props.action),
                    baseUrl: this.props.captchaDomain,
                }, onMessage: (e) => {
                    var _a, _b;
                    (_b = (_a = this.props).onReceiveToken) === null || _b === void 0 ? void 0 : _b.call(_a, e.nativeEvent.data);
                } })));
    }
}
exports.default = ReCaptchaComponent;
// ---- Helper functions ----
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
          window.executionParams = {
            executeCaptcha: function() {
              grecaptcha.ready(function() {
                grecaptcha.execute('${siteKey}', { action: '${action}' }).then(function(token) {
                  window.ReactNativeWebView.postMessage(token);
                });
              });
            }
          };
        </script>
      </head>
      <body></body>
    </html>
  `;
};
