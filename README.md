# zbox

August 2013

A jQuery plugin that gives you a ligthbox with zoom functionality.

[See Demo](http://alexandercurtis.github.io/zbox/zbox.html)

## Example usage

    <head>
      <link type="text/css" rel="stylesheet" media="all" href="jquery.zbox.css" />
      <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
      <script type="text/javascript" src="jquery.zbox.min.js"></script>
      <script type="text/javascript">
        jQuery(document).ready(function(){
          jQuery(".zb").zbox( { margin:40 } );
        });
      </script>
    </head>
    <body>
      <div id="wrapper">
        <a class="zb" rel="group" href="image1.jpg">
          <img src="image1-sm.jpg"/>
        </a>
        <a class="zb" rel="group" href="image2.jpg">
          <img src="image2-sm.jpg"/>
        </a>
      </div>
    </body>


