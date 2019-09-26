<?php

add_action( 'medium_register', 'medium_theme_register_plugins' );
/* Register the required plugins for this theme. */
function medium_theme_register_plugins() {
 /*Array of plugin arrays. Required keys are name and slug. */
    $medium_plugins = array(
        // This is an example of how to include a plugin from the WordPress Plugin Repository.
         array(
            'name'      => __('Faster Pagination','medium'),
            'slug'      => 'faster-pagination',
            'required'  => false,
        ),
    );

    /*  Array of configuration settings. Amend each line as needed. */
    $medium_config = array(
        'id'           => 'medium',                 // Unique ID for hashing notices for multiple instances of TGMPA.
        'default_path' => '',                      // Default absolute path to pre-packaged plugins.
        'menu'         => 'medium-install-plugins', // Menu slug.
        'has_notices'  => true,                    // Show admin notices or not.
        'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
        'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
        'is_automatic' => false,                   // Automatically activate plugins after installation or not.
        'message'      => '',                      // Message to output right before the plugins table.
        'strings'      => array(
            'page_title'                      => __( 'Install Required Plugins', 'medium' ),
            'menu_title'                      => __( 'Install Plugins', 'medium' ),
            
            'nag_type'                        => 'updated' // Determines admin notice type - can only be 'updated', 'update-nag' or 'error'.
        )
    );
    medium( $medium_plugins, $medium_config );
}
