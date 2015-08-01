<?php
class PBoxesBase {
	private function __construct() {
		$this->ret = [
			'code' => -1,
			'data' => '我书读得少，你不要骗我。',
		];
	}

  /**
   * Get db connection, MUST be overridden
   * @return a PDO object
   */
  protected static function pdo() {
    throw new Exception('Not implemented!');
  }

	private static $instance;
	private $ret;
	private function finish() {
    header('Content-Type: application/json');
		die(json_encode($this->ret));
	}

  private function _checkFreq() {
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $last_ts = isset($_SESSION['timestamp']) ? (int) $_SESSION['timestamp'] : 0;
    $cur_ts = $_SERVER['REQUEST_TIME'];
    if ($last_ts && $cur_ts - $last_ts < 3) {
      $this->ret['data'] = '发送过于频繁，请先休息一下~';
      $this->finish();
    }
    $_SESSION['timestamp'] = $cur_ts;
  }

  public static function __callStatic($name, $params) {
    if (!isset(self::$instance)) {
      $cls = get_called_class();
      self::$instance = new $cls;
    }
    call_user_func_array(array(self::$instance, '_' . $name), $params);
  }

  public function _get($url, $limit = 100) {
    $pdo = $this->pdo();
    $st = $pdo->prepare('SELECT id,x,y,color,text,thumbs FROM pboxes WHERE url=? ORDER BY id DESC LIMIT ?');
    $st->execute([$url, $limit]);
    $res = $st->fetchAll(PDO::FETCH_ASSOC);
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
    $this->ret['code'] = 0;
    $this->ret['data'] = &$list;
    $this->finish();
  }

  public function _add($url, $x, $y, $color, $text) {
    $this->_checkFreq();
    $x = number_format($x, 2, '.', ''); // percentage
    $y = number_format($y, 2, '.', ''); // pixels
    $color = (int) $color;
    if ($x < 0 || $x > 100 || $y < 0 || mb_strlen($text) < 4) $this->finish();
    $pdo = $this->pdo();
    $st = $pdo->prepare('INSERT INTO pboxes (url,x,y,color,text,ip) VALUES(?,?,?,?,?,?)');
    $r = $st->execute([$url, $x, $y, $color, $text, $_SERVER['REMOTE_ADDR']]);
    if ($r) {
      $this->ret['code'] = 0;
      $this->ret['data'] = $r;
    } else {
      $this->ret['code'] = 1;
      $this->ret['data'] = '添加失败！';
      // $st->errorInfo()[2];
    }
    $this->finish();
  }

  public function _thumbUp($id) {
    $this->_checkFreq();
    $pdo = $this->pdo();
    $st = $pdo->prepare('UPDATE pboxes SET thumbs=thumbs+1 WHERE id=?');
    $r = $st->execute([$id]);
    $this->ret['code'] = 0;
    $this->ret['data'] = $r;
    $this->finish();
  }
}
