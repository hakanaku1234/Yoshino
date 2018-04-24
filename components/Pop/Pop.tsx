import {Component, ReactNode} from 'react';
import * as classNames from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {IBaseComponent} from '../template/component';
import { RenderInRootDom } from '../utils/renderInRootDom';

export interface IPopProps extends IBaseComponent {
  /**
   * 气泡框位置
   */
  placement: 'top' | 'left' | 'right' |
  'bottom' | 'topLeft' | 'topRight' |
  'bottomLeft' | 'bottomRight' | 'leftTop' |
  'leftBottom' | 'rightTop' | 'rightBottom';
  /**
   * 鼠标移入后延时多少才显示 Pop， 单位: ms
   */
  mouseEnterDelay: number;
  /**
   * 鼠标移出后延时多少才隐藏 Pop，单位：ms
   */
  mouseLeaveDelay: number;
  /**
   * 卡片类名
   */
  overlayClassName: string;
  /**
   * 卡片样式
   */
  overlayStyle: React.CSSProperties;
  /**
   * 触发行为
   */
  trigger: 'hover' | 'focus' | 'click';
  /**
   * 内容
   */
  title: string;
  /**
   * 受控-是否可见
   */
  visible?: boolean;
  /**
   * 是否可见
   */
  defaultVisible: boolean;
  /**
   *  变化回调
   */
  onChange: (visible: boolean) => void;
  /**
   * 气泡框内容
   */
  content?: string | ReactNode;
}

export interface IPopState {
  visible: boolean;
}

/**
 * **组件中文名称**-组件描述。
 */
export class Pop extends Component<IPopProps, IPopState> {
  refChildren: HTMLElement;
  timeoutHandle: number;

  animateTimeHandle: number[] = []; // 动画timeout句柄

  scale = 0.6;
  popId = `pop_${new Date().getTime() * Math.random()}`; // pop唯一id
  firsrRender = true; // 第一次渲染，用于控制设置pop位置

  static defaultProps = {
    placement: 'top',
    mouseEnterDelay: 0,
    mouseLeaveDelay: 100,
    trigger: 'hover',
    overlayClassName: '',
    overlayStyle: {},
    defaultVisible: false,
  };

  state = {
    visible: this.props.defaultVisible,
  };

  renderPop = () => {
    const {
      className, children, title, style,
      placement, overlayStyle, overlayClassName,
      mouseEnterDelay, mouseLeaveDelay,
      onChange, content, ...otherProps,
    } = this.props;
    const preCls = 'yoshino-pop';
    const clsName = classNames(
      preCls, this.popId,
      `${preCls}-${placement}`, overlayClassName,
      className,
    );
    const visible = this.getVisible();
    const visiblestyle: React.CSSProperties =
    visible ? {transform: 'scale(1)'} : {transform: `scale(${this.scale})`};

    if (this.animateTimeHandle.length > 0) {
      this.animateTimeHandle.forEach((hanlde) => clearTimeout(hanlde));
      this.animateTimeHandle = [];
    }

    if (visible) {
      this.animateTimeHandle.push(window.setTimeout(() => {
        const dom =  document.getElementsByClassName(this.popId)[0] as HTMLElement;
        dom.style.zIndex = null;
      }, 0));
    } else {
      this.animateTimeHandle.push(window.setTimeout(() => {
        const dom =  document.getElementsByClassName(this.popId)[0] as HTMLElement;
        dom.style.zIndex = '-1000';
      }, 100));
    }

    let callBack;
    if (this.firsrRender) {
      callBack = this.resetPopPostion;
      this.firsrRender = false;
    }
    return (
      <RenderInRootDom callBack={callBack}>
        <div
          className={clsName}
          style={{...overlayStyle, ...visiblestyle}}
          {...otherProps}
          {...this.getTriggerAction()}
        >
         {content}
        </div>
      </RenderInRootDom>
    );
  }

  resetPopPostion = () => {
    const children = ReactDOM.findDOMNode(this.refChildren) as Element;
    const {placement} = this.props;
    const dom =  document.getElementsByClassName(this.popId)[0] as HTMLElement;
    const domRect = dom.getBoundingClientRect() as DOMRect; // Pop - content -  dom
    const rect = children.getBoundingClientRect() as DOMRect;
    const pageY = window.pageYOffset;   // 当前滚动条y轴偏移量
    const pageX = window.pageXOffset;   // 当前滚动条x轴偏移量
    const childrenX = pageX + rect.left;  // 子元素x
    const childrenY = pageY + rect.top; // 子元素y

    if (!this.getVisible()) {
      domRect.height = domRect.height / this.scale;
      domRect.width = domRect.width / this.scale;
    }

    // placement所对应的left top
    const config = {
      top: {left: childrenX + rect.width / 2 - domRect.width / 2, top: childrenY - domRect.height},
      left: {left: childrenX - domRect.width, top: childrenY + rect.height / 2 - domRect.height / 2},
      bottom: {left: childrenX + rect.width / 2 - domRect.width / 2, top: childrenY + rect.height},
      right: {left: childrenX + rect.width, top: childrenY + rect.height / 2 - domRect.height / 2},
      topLeft: {left: childrenX, top: childrenY - domRect.height},
      topRight: {left: childrenX + rect.width - domRect.width, top: childrenY - domRect.height},
      leftTop: {left: childrenX - domRect.width, top: childrenY},
      leftBottom: {left: childrenX - domRect.width, top: childrenY + rect.height - domRect.height},
      bottomLeft: {left: childrenX, top: childrenY + rect.height},
      bottomRight: {left: childrenX + rect.width - domRect.width, top: childrenY + rect.height},
      rightTop: {left: childrenX + rect.width, top: childrenY},
      rightBottom: {left: childrenX + rect.width, top: childrenY + rect.height - domRect.height},
    };
    dom.style.top = config[placement].top + 'px';
    dom.style.left = config[placement].left + 'px';

  }

  getVisible = () => {
    const {visible} = this.props;
    return visible === undefined ? this.state.visible : visible;
  }

  renderPopDisplay = (visible: boolean) => {
    const dom =  document.getElementsByClassName(this.popId)[0] as HTMLElement;
    dom.style.display = visible ? 'block' : 'none';
  }

  onChangeTrigger = (visible: boolean) => {
    const {onChange,  mouseEnterDelay, mouseLeaveDelay} = this.props;

    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }

    this.timeoutHandle = window.setTimeout(() => {
      // if (this.props.visible === undefined) {
      //   this.renderPopDisplay(visible);
      // }
      // this.resetPopPostion();
      if (onChange) {
        onChange(visible);
      }
      this.setState({visible});
    }, visible ? mouseEnterDelay : mouseLeaveDelay);
  }

  getTriggerAction = () => {
    const show =  this.onChangeTrigger.bind(this, true);
    const hide = this.onChangeTrigger.bind(this, false);
    const action = {
      hover: {
        onMouseOver: show,
        onMouseOut: hide,
      },
      focus: {
        onFocus: show,
        onBlur: hide,
      },
      click: {
        onMouseDown: show,
        onMouseUp: hide,
      },
    };
    return action[this.props.trigger];
  }

  render() {
    const {children} = this.props;
    // tslint:disable
    const child: React.ReactElement<any> = React.Children.only(children);
    return React.cloneElement(child, {
      // tslint:disable:no-any
      ref: (v: HTMLElement) => {this.refChildren = v},
      ...this.getTriggerAction(),
    }, child.props.children, this.renderPop());
  }
}

export default Pop;
