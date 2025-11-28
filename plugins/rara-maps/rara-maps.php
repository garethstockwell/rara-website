<?php
/*
Plugin Name: RARA maps
Description: Interactive maps for rar.org.uk
Author: gareth.stockwell@gmail.com
*/

function enqueue_rara_maps_script_force_module() {
    $handle    = 'rara-maps-script';
    $this_url  = plugin_dir_url(__FILE__);
    $this_path = plugin_dir_path(__FILE__);

    // Register and enqueue as normal so other code expecting the handle won't break.
    $ver = file_exists( $this_path . 'build/bundle.js' ) ? filemtime( $this_path . 'build/bundle.js' ) : false;
    wp_register_script( $handle, $this_url . 'build/bundle.js', [], $ver, true );
    wp_enqueue_script( $handle );

    // Remove WP's printed tag for this handle by dequeuing just before footer prints,
    // then print our own module tag and inline data.
    add_action( 'wp_print_footer_scripts', function() use ( $handle, $this_url, $ver ) {
        // Remove the handle's normal printed tag (so WP won't output its <script ...>)
        wp_dequeue_script( $handle );
        wp_deregister_script( $handle );

        // Print the inline data first (guaranteed global)
        echo '<script>window.raraMapsData = ' . wp_json_encode( [ 'baseUrl' => $this_url ] ) . ';</script>' . "\n";

        // Print the module tag ourselves (guaranteed to be type="module")
        $src = esc_url( $this_url . 'build/bundle.js' . ( $ver ? '?ver=' . $ver : '' ) );
        echo '<script type="module" src="' . $src . '" id="' . esc_attr( $handle ) . '-js"></script>' . "\n";
    }, 100 ); // run late in footer
}
add_action( 'wp_enqueue_scripts', 'enqueue_rara_maps_script_force_module', 20 );
