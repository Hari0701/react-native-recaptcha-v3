import * as React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { platform } from "./constants";

type IProps = {
  captchaDomain: string;
  onReceiveToken?: (captchaToken: string) => void;
  siteKey: string;
  action: string;
};

class ReCaptchaComponent extends React.PureComponent<IProps> {
  private webViewRef: WebView | null = null;

  public refreshToken() {
    if (!this.webViewRef) return;

    if (platform.isIOS) {
      this.webViewRef.injectJavaScript(getExecutionFunction(this.props.siteKey, this.props.action));
    } else if (platform.isAndroid) {
      this.webViewRef.reload();
    }
  }

  render() {
    return (
      <View style={{ height: 0, width: 0, flex: 0 }}>
        <WebView
          ref={(ref) => (this.webViewRef = ref)}
          javaScriptEnabled
          originWhitelist={["*"]}
          mixedContentMode="always"
          source={{
            html: getInvisibleRecaptchaContent(this.props.siteKey, this.props.action),
            baseUrl: this.props.captchaDomain,
          }}
          onMessage={(e) => {
            this.props.onReceiveToken?.(e.nativeEvent.data);
          }}
        />
      </View>
    );
  }
}

export default ReCaptchaComponent;

// ---- Helper functions ----

const getExecutionFunction = (siteKey: string, action: string) => {
  return `
    window.grecaptcha.execute('${siteKey}', { action: '${action}' }).then(function(token) {
      window.ReactNativeWebView.postMessage(token);
    });
  `;
};

const getInvisibleRecaptchaContent = (siteKey: string, action: string) => {
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
