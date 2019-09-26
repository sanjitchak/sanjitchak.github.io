<?php
/*
 * Theme function file.
 */
if ( ! function_exists( 'medium_setup' ) ) :
function medium_setup() {
	
	global $content_width;
	if ( ! isset( $content_width ) ) {
		$content_width = 770;
	}
	/*
	 * Make medium theme available for translation.
	 */
	load_theme_textdomain( 'medium' );
	// Add RSS feed links to <head> for posts and comments.
	add_theme_support( 'automatic-feed-links' );	
	// This theme styles the visual editor to resemble the theme style.
	add_editor_style( array( 'css/editor-style.css', medium_font_url() ) );
	
	add_theme_support( 'automatic-feed-links' );
	
	// This theme uses wp_nav_menu() in two locations.
	add_theme_support( 'post-thumbnails' );
	set_post_thumbnail_size( 672, 372, true );
	add_image_size( 'medium-blog-big', 570, 350, true );
	add_image_size( 'medium-blog-small', 400, 350, true );

	// This theme uses wp_nav_menu() in two locations.
	register_nav_menus( array(
		'primary'   => __( 'Header Menu', 'medium' ),
	) );
	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form', 'comment-form', 'comment-list',
	) );
	add_theme_support( 'custom-background', apply_filters( 'medium_custom_background_args', array(
	'default-color' => 'f5f5f5',
	) ) );
	// Add support for featured content.
	add_theme_support( 'featured-content', array(
		'featured_content_filter' => 'medium_get_featured_posts',
		'max_posts' => 6,
	) );

	add_theme_support( 'custom-logo', array(
            'height'      => 220,
            'width'       => 120,
            'flex-height' => true,
            'flex-width'  => true,
            'priority'    => 11,
            'header-text' => array( 'site-title', 'site-description' ), 
        ) );
	add_theme_support( "title-tag" );
	// This theme uses its own gallery styles.
	add_filter( 'use_default_gallery_style', '__return_false' );
}

endif; // medium_setup
add_action( 'after_setup_theme', 'medium_setup' );



/*
 * thumbnail list
*/ 
function medium_thumbnail_image($content) {
    if( has_post_thumbnail() )
         return the_post_thumbnail( 'thumbnail' ); 
}
/*
 * Function for medium theme title.
 */
function medium_wp_title( $title, $sep ) {
	global $paged, $page;

	if ( is_feed() ) {
		return $title;
	}

	// Add the site name.
	$title .= get_bloginfo( 'name', 'display' );

	// Add the site description for the home/front page.
	$medium_site_description = get_bloginfo( 'description', 'display' );
	if ( $medium_site_description && ( is_home() || is_front_page() ) ) {
		$title = "$title $sep $medium_site_description";
	}

	// Add a page number if necessary.
	if ( $paged >= 2 || $page >= 2 ) {
		$title = "$title $sep " . sprintf(/* translators: %s is paged count.*/ __( 'Page %s', 'medium' ), max( $paged, $page ) );
	}

	return $title;
}
add_filter( 'wp_title', 'medium_wp_title', 10, 2 );

/**
 * Register Lato Google font for medium.
 */
function medium_font_url() {
	$medium_font_url = '';
	/*
	 * Translators: If there are characters in your language that are not supported
	 * by Lato, translate this to 'off'. Do not translate into your own language.
	 */
	if ( 'off' !== _x( 'on', 'Istok Web: on or off', 'medium' ) ) {
		$medium_font_url = add_query_arg( 'family', urlencode( 'Lato:300,400,700,900,300italic,400italic,700italic' ), "//fonts.googleapis.com/css" );
	}
	return $medium_font_url;
}

function medium_scripts() {
	
	global $medium_options;
	wp_enqueue_style('google-font-opensans','//fonts.googleapis.com/css?family=Open+Sans', array());
	wp_enqueue_style('google-font-Raleway','//fonts.googleapis.com/css?family=Raleway', array());
	wp_enqueue_style( 'bootstrap', get_stylesheet_directory_uri().'/css/bootstrap.css' );
	wp_enqueue_style( 'font-awesome', get_stylesheet_directory_uri().'/css/font-awesome.css' );
	
	medium_custom_css();

	wp_enqueue_style( 'medium-theme', get_stylesheet_directory_uri().'/css/theme.css' );	
	wp_enqueue_style( 'medium-media', get_stylesheet_directory_uri().'/css/media.css' );        
	
	wp_enqueue_script( 'bootstrap', get_template_directory_uri() . '/js/bootstrap.js', array('jquery'), '' );	        
	wp_enqueue_script( 'enscroll', get_template_directory_uri() . '/js/enscroll.js', array('jquery'), '0.6.0' );
        wp_enqueue_script( 'medium-default', get_template_directory_uri() . '/js/default.js', array('jquery'), '1.0' );
        
        
        wp_localize_script( 'medium-default', 'admin_url', admin_url( 'admin-ajax.php'));

    
	
	if(isset($_SERVER['HTTP_USER_AGENT']) && preg_match('/(?i)msie [1-8]/',sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT']))))
	{
	    // if IE<=8
	    wp_enqueue_script('medium-respond', get_stylesheet_directory_uri() . '/js/respond.js',array('jquery'), '', true );
	    wp_enqueue_script('medium-html5shiv', get_stylesheet_directory_uri() . '/js/html5shiv.js',array('jquery'), '', true );
	}
	
	if ( is_singular() ) wp_enqueue_script( 'comment-reply' );
     

}
add_action( 'wp_enqueue_scripts', 'medium_scripts');

/* Custom search */
function medium_search_ajax(){	
	$medium_keyword = (isset($_POST['text']))?sanitize_text_field(wp_unslash($_POST['text'])):'';
	$medium_args_search = array(
		's'	=>	$medium_keyword,
		'post_status' => 'publish',
		'post_type'	=>	'post',
		'post_per_page'	=>	8
	);
	$medium_query = new WP_Query($medium_args_search);
	$medium_result='';
	$medium_error='';
	if($medium_query->have_posts()){		
		while($medium_query->have_posts()){
			$medium_query->the_post();			
                        $medium_featured_image = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), 'medium-blog-small',0 );
			$medium_result .= '<div class="col-md-4 search-box" >';
                        if(!empty($medium_featured_image))
                        $medium_result .= '<a href="'.get_permalink(get_the_ID()).'"><img class="img-responsive" src="'.esc_url($medium_featured_image[0]).'" alt="'.esc_attr(get_the_title()).'"></a>';
			$medium_result .= '<div class="image-sub"><a href="'.get_permalink(get_the_ID()).'">'.get_the_title().'</a></div>
				<div class="post-arthur"><a class="privacy" href="'.get_author_posts_url( get_the_author_meta( 'ID' ) ).'">'.get_the_author().'</a></div>
			  </div>';
		}
	}
	else
		$medium_error.=esc_html__('Not found','medium');
		
	echo json_encode(array("medium_result"=>$medium_result,"medium_error"=>$medium_error));
	die;
}
add_action('wp_ajax_nopriv_medium_search_ajax', 'medium_search_ajax');
add_action('wp_ajax_medium_search_ajax', 'medium_search_ajax');




/*
 * medium Set up post entry meta.
 *
 * Meta information for current post: categories, tags, permalink, author, and date.
 */
function medium_entry_meta() {
	
	$medium_category_list = "";
	$medium_category_list=get_the_category_list();
	if(!empty($medium_category_list))
		$medium_category_list = '<li><i class="fa fa-folder-open"></i>'.get_the_category_list(', ').'</li>';

	$medium_tag_list = "";
	$medium_tag_list=get_the_tag_list();
	if(!empty($medium_tag_list))
		$medium_tag_list = get_the_tag_list('<li> <i class="fa fa-tags"></i> ',', ','</li>');

	$medium_date = sprintf( '<li><i class="fa fa-calendar"></i> %1$s</li>',
		esc_html( get_the_date('M d, Y') )
	);
	$medium_author = sprintf( '<li><i class="fa fa-user"></i> <a href="%1$s" title="%2$s" >%3$s</a></li>',
		esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ),
		esc_attr( sprintf(/* translators: %s is author name*/ esc_html__( 'View all posts by %s', 'medium' ), get_the_author() ) ),
		get_the_author()
	);
	if(comments_open()) { 
		if(get_comments_number()>=1)
			$medium_comments = '<li><i class="fa fa-comment"></i>'.get_comments_number().'</li>';
		else
			$medium_comments = '';
	} else {
		$medium_comments = '';
	}
	printf('%1$s %2$s %3$s %4$s %5$s',
		$medium_author,
		$medium_category_list,
		$medium_date,		
		$medium_comments,
		$medium_tag_list
	);
}



/**
 * Template for comments and pingbacks.
 *
 * To override this walker in a child theme without modifying the comments template
 * simply create your own medium_comment(), and that function will be used instead.
 *
 * Used as a callback by wp_list_comments() for displaying the comments.
 *
 */
 if ( ! function_exists( 'medium_comment' ) ) :
function medium_comment( $comment, $args, $depth ) {	
	switch ( $comment->comment_type ) :
		case 'pingback' :
		case 'trackback' :
		// Display trackbacks differently than normal comments.
			?>
			<li <?php comment_class(); ?> id="comment-<?php comment_ID(); ?>">
				<p>
				<?php esc_html_e( 'Pingback:', 'medium' ); ?>
				<?php comment_author_link(); ?>
				<?php edit_comment_link( __( '(Edit)', 'medium' ), '<span class="edit-link">', '</span>' ); ?>
				</p>
			</li>
			<?php
			break;
		default :
		// Proceed with normal comments.
		if($comment->comment_approved==1)
		{
			global $post; ?>
			<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>">
			<article id="comment-<?php comment_ID(); ?>">
			<figure class="comment-author"><?php echo wp_kses_post(get_avatar( get_the_author_meta('ID'), '41')); ?></figure>
			<div class="comment-content">
				<div class="comment-metadata">
           <?php
		   		printf( '%1$s ',get_comment_author_link(),( $comment->user_id === $post->post_author ) ? '<span>' . esc_html__( 'Post author ', 'medium' ) . '</span>' : '');
				printf( /*translators: 1 is commnet date.*/ esc_html(' %s '),esc_html(get_comment_date()));
				
				echo comment_reply_link( array_merge( $args, array( 'reply_text' => __( 'Reply', 'medium' ), 'after' => '', 'depth' => $depth, 'max_depth' => $args['max_depth'] ) ));
				
				?></div>
                <div class="comment-content-main">
                <?php comment_text(); ?>
                </div>
		  <!-- .comment-content --> 
			</div>
			</article>
            </li>
	  <!-- #comment-## -->
	  <?php
			}
		break;
	endswitch; // end comment_type check
}
endif;
//medium_comment();



/*************** Customizer option ***********************/
require get_template_directory() . '/functions/theme-customizer.php';
/*** Custom Header ***/
require get_template_directory() . '/functions/custom-header.php';
/*** TGM Class***/
require get_template_directory() . '/functions/class-tgm-plugin-activation.php';
/*** TGM ***/
require get_template_directory() . '/functions/tgm-plugins.php';