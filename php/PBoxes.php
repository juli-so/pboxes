<?php
class PBoxes {
	private function __construct() {
		$this -> ret = [
			'code' => -1,
			'data' => '我书读得少，你不要骗我。',
		];
	}
	private static $instance;
	private $ret;
	private function finish() {
		Flight::json($this -> ret);
	}

  private function _checkFreq() {
		$last_ts = Session::get('timestamp');
		$cur_ts = $_SERVER['REQUEST_TIME'];
		if ($last_ts && $cur_ts - $last_ts < 3) {
			$this -> ret['data'] = '发送过于频繁，请先休息一下~';
			$this -> finish();
		}
		Session::set('timestamp', $cur_ts);
  }

	public static function __callStatic($name, $params) {
		if (!isset(self::$instance)) {
			$cls = __CLASS__;
			self::$instance = new $cls;
		}
		call_user_func_array(array(self::$instance, '_' . $name), $params);
	}

	public function _get($url, $limit = 100) {
		$db = Flight::db();
		$res = $db -> select('notes', [
			'id',
			'x',
			'y',
			'color',
			'text',
			'thumbs',
		], [
			'url' => $url,
			'LIMIT' => $limit,
			'ORDER' => 'id DESC',
		]);
		$list = [];
		foreach ($res as $r)
			$list[] = [
				'id' => (int) $r['id'],
				'x' => (float) $r['x'],
				'y' => (int) $r['y'],
				'color' => (int) $r['color'],
				'text' => $r['text'],
				'thumbs' => (int) $r['thumbs'],
			];
		$this -> ret['code'] = 0;
		$this -> ret['data'] = &$list;
		$this -> finish();
	}

	public function _add($url, $x, $y, $color, $text) {
    $this->_checkFreq();
		$x = number_format($x, 2, '.', '');	// percentage
		$y = number_format($y, 2, '.', '');	// pixels
		$color = (int) $color;
		if ($x < 0 || $x > 100 || $y < 0 || mb_strlen($text) < 4) self::finish();
		$db = Flight::db();
		$r = $db -> insert('notes', [
			'url' => $url,
			'x' => $x,
			'y' => $y,
			'color' => $color,
			'text' => $text,
			'ip' => Flight::request() -> ip,
		]);
		if ($r) {
			$this -> ret['code'] = 0;
			$this -> ret['data'] = $r;
		} else {
			$this -> ret['code'] = 1;
			$this -> ret['data'] = '添加失败！';
			// $db->error()[2];
		}
		$this -> finish();
	}

	public function _thumbUp($id) {
    $this->_checkFreq();
		$db = Flight::db();
		$r = $db -> update('notes', [
			'thumbs[+]' => 1,
		], [
			'id' => $id,
		]);
		$this -> ret['code'] = 0;
		$this -> ret['data'] = $r;
		$this -> finish();
	}
}
