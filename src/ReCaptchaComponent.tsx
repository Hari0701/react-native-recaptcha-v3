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
      this.webViewRef.injectJavaScript(`window.executionParams.executeCaptcha();`);
    } else if (platform.isAndroid) {
      // On Android, reload to clear state, then call again (with slight delay to ensure WebView is ready)
      this.webViewRef.reload();

      setTimeout(() => {
        this.webViewRef?.injectJavaScript(`window.executionParams.executeCaptcha();`);
      }, 500);
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
