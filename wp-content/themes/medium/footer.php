<?php
/**
 * Footer For medium Theme.
 */
    $medium_options = get_option( 'medium_theme_options' );
?>
<footer class="home-footer">
   	<div class="container medium-container">
          <?php if(get_theme_mod ( 'footerCopyright_icon_switch',1)==1){ 
                $TopHeaderSocialIconDefault = array(array('url'=>$medium_options['fburl'],'icon'=>'fa-facebook'),array('url'=>$medium_options['twitter'],'icon'=>'fa-twitter'),array('url'=>$medium_options['googleplus'],'icon'=>'fa-google-plus'),array('url'=>$medium_options['linkedin'],'icon'=>'fa-linkedin'),);?>
              <div class="col-md-12 footer-social">
                <?php if(get_theme_mod ( 'scmessage',(!empty($medium_options['scmessage'])) ? $medium_options['scmessage']:'')): ?>
                  <h6><?php echo esc_html(get_theme_mod ( 'scmessage',(!empty($medium_options['scmessage'])) ? $medium_options['scmessage']:''));?>
                  </h6>
                <?php endif; ?>
                  <ul>
                      <?php for($i=1; $i<=4; $i++) : 
                              if(get_theme_mod('TopHeaderSocialIconLink'.$i,$TopHeaderSocialIconDefault[$i-1]['url'])!= '' && get_theme_mod('TopHeaderSocialIcon'.$i,$TopHeaderSocialIconDefault[$i-1]['icon'])!= ''){     ?>
                                 <li><a href="<?php echo esc_url(get_theme_mod('TopHeaderSocialIconLink'.$i,$TopHeaderSocialIconDefault[$i-1]['url'])); ?>" class="icon" title="" target="_blank">
                                      <i class="fa <?php echo esc_attr(get_theme_mod('TopHeaderSocialIcon'.$i,$TopHeaderSocialIconDefault[$i-1]['icon'])); ?>"></i>
                                  </a></li>                                            
                      <?php } endfor; ?>
                  </ul>
              </div>
            <?php }  ?>            
            <div class="col-md-12 footer-copyright">
           <?php
           if(!empty($medium_options['footertext']))
              echo wp_kses_post(get_theme_mod ( 'footertext',(!empty($educate_options['footertext'])) ? $educate_options['footertext']:'')).',';
              printf( /* translators: %s is theme url.*/ esc_html__( 'Powered by %1$s', 'medium' ), '<a href="'.esc_url('https://fasterthemes.com/wordpress-themes/medium').'" target="_blank">'.esc_html__('Medium WordPress Themes','medium').'</a>'); ?>
            </div>
     </div>   
   </footer>
<?php wp_footer(); ?>
</body>
</html>
