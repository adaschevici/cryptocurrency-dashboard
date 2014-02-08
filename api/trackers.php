<?php
/** Adding User Trackers:

    Create a 'my_trackers.php' file and return an array as per the following:

    @user   A unique identifier for the tracker.
    @name   (optional) The display name for the coin. If unspecified, the coin name itself will be used by default
    @coinID The identifier for the coin as referenced at www.cryptocoincharts.info
    @user   The url of your personal tracker
    @pool   The pool url

    e.g.
    return array(
      'user' => array(
         'coinID' => 'doge',
         'name'   => 'DogeCoin, bitches!'
         'user'   => 'http://...'
         'pool'   => 'http://...'
      )
    );
*/
return require 'my_trackers.php';
?>