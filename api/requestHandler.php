<?php

$userTrackers = require 'trackers.php';
$allTrackers  = [];

foreach($userTrackers as $user => $trackers) {
  foreach($trackers as $key => $params) {
    $allTrackers[$user.$key] = $params;
  }
}

$resources = array(
    "coinlist"      => "http://www.cryptocoincharts.info/v2/api/listCoins",
    "markets"       => "https://api.bitcoinaverage.com/exchanges/USD",
);

if(isset($_GET['resource'])) {

  $request = $_GET['resource'];

  if(isset($resources[$request]))
      echo file_get_contents($resources[$request]);

} elseif(isset($_GET['trackersByUser'])) {

  $request = $_GET['trackersByUser'];

  if(isset($userTrackers[$request])) {
    $trackers = [];
    foreach($userTrackers[$request] as $key => $params) {
      unset($params['url']);
      $params['id'] = $request . $key;
      $trackers[] = (object) $params;
    }
    echo json_encode($trackers);
  }

} elseif(isset($_GET['trackerById'])) {

  $request = $_GET['trackerById'];

  if(isset($allTrackers[$request])) {
    $json = file_get_contents($allTrackers[$request]['url']);
    $contents = json_decode($json);
    echo json_encode($contents);
  }

}

?>
