const className = 'dragging';


export function draggable( elementYouDrag, elementThatIsDragged, draggableArea = document ) {
  let previousPosition;

  elementYouDrag.addEventListener( 'mousedown', dragging );

  function dragging( event ) {
    event.preventDefault();
    previousPosition = mousePosition( event );
    elementThatIsDragged.classList.add( className );
    draggableArea.addEventListener( 'mouseup', areaMouseUp );
    draggableArea.addEventListener( 'mousemove', areaMouseMove );
  }

  function areaMouseMove( event ) {
    previousPosition = dragElement( elementThatIsDragged, event, previousPosition );
  }

  function areaMouseUp() {
    fixPosition( elementThatIsDragged );
    draggableArea.removeEventListener( 'mouseup', areaMouseUp );
    draggableArea.removeEventListener( 'mousemove', areaMouseMove );
  }
}


function dragElement( draggableElement, event, initialPosition ) {
  event.preventDefault();
  moveElement(
    draggableElement,
    draggableElement.offsetLeft - initialPosition.x + event.clientX,
    draggableElement.offsetTop  - initialPosition.y + event.clientY
  );
  return mousePosition( event );
}


export function fixPosition( draggableElement ) {
  draggableElement.classList.remove( className );

  let moveLeft, moveTop;
  const positionLeft = draggableElement.offsetLeft;
  const positionTop  = draggableElement.offsetTop;
  const maxLeft = window.innerWidth  - draggableElement.offsetWidth;
  const maxTop  = window.innerHeight - draggableElement.offsetHeight;

  if ( positionLeft < 0 )         moveLeft = 0;
  if ( positionTop  < 0 )         moveTop  = 0;
  if ( positionLeft > maxLeft )   moveLeft = maxLeft;
  if ( positionTop  > maxTop )    moveTop  = maxTop;

  moveElement( draggableElement, moveLeft, moveTop );
}


// =========================================


function mousePosition( event ) {
  return { x: event.clientX, y: event.clientY };
}


function moveElement( draggableElement, x, y ) {
  draggableElement.style.left = `${ x }px`;
  draggableElement.style.top  = `${ y }px`;
}


export function centerElement( element ) {
  element.style.left = window.innerWidth  / 2 - element.clientWidth  / 2 + 'px';
  element.style.top  = window.innerHeight / 2 - element.clientHeight / 2 + 'px';
}