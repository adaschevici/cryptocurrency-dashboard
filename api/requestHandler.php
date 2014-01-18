<?php


function curlRequest($url) {
  //  Initiate curl
  $ch = curl_init();
  // Disable SSL verification
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  // Will return the response, if false it print the response
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  // Set the url
  curl_setopt($ch, CURLOPT_URL,$url);
  // Execute
  return curl_exec($ch);
}

$userTrackers = require 'trackers.php';
$allTrackers  = array();

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
      echo curlRequest($resources[$request]);

} elseif(isset($_GET['trackersByUser'])) {

  $request = $_GET['trackersByUser'];

  if(isset($userTrackers[$request])) {
    $trackers = array();
    foreach($userTrackers[$request] as $key => $params) {
      $params['id'] = $request . $key;
      $params['hasPool'] = isset($params['pool']);
      unset($params['user'], $params['pool']);
      $trackers[] = (object) $params;
    }
    echo json_encode($trackers);
  }

} elseif(isset($_GET['trackerById'])) {

  $request = $_GET['trackerById'];

  if(isset($allTrackers[$request])) {
    echo curlRequest($allTrackers[$request]['user']);
  }

} elseif(isset($_GET['poolById'])) {

  $request = $_GET['poolById'];

  if(isset($allTrackers[$request])) {
    echo curlRequest($allTrackers[$request]['pool']);
  }

}

?>
