<?php
/*
 * Header For medium Theme.
 */ ?>
 <!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) & !(IE 8)]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">	
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<!--header strat-->
   <header class="home-header">
       <div class="col-md-3 col-sm-3 col-xs-3 ">
        <?php if(get_header_image()){ ?>
      <img src="<?php header_image(); ?>" width="<?php echo esc_attr(get_custom_header()->width); ?>" height="<?php echo esc_attr(get_custom_header()->height); ?>" class="medium-custom-header" alt="" />
      <?php } ?>
           <a href="javascript:void(0);" id="menu-trigger" class="fa fa-bars"></a>
        </div>   
          	<div class="header-menu scrollbar">
	          <div class="menu-column">
		         <?php
        			$medium_args = array(
        					'theme_location'  => 'primary',					
        					'echo'            => true,
        					'fallback_cb'     => 'wp_page_menu',
        					'items_wrap'      => '<ul>%3$s</ul>',
        					'depth'           => 0,
        					);
			       wp_nav_menu($medium_args); ?>
	          </div>
	      </div>
          <div class="col-md-6 col-sm-6 col-xs-6 header-logo">
              <div class="site-title">
              <?php $medium_options = get_option( 'medium_theme_options' );
              if(has_custom_logo()){
                  the_custom_logo();            
              }
               if (display_header_text()==true){ ?>                
                <a href="<?php echo esc_url(home_url('/')); ?>" rel="home" id='brand' ><?php echo esc_html( get_bloginfo( 'name' ) ); ?></a><a href="<?php echo esc_url(home_url('/')); ?>" rel="home" id='brand' ><h6 class="site-description"><?php echo esc_html( get_bloginfo( 'description' ) ); ?></h6></a>  
            <?php } ?>
              </div>
           </div>
       
              
       <div class="col-md-3 col-sm-3 col-xs-3 menu-button">
          		<a href="javascript:void(0);" id="search-trigger" class="fa fa-search"></a>
             </div>   
          	<div class="header-search scrollbar">
	          <div class="search-column">
               <form method="post" action="javascript:void(0);" name="Search-form">
		          <input type="search" placeholder="<?php esc_attr_e('Search','medium') ?>" autofocus class="pop-search">
               </form>
               
               <div id="search_result_form">
               <div id="search_text_result"></div>
               <div class="row">
               	<div class="" id="search_result">                
                </div>
                </div>
               	<h2 id="no_search_result"><?php esc_html_e( 'No results found...', 'medium' ); ?></h2>
               </div>
                  <p id="msg"><?php 
                  if(get_theme_mod ( 'medium_searchtext',(!empty($medium_options['search-text'])) ? $medium_options['search-text']:''))
                     echo esc_html(get_theme_mod ( 'medium_searchtext',(!empty($medium_options['search-text'])) ? $medium_options['search-text']:''));     ?>
                  </p>
	          </div>
	      </div>
	  </header>
   <!---header end-->   
