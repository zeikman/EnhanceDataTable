<?php
  // https://github.com/matthiasmullie/minify
  // https://github.com/matthiasmullie/minify/issues/12

  // https://github.com/mrclay/minify

  require __DIR__ . '/vendor/autoload.php';

  use MatthiasMullie\Minify;

  $src_path = 'src';

  /**
   * minify js
   */

  $js_source_path   = "$src_path/EnhanceDataTable.js";
  $js_min_filename  = "EnhanceDataTable.min.js";
  $js_min_filepath  = "$src_path/$js_min_filename";
  $js_minifier      = new Minify\JS($js_source_path);

  $js_minifier->minify($js_min_filepath);

  echo "minify JS created : $js_min_filepath<br>";

  /**
   * minify css
   */

  $css_source_path  = "$src_path/EnhanceDataTable.css";
  $css_min_filename = "EnhanceDataTable.min.css";
  $css_min_filepath = "$src_path/$css_min_filename";
  $css_minifier     = new Minify\CSS($css_source_path);

  $css_minifier->minify($css_min_filepath);

  echo "minify CSS created : $css_min_filepath<br>";

  /**
   * minify completed
   */

  $datatime = date("l jS \of F Y h:i:s A");

  echo "Minify done at $datatime.<br>";
?>
<!DOCTYPE html>

<html>
  <head>
    <meta charset = "utf-8">
    <title>Minify Source Files</title>
  </head>

  <body>
    <!-- <header>...</header>
    <nav>...</nav>

    <article>
        <section>
          ...
        </section>
    </article>
    <aside>...</aside>

    <footer>...</footer> -->
  </body>
</html>