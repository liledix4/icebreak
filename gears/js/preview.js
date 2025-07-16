export function add_preview() {
  document.body.innerHTML += '<div id="block_preview"></div>';
  document.getElementById( 'block_preview' ).innerHTML = document.getElementById( 'main_wrapper' ).innerHTML;
}