<?php
require __dir__.'/PBoxes.php';
PBoxes::add(
  $_REQUEST['url'],
  $_REQUEST['x'],
  $_REQUEST['y'],
  $_REQUEST['color'],
  $_REQUEST['text']
);
