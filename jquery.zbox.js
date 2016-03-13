/**
 * zbox - lightbox and zoomer combo for jQuery
 *
 * Copyright 2013 Arcitus Solutions Ltd.
 * Not to be used without permission.
 *
 * Version 0.0.1 - 20th August 2013
 *
 * Developed for jQuery 1.8.2
 *
 */
 /*
  * Variable names have been shortened to aid minifying at http://javascript-minifier.com/:
  * ail = allImagesLoaded
  * bi = buildImage
  * c = container
  * cin = currentImageNumber
  * cn = collection
  * d = dimensions
  * hs = hideSpinner
  * i = images
  * im = image
  * li = loadImages
  * moff = magOff
  * mon = magOn
  * n = next
  * nil = numImagesLoaded
  * o = options
  * ov = overlay
  * p = previous
  * r = refreshing
  * rf = refresh
  * s = show
  * sd = shuttingDown
  * sdn = shutDownNicely
  * sdf = shutDown (finished)
  * si = showImage
  * sm = showMag
  * so = showOverlay
  * sp = spinner
  * ss = showSpinner
  * w = window
  */

;(function($,window,document,undefined) {
  "use strict";

  var pluginName = 'zbox';
  var defaults = {
         margin: 10
      };

  var ZBox = {
    c: null, /* container */
    o: {},
    s: function( e )
    {
      ZBox.cin = ZBox.cn.index( this );
      ZBox.sd = false;
      ZBox.r = true;
      $(this).blur(); /* Hide dotted outline on active <a> */
      $(document).on( "keydown.zbox", function(e) {
        if( e.which == 27 || e.which == 13 )
        {
          ZBox.sdn();
          e.preventDefault();
        }
        else if( e.which==37 || e.which==38 || e.which==8 )
        {
          ZBox.p();
          e.preventDefault();
        }
        else if( e.which==39 || e.which==40 || e.which==32 )
        {
          ZBox.n();
          e.preventDefault();
        }
      });
      $(window).resize( function() { ZBox.rf(false); } );
      ZBox.window = $(window);
      ZBox.so();
      ZBox.li();
      e.preventDefault();
    },
    so: function()
    {
      var overlayHtml = '<div id="zbox-overlay"></div>';
      ZBox.ov = $(overlayHtml).appendTo('body');
      ZBox.ov.click( ZBox.sdn );
      ZBox.ov.animate({opacity : 0.7}, {
        duration : 250,
        easing   : "swing"
      });
    },
    sdn: function()
    {
      ZBox.sd = true;
      if( ZBox.sp )
      {
        ZBox.sp.remove();
        ZBox.sp = null;
      }
      if( ZBox.c )
      {
        ZBox.c.animate({opacity : 0.1}, {
          duration : 250,
          easing   : "swing"
        });
      }
      if( ZBox.ov )
      {
        ZBox.ov.animate({opacity : 0.1}, {
          duration : 250,
          easing   : "swing",
          complete : ZBox.sdf
        });
      }
      else
      {
        ZBox.sdf();
      }
    },
    sdf: function()
    {
      ZBox.sd = true;
      if( ZBox.ov )
      {
        ZBox.ov.remove();
        ZBox.ov = null;
      }
      if( ZBox.c )
      {
        ZBox.c.remove();
        ZBox.c = null;
      }
      if( ZBox.sp )
      {
        ZBox.sp.remove();
        ZBox.sp = null;
      }
      ZBox.i = null;
      ZBox.nil = 0;
      ZBox.ail = false;
      $('.zbox-screen').unbind('.zbox');
      $(document).off('.zbox');

    },
    li: function()
    {
      ZBox.i = new Array();
      ZBox.nil = 0;
      ZBox.ail = false;
      ZBox.cn.each( function() {

        var img = new Image();
        img.onload = function() {
          if( !ZBox.sd )
          {
            ZBox.nil++;
            if( ZBox.nil == ZBox.cn.length )
            {
              ZBox.ail = true;
              ZBox.hs();
              ZBox.bi();
              ZBox.si();
              ZBox.sm();
            }
          }
        };
        img.onerror = function(e) {
          if( console )
          {
            console.warn( "Error loading image " + img.src );
          }
          ZBox.hs();
          ZBox.sdf();
        };
        var href = $(this).attr('href');
        var title = $(this).attr('title');
        img.src = href;
        ZBox.i.push( {img:img,href:href,title:title} );
      });

      if( !ZBox.ail )
      {
        ZBox.ss();
      }

    },
    ss: function()
    {
      if( !ZBox.sd )
      {
        var spinnerHtml = '<div id="zbox-spinner">Loading...</div>';
        ZBox.sp = $(spinnerHtml);
        ZBox.sp.css('left', ZBox.window.scrollLeft()-16 + ZBox.window.width()/2 );
        ZBox.sp.css('top', ZBox.window.scrollTop()-16 + ZBox.window.height()/2 );
        if( !ZBox.ail )
        {
          ZBox.sp.appendTo('body');
        }
      }
    },
    hs: function()
    {
      if( ZBox.sp )
      {
        ZBox.sp.remove();
        ZBox.sp = null;
      }
    },
    bi: function()
    {
      // Create container div
      var containerHtml = '<div class="zbox-content"></div>';
      ZBox.c = $(containerHtml);

      var href = ZBox.i[ZBox.cin].href;
      var title = ZBox.i[ZBox.cin].title;
      var img = ZBox.i[ZBox.cin].img;
      var imgHtml = '<img src="' + href + '" alt="' + title + '"/>';
      ZBox.im = $(imgHtml);
      var iw = img.width;
      var ih = img.height;
      var ww = ZBox.window.width() - ZBox.o.margin * 2;
      var wh = ZBox.window.height() - ZBox.o.margin * 2;
      var cw = ww - 80;
      var ch = wh - 20;
      var ca = cw/ch;
      var ia = iw/ih;
      var wa = ww/wh;
      var nw = cw,nh = ch;
      if( ia > ca ) {
        if( cw < iw )
        {
          nh = Math.ceil(cw / ia);
        }
        else
        {
          nw = iw;
          nh = ih;
        }
      }
      else {
        if( ch < ih )
        {
          nw = Math.ceil(ch * ia);
        }
        else
        {
          nw = iw;
          nh = ih;
        }
      }
      ZBox.im.width( nw );
      ZBox.im.height( nh );
      ZBox.c.css('left', Math.ceil( ZBox.o.margin + (ww-(nw+80)) / 2 ) + 'px' );
      ZBox.c.css( 'top', Math.ceil( ZBox.o.margin + (wh-(nh+20)) / 2 ) + 'px' );
      if( ZBox.i.length > 1 )
      {
//        if( ZBox.cin > 0 )
        {
          $('<div class="zbox-button left"></div>').css('top',Math.ceil(((nh+20)/2)-6)+'px').appendTo(ZBox.c).click( ZBox.p );
        }
//        if( ZBox.cin+1 < ZBox.i.length )
        {
          $('<div class="zbox-button right"></div>').css('top',Math.ceil(((nh+20)/2)-6)+'px').appendTo(ZBox.c).click( ZBox.n );
        }
      }
      $('<div class="zbox-button close"></div>').appendTo(ZBox.c).click( ZBox.sdn );

      ZBox.d = { iw:iw, ih:ih, ww:ww, wh:wh, nw:nw, nh:nh };
    },
    si: function( animated )
    {
      ZBox.im.appendTo( ZBox.c );
      ZBox.c.appendTo( 'body' );
      if( animated )
      {
        ZBox.c.animate({opacity : 1}, {
          duration : 250,
          easing   : "swing",
          complete: function(){ ZBox.r = false; }
        });
      }
      else
      {
        ZBox.c.css('opacity',1);
        ZBox.r = false;
      }
    },
    mon: function() {
      ZBox.showingMag = true;
      if( ZBox.mag ) ZBox.mag.css('display','block');
    },
    moff: function() {
      ZBox.showingMag = false;
      if( ZBox.mag ) ZBox.mag.css('display','none');
    },
    sm: function(mx,my)
    {
      function positionMag(evx,evy,evcx,evcy) {
        var imx = off.left;
        var imy = off.top;
        var msx = evx - imx;
        if( typeof zoom_offset !== 'undefined' )
        {
          msx -= zoom_offset;
        }
        var msy = evy - imy;
        var mfx = msx/ZBox.d.nw; // Image width
        var mfy = msy/ZBox.d.nh;
        var bix = mfx*ZBox.d.iw; // Zoom * image width
        var biy = mfy*ZBox.d.ih;
        var ofx = mfx*200; // Lens width
        var ofy = mfy*200;
        var bgx = 200/2-bix;
        var bgy = 200/2-biy;
        var lnx = 200/2;
        var lny = 200/2;
        jQuery('#zbox-magnifier').css('left',evcx-lnx).css('top',evcy-lny).css('background-position',bgx + "px " + bgy + "px");
      }
      if( ZBox.d.nw < ZBox.d.iw || ZBox.d.nh < ZBox.d.ih )
      {
        var magHtml = '<div id="zbox-magnifier">&nbsp;</div>';
        var mag = ZBox.mag = $(magHtml).appendTo( ZBox.c );
        ZBox.moff();
        mag.css('background-image','url('+ZBox.i[ZBox.cin].href+')');
        var zscreenHtml = '<div class="zbox-screen"></div>';
        var zscreen = $(zscreenHtml).appendTo( ZBox.c );
        zscreen.width( ZBox.d.nw  );
        zscreen.height( ZBox.d.nh );
        zscreen.css('left','40px');
        zscreen.css('top','10px');
        zscreen.css('font-size',ZBox.d.nh + 'px');
        var ie = navigator.userAgent.match(/msie/i);
        if( ie )
        {
          zscreen.css('cursor','url(blank.cur)');
        }
        else
        {
          zscreen.css('cursor','none');
        }

        zscreen.bind('mouseenter.zbox', function(e){positionMag( e.pageX, e.pageY, e.clientX, e.clientY ); ZBox.mon();} );
        zscreen.bind('mouseleave.zbox', ZBox.moff );
        var off = zscreen.offset();
        if( off )
        {
          zscreen.bind('mousemove.zbox',function(event)
          {
            if( ZBox.showingMag )
            {
              positionMag( event.pageX, event.pageY, event.clientX, event.clientY );
            }
          });
        }
      }
    },
    p: function()
    {
      if( !ZBox.r )
      {
        if( ZBox.cin == 0 )
        {
          ZBox.cin = ZBox.i.length;
        }
        --ZBox.cin;
        ZBox.rf(true);
      }
    },
    n: function()
    {
      if( !ZBox.r )
      {
        ++ZBox.cin;
        if( ZBox.cin == ZBox.i.length )
        {
          ZBox.cin = 0;
        }
        ZBox.rf(true);
      }
    },
    rf: function( animated )
    {
      ZBox.r = true;
      ZBox.moff();
      $('.zbox-screen').unbind('.zbox');
      if( animated )
      {
        ZBox.c.animate({opacity : 0.1}, {
          duration : 250,
          easing   : "swing",
          complete : function() {

            ZBox.c.remove();
            ZBox.bi();
            ZBox.si(true);
            ZBox.sm();
          }
        });
      }
      else
      {
        ZBox.c.remove();
        ZBox.bi();
        ZBox.si(false);
        ZBox.sm();
      }
    }


  };

  $.fn.zbox = function( options ) {
    ZBox.o = $.extend( {}, defaults, options );
    ZBox.cn = this;
    return this.each( function() {
      $(this).click( ZBox.s );
    });
  };

}( jQuery, window, document ));





