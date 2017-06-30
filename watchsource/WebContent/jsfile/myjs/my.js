$(function() {
	var option = {
		width : 10,
		height : 20
	};
	var Tetris = function(option) {
		this.option = option;
		this.isStart = false;
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
		if (isStart) {
			this.keyPress();
			this.createBox();
		}
	};
	ext.keyPress = function() {
	};
	ext.createBox = function() {

		var that = this, height = that.option.height;

		var newBox = function(x, y) {
			var tar = $(`[tr-index="y"] [td-index="x"]`);
			tar.addClass("activeBox");
		}

		if (height == 0) {
			Window.clearInterval(code);
			that.createBox();
		} else {
			var code = setInterval(function() {
				newBox(height, 3)
				height--;
			}, 1000)
		}
	};
	/**
	 * 初始化
	 */
	(function() {
		var tetris = new Tetris(option);
		/**
		 * 开始游戏 按钮
		 */
		$("#startGame").click(function() {
			tetris.startGame();
		});

	})()
});