
import React, { Component, PropTypes } from 'react';

import {
  NativeModules,
  TextInput,
  findNodeHandle,
  AppRegistry,
} from 'react-native';

const { CustomKeyboard} = NativeModules;

const {
  install, uninstall, getSelectionRange,
  insertText, backSpace, doDelete,
  moveLeft, moveRight,
  switchSystemKeyboard,
} = CustomKeyboard;

export {
  install, uninstall, getSelectionRange,
  insertText, backSpace, doDelete,
  moveLeft, moveRight,
  switchSystemKeyboard,
};

const keyboardTypeRegistry = {};

export function register(type, keyboardInfo) {
  keyboardTypeRegistry[type] = keyboardInfo;
}

class CustomKeyboardContainer extends Component {
  render() {
    const {tag, type} = this.props;
    const factory = keyboardTypeRegistry[type].factory;
    const inputFilter = keyboardTypeRegistry[type].inputFilter
    if (!factory) {
      console.warn(`Custom keyboard type ${type} not registered.`);
      return null;
    }
    const Comp = factory();
    return <Comp tag={tag} inputFilter={inputFilter} />;
  }
}

AppRegistry.registerComponent("CustomKeyboard", ()=>CustomKeyboardContainer);

export class CustomTextInput extends Component {
  static propTypes = {
    ...TextInput.propTypes,
    customKeyboardType: PropTypes.string,
  };
  componentDidMount() {
    install(findNodeHandle(this.input), this.props.customKeyboardType, this.props.maxLength === undefined ? 1024 : this.props.maxLength);
  }
  componentWillReceiveProps(newProps) {
    if (newProps.customKeyboardType !== this.props.customKeyboardType) {
      install(findNodeHandle(this.input), newProps.customKeyboardType, newProps.maxLength === undefined ? 1024 : this.props.maxLength);
    }
  }
  onRef = ref => {
    this.input = ref;
  };
  render() {
    const { customKeyboardType, ...others } = this.props;
    return <TextInput {...others} keyboardType={'numeric'} ref={this.onRef}/>;
  }
}

