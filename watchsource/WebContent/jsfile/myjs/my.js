$(function() {
	
	
	var options = {};

	var tor = new Tor(options);
	/**
	 * 加速
	 */
	$('#addSpeed').click(function() {
		tor.addSpeed();
	});
	/**
	 * 开始
	 */
	$('#startGame').click(function() {
		tor.startGame();
	});
	/**
	 * 结束
	 */
	$('#stopGame').click(function() {
		tor.stopGame();
	});
	/**
	 * 暂停
	 */
	$('#push').click(function() {
		tor.push();
	});
})