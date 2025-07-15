"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.platform = void 0;
const react_native_1 = require("react-native");
exports.platform = {
    isIOS: react_native_1.Platform.OS === 'ios',
    isAndroid: react_native_1.Platform.OS === 'android',
    isWeb: false
};
