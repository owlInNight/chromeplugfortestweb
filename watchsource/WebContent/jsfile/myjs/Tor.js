function Tor(option) {
    this.option = $.fn.extend({}, Tor.DEFAULT_OPTION, option);
    // 右侧窗口
    this.torWindw = null;
    // 右侧窗口内的table
    this.torWindwTable = null;
    // 左侧控制窗口
    this.controlWindow = null;
    // 开始标记
    this.isStart = false;
    // 当前的按钮
    this.currentBox = null;
    // 获取中间列 用于 下降方块用
    this.middleLineNumber = Tor.getMiddleLine(this.option.line_number);

    this.init();
}
/**
 * 方块类
 * 
 * @param x
 *            第一次创建 时候的位置
 * @param y
 * @param type
 *            类型 ,
 * @returns
 */
function Box(x, y, type) {
    this.boxsPoint = null;
    this.x = x;
    this.y = y;
    this.type = type;
    this.isDone = false;
    this.init();
}
Box.select = function(x, y) {
    return $(`[y=${y}][x="${x}"]`);
}
// 获取最大值
Box.getMax = function(x,y){
	return x>y?x:y;
}
//找到最小值
Box.getMin = function(x,y){
	return x<y?x:y;
}
var boxExtend = Box.prototype;

/**
 * 初始化方块,
 */
boxExtend.init = function() {
    var that = this;
    var boxsPoint = that.boxsPoint = [{
        "x": that.x,
        "y": that.y
    }];
    switch (that.type) {
        // 一字型
    case 0:
        boxsPoint.push({
            "x": that.x + 1,
            "y": that.y,
        });
        boxsPoint.push({
            "x": that.x + 2,
            "y": that.y
        });
        boxsPoint.push({
            "x": that.x + 3,
            "y": that.y
        });
        break;
    case 1:
        boxsPoint.push({
            "x": that.x,
            "y": that.y - 1
        });
        boxsPoint.push({
            "x": that.x,
            "y": that.y - 2
        });
        boxsPoint.push({
            "x": that.x,
            "y": that.y - 3
        });
        boxsPoint.push({
            "x": that.x + 1,
            "y": that.y
        });
        boxsPoint.push({
            "x": that.x + 2,
            "y": that.y
        });
        break;
    }
    that.set();
}

/**
 * 设置方块
 */
boxExtend.set = function(vertical, horizontal) {
    var that = this;
    var boxsPoint = [];
    var horizontalIsMove =false;  // 是否下沉了
    var verticalIsMove = false; // 是否左右移动了
    var maxValueY;  // 最底部的
    var maxValueX_left;  // 最左边的
    var maxValueX_right ; //最右边的
    //底部边界
    var isDone = false;
  //左边边界
    var isLeftDone = false;
    //右边边界
    var isRightDone = false;
    
    function setPoint(old, tar) {
        if (!isNaN(tar)) {
            return old + tar;
        } else {
            return old;
        }
    }
    $.each(that.boxsPoint, function(key, value) {
        boxsPoint[key] = {
            'x': setPoint(value['x'], vertical),
            'y': setPoint(value['y'], horizontal)
        };
        var newValue = boxsPoint[key];
        if(newValue['x'] != value['x']){
        	verticalIsMove = true;
        }
        if(newValue['y'] != value['y']){
        	horizontalIsMove = true;
        }
    });
    $.each(boxsPoint, function(key, value) {
            maxValueY =Box.getMax(maxValueY,value['y']);
            maxValueX_left = Box.getMin(maxValueX_left,value['x']);
            maxValueX_right = Box.getMax(maxValueX_right,value['x']);
    });
    if (horizontalIsMove) {
        $.each(boxsPoint, function(key, value) {
        	// 判断下面是不是已经有方块了
            if (value['y'] == maxValueY) {
                var res = Box.select(value['x'], value['y']).attr("class");
                if (res) {
                    that.isDone = true;
                }
            }
            // 判断左右两边是不是有方块了
        })
    }
   if(verticalIsMove){
	   $.map(boxsPoint,function(selfBox){
		   
	   });
	   
   }
    if (!that.isDone) {
        $.each(that.boxsPoint, function(key, value) {
            Box.select(value['x'], value['y']).removeAttr("class");
        });
        $.each(boxsPoint, function(key, value) {
            Box.select(value['x'], value['y']).attr("class", "activeBox");
        });
        that.boxsPoint = boxsPoint;
    }
}

/**
 * 默认的配置
 */
Tor.DEFAULT_OPTION = {
    panel: '#Tor',
    column_number: 20,
    line_number: 30,
    left_width: "80px",
    min_column_number: 17,
    min_line_number: 20,
    speed: 200
};
Tor.createTable = function(column_number, line_number) {
    tr = "";
    for (var i = 0; i < column_number; i++) {
        var td = "";
        for (var j = 0; j < line_number; j++) {
            td += `<td x="${j}" y="${i}" td-index="${j}"></td>`;
        }
        tr += `<tr tr-index="${i}">${td}</tr>`;
    }
    return table = `<table>${tr}</table>`;
}

Tor.getMiddleLine = function(line_number) {
    return parseInt(line_number / 2);
}
/**
 * 初始化
 */
Tor.prototype.init = function() {
    // 面板元素
    this.initPanel();
    // 方块 运行窗口
    this.initTorWindw();
    // 预览窗口
    this.initPerviewWindow();
    // 初始化按钮
    this.initButton();
    // 添加列
    this.bindAddC();
    // 减少列
    this.bindCutC();
    // 添加行
    this.bindAddL();
    // 减少行
    this.bindCutL();
    // 开始
    this.bindStart();
    // 操作按钮
    this.bindKey();
}
/**
 * 面板
 */
Tor.prototype.initPanel = function() {
    this.panel = $(this.option.panel);
    // 添加左侧的菜单和 右侧的窗口
    this.panel.append(`<div class="left"></div><div class="right mainWindow"></div>`)
    this.torWindw = this.panel.find('.right');
    this.controlWindow = this.panel.find(".left");
}
/**
 * 游戏窗口
 * 
 * @param column_number
 *            列数
 * @param line_number
 *            行数
 */
Tor.prototype.initTorWindw = function(column_number, line_number) {
    var that = this
      , option = that.option
      , width = column_number || option.column_number
      , height = line_number || option.line_number
      , rightDiv = that.panel.find('.right');

    rightDiv.html(Tor.createTable(width, height));
    that.torWindwTable = rightDiv.find('table');
    that.setLeftHight();
}

Tor.prototype.setLeftHight = function() {
    var that = this;
    var height = that.torWindw.height();
    var width = that.option.left_width;
    that.controlWindow.attr('style', `width:${width}; height:${height}px;`)
}

Tor.prototype.initPerviewWindow = function() {
    var that = this
      , left = that.controlWindow;
    left.append(`<fieldset>
				${Tor.createTable(4, 4)}
				</fieldset>`);
}

/**
 * 开始的方法
 */
Tor.prototype.startGame = function() {
    var that = this;
    that.isStart = true;
    var option = that.option;
    var speed = option.speed;
    var width = parseInt(option.line_number / 2);
    var hight = 0;
    var box;
    setInterval(function() {
        if (hight == 0) {
            that.currentBox = box = new Box(width,hight,1);
            hight++;
        } else if (hight > 0 && hight < option.column_number) {
            box.set(null, 1);
            // 下面是否已经有了方块了 ,如果没有就继续下降 , 如果有了 ,就重新的开始循环
            if (!box.isDone) {
                hight++;
            } else {
                hight = 0;
            }
        } else {
            hight = 0;
        }
    }, speed);
}

/**
 * 按钮
 */
Tor.prototype.initButton = function() {
    var that = this
      , left = that.controlWindow
      , button = ['start', 'speed', 'stop', 'push', 'addc', 'cutc', 'addl', 'cutl', ];
    function createButton() {
        var buttons = "";
        for (var i in button) {
            var cb = button[i]
            buttons += `<button button="${cb}">${cb}</button>`
            button[i] = {
                name: cb,
                selector: `[button='${cb}']`
            };
        }
        return buttons;
    }
    left.append(`<fieldset>
					${createButton()}
				</fieldset>`);
    $.each(button, function(key, value) {
        that["button_" + value.name] = $(value.selector);
    });

}
/**
 * 添加行
 */
Tor.prototype.bindAddC = function() {
    var that = this;
    that.button_addc.click(function() {
        that.option.column_number += 1;
        that.initTorWindw();
    });
}
/**
 * 减少行
 */
Tor.prototype.bindCutC = function() {
    var that = this;
    that.button_cutc.click(function() {
        // 设置最小值
        if (that.option.column_number >= 17) {
            that.option.column_number -= 1;
            that.initTorWindw();
        }
    });
}
/**
 * 添加行
 */
Tor.prototype.bindCutC = function() {
    var that = this;
    that.button_cutc.click(function() {
        // 设置最小值
        if (that.option.column_number >= that.option.min_column_number) {
            that.option.column_number -= 1;
            that.initTorWindw();
        }
    });
}
/**
 * 添加列
 */
Tor.prototype.bindAddL = function() {
    var that = this;
    that.button_addl.click(function() {
        // 设置最小值
        that.option.line_number += 1;
        that.middleLineNumber = Tor.getMiddleLine(that.option.line_number)
        that.initTorWindw();
    });
}
;
/**
 * 减少列
 */
Tor.prototype.bindCutL = function() {
    var that = this;
    that.button_cutl.click(function() {
        // 设置最小值
        if (that.option.line_number >= that.option.min_line_number) {
            that.option.line_number -= 1;
            that.middleLineNumber = Tor.getMiddleLine(that.option.line_number)
            that.initTorWindw();
        }
    });

}
;
/**
 * 绑定开始按钮
 */
Tor.prototype.bindStart = function() {
    var that = this;
    that.button_start.click(function() {
        that.startGame();
    });
}

Tor.prototype.bindKey = function() {
    var that = this;
    $(window).keypress(function(e) {
        switch (e.keyCode) {
            // w
        case 119:
            break;
            // a
        case 97:
            that.currentBox.set(-1, null);
            break;
            // s
        case 115:
            break;
            // d
        case 100:
        	 that.currentBox.set(1, null);
            break;
        default:
            break;
        }
    });
}
