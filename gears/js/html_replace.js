export function replace_keyword( initial_string, replace_to, keyword = '{{REPLACE}}' ) {
  function replace_single_keyword( kw, to ) {
    initial_string = initial_string.replaceAll(
      transform_alphabetic_keyword( kw ), to
    );
  }
  function transform_alphabetic_keyword( kw ) {
    if ( kw.match( /^[A-Za-z]/ ) )
      return `{{${ kw.toUpperCase() }}}`;
    else return kw;
  }

  if ( typeof replace_to === 'string' && typeof keyword === 'string' )
    replace_single_keyword( keyword, replace_to );
  else if ( typeof replace_to === 'object' ) {
    if ( replace_to.length )
      replace_to.forEach( rt => {
        if ( typeof rt === 'object' )
          replace_single_keyword( rt[ 0 ], rt[ 1 ] );
        else if ( typeof rt === 'string' && typeof keyword === 'string' )
          replace_single_keyword( rt[ 0 ], keyword );
      } );
    else
      Object.keys( replace_to ).forEach(
        key => replace_single_keyword( key, replace_to[ key ] )
      );
  }

  return initial_string;
}