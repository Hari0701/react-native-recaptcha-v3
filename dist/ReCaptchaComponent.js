"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
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
    webViewRef = null;
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
