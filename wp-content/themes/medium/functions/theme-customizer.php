<?php
function medium_theme_customizer( $wp_customize ) {
   $medium_options = get_option( 'medium_theme_options' );
	$wp_customize->add_panel('general',array(
        'title' => __( 'General', 'medium' ),
        'description' => __('General options','medium'),
        'priority' => 20, 
    )
  );

	$wp_customize->get_section('title_tagline')->panel = 'general';
  	$wp_customize->get_section('header_image')->panel = 'general';
  	$wp_customize->get_section('title_tagline')->title = __('Header & Logo','medium');
  	$wp_customize->get_section('static_front_page')->panel = 'general';

    /* sections */
    $wp_customize->add_section( 'medium_basic_section' , array(
    'title'       => __( 'Basic Settings', 'medium' ),
    'priority'    => 30,
	'capability'     => 'edit_theme_options',
  'panel'=>'general',
	) );
        
	/* basic section */	
	// breadcrumbs
	$wp_customize->add_setting( 'medium_breadcrumbs_image_bg',array(
		'sanitize_callback' => 'esc_url_raw',
		'capability'     => 'edit_theme_options',
		)
	 );
    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'medium_breadcrumbs_image_bg', array(
    'label'    => __( 'Breadcrumbs Backgroung Image (Recommended Size : 1350px * 200px)', 'medium' ),
    'section'  => 'medium_basic_section',
    'settings' => 'medium_breadcrumbs_image_bg',
	) ) );
	
	

	// blog title
	$wp_customize->add_setting( 'medium_blogtitle', array(
            'default'        => 'Blog',
            'sanitize_callback' => 'sanitize_text_field',
			'capability'     => 'edit_theme_options',
        ) );
   $wp_customize->add_control( 'medium_blogtitle', array(
		'label'   => __('Blog Title','medium'),
		'section' => 'medium_basic_section',
		'type'    => 'text',
        ) );
   // Serach title
  $wp_customize->add_setting( 'medium_searchtext', array(
            'default'        => ' ',
            'sanitize_callback' => 'sanitize_text_field',
      'capability'     => 'edit_theme_options',
        ) );
   $wp_customize->add_control( 'medium_searchtext', array(
    'label'   => __('Search Title (Search text display in the search popup.)','medium'),
    'section' => 'medium_basic_section',
    'type'    => 'text',
        ) );
     

	// Social Section

	 //All our sections, settings, and controls will be added here
  $wp_customize->add_section(
    'medium_social_icons_section',
    array(
      'title' => __('Social Accounts', 'medium'),
      'priority' => 120,
      'description' => __( 'In first input box, you need to add FONT AWESOME shortcode which you can find ' ,  'medium').'<a target="_blank" href="'.esc_url('https://fortawesome.github.io/Font-Awesome/icons/').'">'.__('here' ,  'medium').'</a>'.__(' and in second input box, you need to add your social media profile URL.', 'medium').'<br />'.__(' Enter the URL of your social accounts. Leave it empty to hide the icon.' ,  'medium'),
      'panel' => 'footer'
    )
  );
 
$wp_customize->add_setting( 'scmessage', array(
            'default'        => 'Connect With Me',
            'sanitize_callback' => 'sanitize_text_field',
      'capability'     => 'edit_theme_options',
        ) );
$wp_customize->add_control( 'scmessage', array(
    'label'   => __('Social Media Message','medium'),
    'section' => 'medium_social_icons_section',
    'type'    => 'text',
        ) );
$TopHeaderSocialIconDefault = array(array('url'=>$medium_options['fburl'],'icon'=>'fa-facebook'),array('url'=>$medium_options['twitter'],'icon'=>'fa-twitter'),array('url'=>$medium_options['googleplus'],'icon'=>'fa-google-plus'),array('url'=>$medium_options['linkedin'],'icon'=>'fa-linkedin'),);

$TopHeaderSocialIcon = array();
  for($i=1;$i <= 4;$i++):  
    $TopHeaderSocialIcon[] =  array( 'slug'=>sprintf('TopHeaderSocialIcon%d',$i),   
      'default' => $TopHeaderSocialIconDefault[$i-1]['icon'],   
      'label' => esc_html__( 'Social Account ', 'medium') .$i,   
      'priority' => sprintf('%d',$i) );  
  endfor;
  foreach($TopHeaderSocialIcon as $TopHeaderSocialIcons){
    $wp_customize->add_setting(
      $TopHeaderSocialIcons['slug'],
      array( 
       'default' => $TopHeaderSocialIcons['default'],       
        'capability'     => 'edit_theme_options',
        'type' => 'theme_mod',
        'sanitize_callback' => 'sanitize_text_field',
      )
    );
    $wp_customize->add_control(
      $TopHeaderSocialIcons['slug'],
      array(
        'type'  => 'text',
        'section' => 'medium_social_icons_section',
        'input_attrs' => array( 'placeholder' => esc_attr__('Enter Icon','medium') ),
        'label'      =>   $TopHeaderSocialIcons['label'],
        'priority' => $TopHeaderSocialIcons['priority']
      )
    );
  }
  $TopHeaderSocialIconLink = array();
  for($i=1;$i <= 4;$i++):  
    $TopHeaderSocialIconLink[] =  array( 'slug'=>sprintf('TopHeaderSocialIconLink%d',$i),   
     'default' => $TopHeaderSocialIconDefault[$i-1]['url'],     
      'label' => esc_html__( 'Social Link ', 'medium' ) .$i,
      'priority' => sprintf('%d',$i) );  
  endfor;
  foreach($TopHeaderSocialIconLink as $TopHeaderSocialIconLinks){
    $wp_customize->add_setting(
      $TopHeaderSocialIconLinks['slug'],
      array(
        'default' => $TopHeaderSocialIconLinks['default'],
        'capability'     => 'edit_theme_options',
        'type' => 'theme_mod',
        'sanitize_callback' => 'esc_url_raw',
      )
    );
    $wp_customize->add_control(
      $TopHeaderSocialIconLinks['slug'],
      array(
        'type'  => 'text',
        'section' => 'medium_social_icons_section',
        'priority' => $TopHeaderSocialIconLinks['priority'],
        'input_attrs' => array( 'placeholder' => esc_html__('Enter URL','medium')),
      )
    );
  }

	
   //Footer Section
$wp_customize->add_panel(
    'footer',
    array(
        'title' => __( 'Footer', 'medium' ),
        'description' => __('Footer options','medium'),
        'priority' => 105, 
    )
);

$wp_customize->add_section( 'footerCopyright' , array(
    'title'       => __( 'Footer Copyright Area', 'medium' ),
    'priority'    => 135,
    'capability'     => 'edit_theme_options',
    'panel' => 'footer'
) );


$wp_customize->add_setting(
    'footertext',
    array(
        'capability'     => 'edit_theme_options',
        'sanitize_callback' => 'wp_kses_post',
        'priority' => 20, 
    )
);
$wp_customize->add_control(
    'footertext',
    array(
        'section' => 'footerCopyright',                
        'label'   => __('Enter Copyright Text','medium'),
        'type'    => 'textarea',
    )
);
// Text Panel Starts Here 
            
}
add_action( 'customize_register', 'medium_theme_customizer' );

function medium_posts_category(){
  $args = array('parent' => 0);
  $categories = get_categories($args);
  $category = array();
  $i = 0;
  $category[''] = 'All';
  foreach($categories as $categorys){
      if($i==0){
          $default = $categorys->slug;
          $i++;
      }
      $category[$categorys->term_id] = $categorys->name;
  }
  return $category;
}

function medium_sanitize_input_choice( $input, $setting ) {

  // Ensure input is a slug.
  $input = sanitize_key( $input );

  // Get list of choices from the control associated with the setting.
  $choices = $setting->manager->get_control( $setting->id )->choices;

  // If the input is a valid key, return it; otherwise, return the default.
  return ( array_key_exists( $input, $choices ) ? $input : $setting->default );
}

function medium_custom_css()
{
	wp_enqueue_style('medium-style', get_stylesheet_uri(), array());
	$custom_css ='';
	
	$medium_breadcrumbs_image_bg=get_theme_mod('medium_breadcrumbs_image_bg');
	
	if (!empty($medium_breadcrumbs_image_bg) ){
		$medium_breadcrumbs_image_bg = esc_url(get_theme_mod('medium_breadcrumbs_image_bg'));
		$custom_css .=" .page-title { background-image :url('".$medium_breadcrumbs_image_bg."');
		background-position: center;} ";
	}

   if(get_theme_mod('header_fix',0)){ 
      $custom_css.= ".navbar.fixed-header { position :fixed; } 
      .main-nav.fixed-header.fixed {
        background: #212121;
    }";
    } 

	wp_add_inline_style('medium-style',$custom_css);  
  
}