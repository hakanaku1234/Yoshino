
import {Component} from 'react';
import * as React from 'react';
import * as classNames from 'classnames';
import {IBaseComponent} from '../template/component';

export interface IMenuItemProps extends IBaseComponent {
  /**
   * 组件深度 - 用于控制paddingLeft
   */
  deep?: number;
  /**
   * 激活key
   */
  activeKey?: string;
  /**
   * 唯一id
   */
  keyId: string;
  /**
   * 选项 - 变化回调
   */
  onSelect?: (activeKey: string) => void;
  /**
   * 禁用
   */
  disabled?: boolean;
}

export interface IMenuItemState {

}

/**
 * **菜单**-提供导航功能
 */
export class MenuItem extends Component<IMenuItemProps, IMenuItemState> {
  static defaultProps = {
    active: false,
    disabled: false,
  };

  onSelect = () => {
    const {onSelect, keyId, disabled, onClick} = this.props;
    if (disabled) {
      return;
    }
    if (onSelect) {
      onSelect(keyId);
    }
<<<<<<< HEAD
=======
    if (onClick) {
      onClick();
    }
>>>>>>> eead5d7134113bd5bb617f03e84d08e42e6a7594
  }

  render() {
    const {
      className, style, children, deep,
      activeKey, keyId, onSelect, disabled,
      ...otherProps,
    } = this.props;
    const preCls = 'yoshino-menu-item';
    const clsName = classNames(
      preCls, className,
      {
        [`${preCls}-active`]: activeKey === keyId,
        [`${preCls}-disabled`]: disabled,
      },
    );
    const paddingLeft = `${deep as number * 24}px`;
    return (
      <li
        {...otherProps}
        className={clsName}
        style={{paddingLeft, ...style}}
        onClick={this.onSelect}
      >
        {children}
      </li>
    );
  }
}

export default MenuItem;
