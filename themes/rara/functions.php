<?php
/**
 * RARA functions and definitions
 */

/*
define('WP_HOME', 'http://192.168.8.128:8000');
define('WP_SITEURL', 'http://192.168.8.128:8000');
*/

/*
 * Enqueue parent and child theme styles
 */
function rara_theme_enqueue_styles() {
  $parent_style = 'astra';

  wp_enqueue_style( $parent_style,
    get_template_directory_uri() . '/style.css' );

    wp_enqueue_style( 'child-style',
    get_stylesheet_directory_uri() . '/style.css',
    array( $parent_style ),
    wp_get_theme()->get('Version')
  );
}
add_action( 'wp_enqueue_scripts', 'rara_theme_enqueue_styles' );

/*
 * Enqueue MapLibre GL JS
 */
function rara_theme_enqueue_maplibregl() {
  $turf_version = '6.5.0';
  $maplibregl_version = '5.13.0';

  wp_enqueue_script( 'turf',
    'https://unpkg.com/@turf/turf@' . $turf_version . '/turf.min.js'
  );

  wp_enqueue_style( 'maplibregl',
    'https://unpkg.com/maplibre-gl@' . $maplibregl_version . '/dist/maplibre-gl.css'
  );

  wp_enqueue_script( 'maplibregl',
    'https://unpkg.com/maplibre-gl@' . $maplibregl_version . '/dist/maplibre-gl.js'
  );
}

/*
 * Enqueue Heritage trail scripts
 */
function rara_theme_enqueue_heritage_trail() {
  /*
  wp_enqueue_style( 'heritage-trail',
    get_stylesheet_directory_uri() . '/explore/heritage-trail/style.css'
  );

  wp_enqueue_script( 'heritage-trail',
    get_stylesheet_directory_uri() . '/explore/heritage-trail/map.js',
    array(),
    '1.0',
    true
  );
  */

  /*
  wp_enqueue_script( 'heritage-trail',
    plugins_url( '/rara-maps/src/map/heritage_trail.js' ),
    array(),
    '1.0',
    true
  );

  wp_script_add_data( 'heritage-trail', 'type', 'module' );
  */
}

/*
 * Enqueue custom scripts and styles
 */
function rara_theme_enqueue_custom() {
  $obj = get_queried_object();

  if (isset($obj->post_name)) {
    $slug = $obj->post_name;

    if (strpos($slug, 'explore') === 0) {
      rara_theme_enqueue_maplibregl();

      rara_theme_enqueue_heritage_trail();
    }
  }
}
add_action( 'wp_enqueue_scripts', 'rara_theme_enqueue_custom' );
