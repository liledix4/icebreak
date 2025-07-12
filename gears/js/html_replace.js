export function replaceKeyword( initialString, replaceTo, keyword = '{{REPLACE}}' ) {
  function replaceSingleKeyword( kw, to ) {
    initialString = initialString.replaceAll(
      transformAlphabeticKeyword( kw ), to
    );
  }
  function transformAlphabeticKeyword( kw ) {
    if ( kw.match( /^[A-Za-z]/ ) )
      return `{{${ kw.toUpperCase() }}}`;
    else return kw;
  }

  if ( typeof replaceTo === 'string' && typeof keyword === 'string' )
    replaceSingleKeyword( keyword, replaceTo );
  else if ( typeof replaceTo === 'object' ) {
    if ( replaceTo.length )
      replaceTo.forEach( rt => {
        if ( typeof rt === 'object' )
          replaceSingleKeyword( rt[ 0 ], rt[ 1 ] );
        else if ( typeof rt === 'string' && typeof keyword === 'string' )
          replaceSingleKeyword( rt[ 0 ], keyword );
      } );
    else
      Object.keys( replaceTo ).forEach(
        key => replaceSingleKeyword( key, replaceTo[ key ] )
      );
  }

  return initialString;
}