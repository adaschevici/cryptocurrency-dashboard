<?php
/** Adding User Trackers:

    @index   A unique identifier for the tracker.
    @name   (optional) The display name for the coin. If unspecified, the coin name itself will be used by default
    @coinID The identifier for the coin as referenced at www.cryptocoincharts.info
    @user   The url of your personal tracker
    @pool   The pool url

    e.g.
    'jewmaster' => array(
       'coinID' => 'doge',
       'name'   => 'Akay is a massive jew'
       'user'   => 'http://...'
       'pool'   => 'http://...'
    )
    And yes mate, this file ain't shared!!
*/

return array(
    'captain' => array(

      'anc'  => array(
        'coinID' => 'anc',
        'user'   => "http://anc.coinpool.in/index.php?page=api&action=getuserstatus&api_key=a30da728af5733e9e520e86c57b3b202d4d05b2739e6696ce408c16054a8ef0a&id=3773",
        'pool'   => "http://anc.coinpool.in/index.php?page=api&action=getpoolstatus&api_key=a30da728af5733e9e520e86c57b3b202d4d05b2739e6696ce408c16054a8ef0a"
      ),
      'doge' => array(
        'coinID' => 'doge',
        'user'   => "https://pool.dogechain.info/index.php?page=api&action=getuserstatus&api_key=a94f88ad26da4afd79134c29302b72e7bf24c72a5d36331fbda5271969295e93&id=34470",
        'pool'   => "https://pool.dogechain.info/index.php?page=api&action=getpoolstatus&api_key=a94f88ad26da4afd79134c29302b72e7bf24c72a5d36331fbda5271969295e93"
      ),
      'wdc'  => array(
        'coinID' => 'wdc',
        'user'   => "https://wdc.nut2pools.com/index.php?page=api&action=getuserstatus&api_key=f34259378201e88d580d88f9df7f556baaaab4aa938d4c3c115a42636fd5d5cb&id=2290",
        'pool'   => "https://wdc.nut2pools.com/index.php?page=api&action=getpoolstatus&api_key=f34259378201e88d580d88f9df7f556baaaab4aa938d4c3c115a42636fd5d5cb"
      )
    ),

    'ben' => array()
);

?>