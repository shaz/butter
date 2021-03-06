/*global EditorHelper*/

EditorHelper.addPlugin( "image", function( trackEvent ) {
  var _canvas = document.createElement( "canvas" ),
      _popcornOptions = trackEvent.popcornTrackEvent,
      _container = _popcornOptions._container,
      _media = document.getElementById( trackEvent.track._media.target ),
      _title = document.createElement( "span" ),
      _context;

  if ( window.jQuery ) {
    //Change default text to indicate draggable
    if ( _popcornOptions.src && !/^data:image/.test( _popcornOptions.src ) ){
      _title.classList.add( "title" );
      _title.innerHTML = "Drag an image from your desktop";
      _container.insertBefore( _title, _container.firstChild );
    }

    window.EditorHelper.resizable( trackEvent, _container, _media, {
      minWidth: 25,
      minHeight: 25
    });
    window.EditorHelper.draggable( trackEvent, _container, _media );
  }

  _container.addEventListener( "dragover", function( e ) {
    e.preventDefault();
    _container.classList.add( "butter-dragover" );
  }, false );

  _container.addEventListener( "dragleave", function( e ) {
    e.preventDefault();
    _container.classList.remove( "butter-dragover" );
  }, false );

  _container.addEventListener( "drop", function( e ) {
    _container.classList.add( "butter-dropped" );
    e.preventDefault();
    var file = e.dataTransfer.files[ 0 ],
        imgSrc,
        image,
        imgURI;

    if ( !file ) {
      return;
    }

    if ( window.URL ) {
      imgSrc = window.URL.createObjectURL( file );
    } else if ( window.webkitURL ) {
      imgSrc = window.webkitURL.createObjectURL( file );
    }

    image = document.createElement( "img" );
    image.onload = function() {
      _canvas.width = this.width;
      _canvas.height = this.height;
      _context = _canvas.getContext( "2d" );
      _context.drawImage( this, 0, 0, this.width, this.height );
      imgURI = _canvas.toDataURL();
      trackEvent.update( { src: imgURI } );
    };
    image.src = imgSrc;
  }, false );
});
