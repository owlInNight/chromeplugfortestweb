var wi = this;

$(function() {
	var Tetris = function(option) {
		this.option = option;
		this.isStart = false;
		this.currentBox;
		this.currentHeight;
		// 窗口元素
		var body = this.window = $('[data-toggle="Tetris"]');
		// 初始化方法
		this.init();
	}
	var ext = Tetris.prototype;
	ext.init = function() {
		this.initWindow();
	};
	// 主窗口
	ext.initWindow = function() {
		var that = this, option = that.option;
		/**
		 * 创建 窗体的格子
		 */
		var createMainWindow = function(width, height) {
			var tr = "";
			for (var i = 0; i < height; i++) {
				var td = "";
				for (var j = 0; j < width; j++) {
					td += `<td td-index="${j}" ></td>`;
				}
				tr += `<tr tr-index="${i}">${td}</tr>`;
			}
			return `<table >${tr} </table>`;
		}
		that.window.append(createMainWindow(option.width, option.height));
	};
	/**
	 * 开始游戏
	 */
	ext.startGame = function() {
		this.isStart = true;
		if (this.isStart) {
			this.keyPress();
			this.createBox();
		}
	};
	ext.keyPress = function() {
		var that = this;

		$(wi).keypress(function(e) {
			switch (e.keyCode) {
			// w
			case 119:

				break;
			// a
			case 97:
				var x = that.currentBox.x - 1;
				if (x >= 0) {
					that.currentBox.set(x, null);
				}
				break;
			// s
			case 115:
				that.currentHeight--;
				if (that.currentHeight < that.option.height) {
					that.currentBox.set(null, that.currentHeight);
				}
				break;
			// d
			case 100:
				var x = that.currentBox.x + 1;
				if (x < that.option.width) {
					that.currentBox.set(x, null);
				}
				break;
			}
		})
	};
	ext.createBox = function() {

		var that = this, option = that.option, box;
		that.currentHeight = option.height;
		// 移动的方块
		var newBox = function(y, x) {
			this.y = y;
			this.x = x;
			this.init();

		}
		var boxExtend = newBox.prototype;

		boxExtend.select = function() {
			var that = this, select = `[tr-index="${option.height - that.y}"] [td-index="${that.x}"]`;
			this.target = $(select);
		}
		boxExtend.init = function() {
			var that = this;
			that.select();
			that.set(that.x, that.y);
		};

		boxExtend.set = function(vertical, horizontal) {
			var that = this, target = that.target;
			if (vertical || vertical == 0) {
				that.x = vertical;
			}
			if (horizontal || horizontal == 0) {
				that.y = horizontal;
			}
			that.target.removeAttr('class');
			that.select();
			that.target.attr('class', "activeBox");
		};

		var code = setInterval(function() {
			// 下落的过程中
			if (that.currentHeight > 0 && option.height != that.currentHeight) {
				box.set(null, that.currentHeight);
				that.currentHddeight--;

				// 开始的时候
			} else if (option.height == that.currentHeight) {
				that.currentBox = box = new newBox(that.currentHeight, 3)
				that.currentHeight--;
				// 落到底的时候
			} else {
				that.currentHeight = that.option.height;
			}
		}, that.option.speed)
		/*
		 * if (height == 0) { Window.clearInterval(code); that.createBox(); }
		 * else {}
		 */
	};
	/**
	 * 初始化
	 */
	(function() {
		var option = {
			// 格子 横行数量
			width : 10,
			// 格子竖行数量
			height : 20,
			// 下落速度
			speed : 1000
		};
		var tetris = new Tetris(option);
		/**
		 * 开始游戏 按钮
		 */
		$("#startGame").click(function() {
			tetris.startGame();
		});
		$("#addSpeed").click(function() {
			tetris.option.speed += 100;
		});

	})()
});
