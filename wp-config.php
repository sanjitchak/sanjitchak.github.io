<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('WP_CACHE', true); //Added by WP-Cache Manager
define( 'WPCACHEHOME', '/hosting/www/techwinky.com/www/wp-content/plugins/wp-super-cache/' ); //Added by WP-Cache Manager
define('DB_NAME', 'techwinkycom1');

/** MySQL database username */
define('DB_USER', 'techwinky.com');

/** MySQL database password */
define('DB_PASSWORD', 'q53EsZ7x');

/** MySQL hostname */
define('DB_HOST', '127.0.0.1');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'B}=+Co5VH^jM!bFd$3=O,[4e<-?K;ngp^BM:?B71LRpb_9s5e%5uKGY]9#38ukFA');
define('SECURE_AUTH_KEY',  ']@xtv-4ssm9<%IjKve ?swVxfT1xCJ(Y_OqiJq,{WfeEB#bG^`H ~j:msK?_}{:8');
define('LOGGED_IN_KEY',    'd3w6wx$O^2Eb5@=-^6K+o+x$$!ll#s[XT_Ga^3cRWrDslhR8W^D(]vYptH<{lh-x');
define('NONCE_KEY',        'h4ZuD{@$;0(EXeEJtHdmZ):Zb,{OUDFuyt@~temoP#>P&cQkK7nF,/0mu=yGa0nI');
define('AUTH_SALT',        '#u!^<`]qC![mPTg. I{@wuHk~-3jYZ.kc9nL&F?etQ,}tnb:WnXLYZQ08rDYNhAp');
define('SECURE_AUTH_SALT', '5tO,sT@YqcJk.Y6{`b,kof~PoftZQ0>y%bz-G:c3UAMZZ(5k]Rqc[lu_&*wo/,4(');
define('LOGGED_IN_SALT',   'I,NppukS@@0_8+{Akg0[0(qqEdkMWbB]|mGMi!U&H@Ci6:f+*YRr2W:;LhHce29A');
define('NONCE_SALT',       'z2+ari6yi#&-ZG?qe#}TA iv764+p!oSgdWySj8,h=!^4/y}R{$=xX`_1&Qv{&.L');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_mts';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
