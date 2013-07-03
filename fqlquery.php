<?php
  $app_id = '525949284135240';
  $app_secret = 'afdba512eb5096fceed02483176a5d06';
  $my_url = 'http://www.pkbarlow.com/FacebookMap/index.php';

  $code = $_REQUEST["code"];
 

    
 // auth user
 if(empty($code)) {
    $dialog_url = 'https://www.facebook.com/dialog/oauth?client_id=' 
    . $app_id . '&redirect_uri=' . urlencode($my_url) ;
    echo("<script>top.location.href='" . $dialog_url . "'</script>");
  }

  // get user access_token
  $token_url = 'https://graph.facebook.com/oauth/access_token?client_id='
    . $app_id . '&redirect_uri=' . urlencode($my_url) 
    . '&client_secret=' . $app_secret
    . '&code=' . $code;

  // response is of the format "access_token=AAAC..."
  $access_token = substr(file_get_contents($token_url), 13);
  
  
  /*
  // run fql query
  $fbquery = 'fql?q=SELECT+first_name,last_name,pic_square,current_location,hometown_location,current_address,locale+FROM+user+WHERE+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1=me())';
  $fql_query_url = 'https://graph.facebook.com/'
    . $fbquery
    . '&access_token=' . $access_token;
  $fql_query_result = file_get_contents($fql_query_url);
  $fql_query_obj = json_decode($fql_query_result, true);
    
  
  
  // display results of fql query
  echo '<pre>';
  print_r("query results:");
  print_r($fql_query_obj);
  echo '</pre>';
  
  */
  
  // run fql multiquery
  $fql_multiquery_url = 'https://graph.facebook.com/'
    . 'fql?q={"all+friends":"SELECT+first_name,last_name,pic_square,current_location,hometown_location,current_address,locale+FROM+user+WHERE+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1=me())",'
    . '"my+name":"SELECT+first_name,last_name,current_location,hometown_location+FROM+user+WHERE+uid=me()"}'
    . '&access_token=' . $access_token;
  $fql_multiquery_result = file_get_contents($fql_multiquery_url);

  $fql_multiquery_obj = json_decode($fql_multiquery_result, true);


  
  
  
  $jsonData = '<script>';
  $jsonData .= 'var facobj =';
  $jsonData .= json_encode($fql_multiquery_obj, true);
  $jsonData .= '</script>';
 
?>