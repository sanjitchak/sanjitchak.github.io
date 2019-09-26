<?php 
/*
 * Main Template File.
 */
get_header(); ?>
   <!--section start-->
   <section class="home-section page-section">
   	<div class="col-md-12 page-title">
        <h2><?php
        if(get_theme_mod ( 'medium_blogtitle',(!empty($medium_options['blog-title'])) ? $medium_options['blog-title']:''))
           echo esc_html(get_theme_mod ( 'medium_blogtitle',(!empty($medium_options['blog-title'])) ? $medium_options['blog-title']:''));
        else
            esc_html_e ('Blog','medium'); ?>
        </h2>
    </div>
   	<div class="container blog-container">	
        <div class="blog-post" id="content">
            <div class="row blog-row" id="ArticleContainer">
             <?php	 $medium_i = 1;
		      if( have_posts() ) : while (have_posts()) : the_post(); 
		        $medium_class = ($medium_i == 1 || $medium_i == 4)?'col-md-7 col-sm-12 post-box':'col-md-5 col-sm-12 post-box';
            $medium_featured_image = ($medium_i == 1 || $medium_i == 4)?'medium-blog-big':'medium-blog-small'; ?>
                <div  id="post-<?php the_ID(); ?>" <?php post_class($medium_class); ?>>
                    <div class="blog-left">
                    	<?php if(has_post_thumbnail()) : ?>
                      <a href="<?php the_permalink(); ?>"><?php the_post_thumbnail($medium_featured_image);?> </a>
                      <?php endif; ?>
                        <div class="block-content">
                            <a href="<?php the_permalink();?>" class="block-title"><?php the_title(); ?></a>
                            <div class="block-details">
                                <ul>
                                    <?php medium_entry_meta(); ?>
                                </ul>
                            </div>
                            <a href="<?php the_permalink();?>" class="read-more"><?php esc_html_e('Read More...','medium'); ?></a>
                        </div>    
                    </div>
                </div>
             <?php
			 	$medium_i++;
				if($medium_i == 5){
					$medium_i=1;			
				}
				endwhile; endif;
				if (function_exists('faster_pagination')) {
    				faster_pagination();
				}
				else{ ?>
    				<div class="col-md-12">
    				    <div class="medium-pagination-single">
                        <?php  the_posts_pagination(); ?>
    			        </div>
                    </div>
                <?php } ?>
            </div>
        </div>    
    </div>   
   </section>
   <!--secton end-->
<?php get_footer(); ?>
