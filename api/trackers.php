<?php
/** Adding User Trackers:

    @index   A unique identifier for the tracker.
    @name   (optional) The display name for the coin. If unspecified, the coin name itself will be used by default
    @coinID The identifier for the coin as referenced at www.cryptocoincharts.info
    @url    The address of the tracker

    e.g.
    'jewmaster' => array(
       'coinID' => 'doge',
       'url'    => 'http://...'
       'name'   => 'Akay is a massive jew'
    )
    And yes mate, this file ain't shared!!
*/

return array(
    'captain' => array(

      'anc'  => array(
        'coinID' => 'anc',
        'url'    => "http://anc.coinpool.in/index.php?page=api&action=getuserstatus&api_key=a30da728af5733e9e520e86c57b3b202d4d05b2739e6696ce408c16054a8ef0a&id=3773"
      ),
      'doge' => array(
        'coinID' => 'doge',
        'url'    => "https://pool.dogechain.info/index.php?page=api&action=getuserstatus&api_key=a94f88ad26da4afd79134c29302b72e7bf24c72a5d36331fbda5271969295e93&id=34470"
      ),
      //'dogeOLD' => array(
      //  "coinID" => 'doge',
      //  'url'    => "https://doge.hashfaster.com/index.php?page=api&action=getuserstatus&api_key=062a3c5b93cc493066dd14a96601f1c55a9731e89d2d853c5b22b4a5362fba8c&id=6390"
      //),
      'wdc'  => array(
        'coinID' => 'wdc',
        'url'    => "https://wdc.nut2pools.com/index.php?page=api&action=getuserstatus&api_key=f34259378201e88d580d88f9df7f556baaaab4aa938d4c3c115a42636fd5d5cb&id=2290"
      )
    ),
    'ben' => array()
);

?>