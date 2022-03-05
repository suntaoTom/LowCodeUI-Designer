/**
 * 鼠标缩放事件
 * @param domstyle 组件框的样式参数对象，必要参数height、width、top、left
 * @param e 组件dom对象
 * @param canves 画布对象
 */
export function doMove(
  currentTarget: any,
  domstyle: any,
  e: any,
  canves: any,
  callback: Function | null
) {
  e.stopPropagation(); //阻止事件冒泡，在性能上有一定优化
  e.preventDefault();
  const oDiv = currentTarget; //这里一定要用currentTarget，因为这是获取事件最终的元素，而不是捕获、冒泡的元素
  const disX = e.clientX - oDiv.offsetLeft;
  const disY = e.clientY - oDiv.offsetTop;
  document.onmousemove = function(ev) {
    console.log(4848);
    const oEvent = ev || event;
    let l = oEvent.clientX - disX;
    let t = oEvent.clientY - disY;

    if (l < 0) {
      l = 0;
    } else if (l > canves.clientWidth - oDiv.offsetWidth) {
      l = canves.clientWidth - oDiv.offsetWidth;
    }
    if (t < 0) {
      t = 0;
    } else if (t > canves.clientHeight - oDiv.offsetHeight) {
      t = canves.clientHeight - oDiv.offsetHeight;
    }
    domstyle.left = l + "px";
    domstyle.top = t + "px";
  };
  document.onmouseup = function() {
    console.log(4747);
    callback !== null ? callback() : false;
    document.onmousemove = null;
    document.onmouseup = null;
  };
  return false; //阻止默认事件 屏蔽火狐的bug
}

/**
 * 点击事件，点击后设置当前元素为选中元素
 */
export function handleTopWrapperClick(e: any) {
  console.log(1, e);
  e.stopPropagation();
  e.preventDefault();
}

/**
 * 鼠标缩放事件
 * @param domstyle 组件框的样式参数对象，必要参数height、width、top、left
 * @param canves 画布对象
 * @param e 缩放dom对象
 * @param point 缩放dom对象标识："lt", "rt", "lb", "rb", "l", "r", "t", "b"
 */
export function handleMouseDownOnPoint(
  domstyle: any,
  canves: any,
  e: any,
  point: any,
  callback: Function | null
) {
  // 抛出事件让父组件设置当前元素选中状态
  // this.$emit("handleElementClick");
  e.stopPropagation();
  e.preventDefault(); // Let's stop this event.
  let height = parseInt(domstyle.height.replace("px", "")) || 0;
  let width = parseInt(domstyle.width.replace("px", "")) || 0;
  let top = parseInt(domstyle.top.replace("px", "")) || 0;
  let left = parseInt(domstyle.left.replace("px", "")) || 0;
  let startX = e.clientX;
  let startY = e.clientY;
  let move = (moveEvent: { clientX: any; clientY: any }) => {
    let currX = moveEvent.clientX;
    let currY = moveEvent.clientY;
    let disY = currY - startY;
    let disX = currX - startX;
    let hasT = /t/.test(point);
    let hasB = /b/.test(point);
    let hasL = /l/.test(point);
    let hasR = /r/.test(point);
    let newHeight = +height + (hasT ? -disY : hasB ? disY : 0);
    let newWidth = +width + (hasL ? -disX : hasR ? disX : 0);
    domstyle.height = (newHeight > 0 ? newHeight : 0) + "px";
    domstyle.width = (newWidth > 0 ? newWidth : 0) + "px";

    if (!(+left + (hasL ? disX : 0) < 0)) {
      domstyle.left = +left + (hasL ? disX : 0) + "px";
    }
    //重新计算width不在可视化区域内，left、width的值
    if (newWidth + left > canves.clientWidth) {
      if (canves.clientWidth - newWidth < 0) {
        domstyle.width = canves.clientWidth + "px";
        domstyle.left = 0 + "px";
      } else {
        domstyle.left = canves.clientWidth - newWidth + "px";
      }
    }

    if (!(+top + (hasT ? disY : 0) < 0)) {
      domstyle.top = +top + (hasT ? disY : 0) + "px";
    }
    //重新计算height不在可视化区域内，top、height的值
    if (newHeight + top > canves.clientHeight) {
      if (canves.clientHeight - newHeight < 0) {
        domstyle.height = canves.clientHeight + "px";
        domstyle.top = 0 + "px";
      } else {
        domstyle.top = canves.clientHeight - newHeight + "px";
      }
    }
  };
  let up = () => {
    // this.$emit("resize");
    console.log(456);
    callback !== null ? callback() : false;
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
  };
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
}

/**
 * 获取point计算后样式
 * @param thisPro template的this
 * @param point  缩放dom对象标识："lt", "rt", "lb", "rb", "l", "r", "t", "b"
 * @returns {{}} 返回值类型
 */
export function getPointStyle(thisPro: any, point: any) {
  const pos = thisPro.defaultStyle;
  const height = pos.height.replace("px", "");
  const width = pos.width.replace("px", "");
  let hasT = /t/.test(point);
  let hasB = /b/.test(point);
  let hasL = /l/.test(point);
  let hasR = /r/.test(point);
  let newLeft = 0;
  let newTop = 0;
  if (point.length === 2) {
    newLeft = hasL ? 0 : width;
    newTop = hasT ? 0 : height;
  } else {
    // !#zh 上下点，宽度固定在中间
    if (hasT || hasB) {
      newLeft = width / 2;
      newTop = hasT ? 0 : height;
    }
    // !#zh 左右点，高度固定在中间
    if (hasL || hasR) {
      newLeft = hasL ? 0 : width;
      newTop = height / 2;
    }
  }
  const style = {
    marginLeft: hasL || hasR ? "-5px" : 0,
    marginTop: hasT || hasB ? "-5px" : 0,
    left: `${newLeft}` + "px",
    top: `${newTop}` + "px",
    cursor:
      point
        .split("")
        .reverse()
        .map((m: string | number) => thisPro.directionKey[m])
        .join("") + "-resize"
  };
  return style;
}
