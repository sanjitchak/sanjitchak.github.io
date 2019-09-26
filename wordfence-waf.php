<?php
// Before removing this file, please verify the PHP ini setting `auto_prepend_file` does not point to this.

// This file was the current value of auto_prepend_file during the Wordfence WAF installation (Thu, 10 Aug 2017 19:02:35 +0000)
if (file_exists('/hosting/public/prepend.php')) {
	include_once '/hosting/public/prepend.php';
}
if (file_exists('/hosting/www/techwinky.com/www/wp-content/plugins/wordfence/waf/bootstrap.php')) {
	define("WFWAF_LOG_PATH", '/hosting/www/techwinky.com/www/wp-content/wflogs/');
	include_once '/hosting/www/techwinky.com/www/wp-content/plugins/wordfence/waf/bootstrap.php';
}
?>