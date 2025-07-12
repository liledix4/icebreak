import { centerElement, draggable, fixPosition } from './drag_element.js';


( async function() {


console.log( 'Thanks for adding liledix4 Minibar to your webpage!' );


const toolbarLinks = [
  { text: 'YouTube', emoji: '▶️', url: 'https://www.youtube.com/@liledix4' },
  { text: 'Ice Break!', emoji: '🧊', url: 'https://liledix4.github.io/icebreak' },
  { text: 'Bombs vs. Sleepwalkers', emoji: '💣', url: 'https://bvsgame.github.io' },
  { text: 'DDLC New Heading', emoji: '💌', url: 'https://ddlcnh.github.io' },
  { text: 'GitHub', emoji: '🦑', url: 'https://github.com/liledix4' },
];
const moreBlocks = [
  {
    section: 'Social Media',
    blocks: [
      { text: 'YouTube', color: '#bb4444', type: 'wide', emoji: '▶️', url: 'https://www.youtube.com/@liledix4', messages: [
        { image: 'https://i.ytimg.com/vi/K6iwrqZ2EEY/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=K6iwrqZ2EEY' },
        { image: 'https://i.ytimg.com/vi/pyooQjRInlE/hqdefault.jpg', url: 'https://www.youtube.com/watch?v=pyooQjRInlE' },
      ] },
      { text: 'GitHub', emoji: '🦑', url: 'https://github.com/liledix4' },
    ],
  },
  {
    section: 'Projects',
    blocks: [
      { text: 'Bombs vs. Sleepwalkers', type: 'wide', emoji: '💣', url: 'https://bvsgame.github.io' },
      { text: 'DDLC New Heading', color: '#dd77aa', type: 'wide', emoji: '💌', url: 'https://ddlcnh.github.io', messages: [
        { text: 'YouTube channel', image: 'https://yt3.googleusercontent.com/F4x1o_fzpWilveer1oMJs0IJ90wXz64CoRsaUPfGbO8DtB8uSpqBZiVmVlBjF0QGMh56G71Gew=w10000', url: 'https://www.youtube.com/@DDLCNH' },
        { text: 'Demo script of DDLC:NH Act 4 is in the works! See the announcement.', progress: 30, url: 'https://www.youtube.com/post/UgkxVM0wOHdepwa5kTLqf-0NiKHm7XKu7is9' },
      ] },
      { text: 'Ice Break!', emoji: '🧊', url: 'https://liledix4.github.io/icebreak' },
    ]
  },
];


document.head.innerHTML += '<link rel="stylesheet" href="./gears/modules/minibar/minibar.css">';


const minibar = document.getElementById( 'liledix4_minibar' );
let html = {
  links: ``,
  liledix4: `<a class='toolbar_element main' href='https://liledix4.github.io'><span class='text'>liledix4</span></a>`,
  time: `<div class='time'></div>`,
  toolbarFiller: `<div class='filler'></div>`,
  moreButton: `<div class='toolbar_element more'><span class='text'>More ▼</span></div>`,
};


toolbarLinks.forEach( obj => {
  let a = '';

  a += `<a class='toolbar_element' href='${ obj.url }'>`;
  if ( obj.emoji !== undefined )
    a += `<span class='emoji'>${ obj.emoji }</span>`;
  if ( obj.text !== undefined )
    a += `<span class='text'>${ obj.text }</span>`;
  a += `</a>`;

  html.links += a;
} );


minibar.innerHTML = `
  <div class='toolbar_elements_wrapper'>
    ${ html.liledix4 }
    <div class='links'>
      ${ html.time }
      ${ html.links }
    </div>
    ${ html.toolbarFiller }
    ${ html.moreButton }
  </div>
  <div class='more_wrapper'></div>
  <div class='below_block_messages_wrapper'></div>
  <div class='block_messages_wrapper'>
    <div class='title'>
      <div class='text'></div>
    </div>
    <div class='messages'></div>
    <div class='close'></div>
  </div>
`;


const toolbar = minibar.querySelector( '.toolbar_elements_wrapper' );
const more = minibar.querySelector( '.more_wrapper' );
setInterval( showCurrentTime, 500 );
showCurrentTime();


let toolbarAnimationTimeouts = {
  links: minibar.querySelector( '.toolbar_elements_wrapper .links' ),
  previousExtendedHeight: minibar.querySelector( '.toolbar_elements_wrapper .links' ).clientHeight,
  initialHeight: 28,
  initialTransition: null,
  setParameters: null,
  clearStyles: null,
};
setTimeout(() => {
  toolbarAnimationTimeouts.initialHeight = minibar.clientHeight;
}, 500);
toolbar.addEventListener( 'mouseenter', event => {
  const target = toolbarAnimationTimeouts.links;

  clearTimeout( toolbarAnimationTimeouts.initialTransition );
  clearTimeout( toolbarAnimationTimeouts.setParameters );
  clearTimeout( toolbarAnimationTimeouts.clearStyles );
  minibar.style.top = null;
  minibar.style.transition = null;
  target.style.transition = null;
  target.style.minHeight = null;
  target.style.maxHeight = null;

  if ( !document.body.classList.contains( 'liledix4_minibar__show_more' ) )
    minibar.style.top = -( window.scrollY ) + 'px';
  const finalHeight = target.clientHeight;
  target.style.maxHeight = toolbarAnimationTimeouts.initialHeight + 'px';
  toolbarAnimationTimeouts.previousExtendedHeight = finalHeight;

  toolbarAnimationTimeouts.initialTransition = setTimeout( function() {
    target.style.transition = 'max-height .4s';
    minibar.style.transition = 'color .2s, background .2s, top .2s';
  }, 10);
  toolbarAnimationTimeouts.setParameters = setTimeout( function() {
    minibar.style.top = '0';
    target.style.maxHeight = finalHeight + 'px';
  }, 20);
  toolbarAnimationTimeouts.clearStyles = setTimeout( function() {
    minibar.style.transition = null;
    target.style.transition = null;
    target.style.maxHeight = null;
  }, 400);
} );
toolbar.addEventListener( 'mouseleave', event => {
  const target = toolbarAnimationTimeouts.links;

  clearTimeout( toolbarAnimationTimeouts.initialTransition );
  clearTimeout( toolbarAnimationTimeouts.setParameters );
  clearTimeout( toolbarAnimationTimeouts.clearStyles );
  minibar.style.top = null;
  minibar.style.transition = null;
  target.style.transition = null;
  target.style.minHeight = null;
  target.style.maxHeight = null;

  if ( !document.body.classList.contains( 'liledix4_minibar__show_more' ) )
    minibar.style.top = window.scrollY + 'px';
  target.style.minHeight = toolbarAnimationTimeouts.previousExtendedHeight + 'px';

  toolbarAnimationTimeouts.initialTransition = setTimeout( function() {
    target.style.transition = 'min-height .2s';
    minibar.style.transition = 'color .2s, background .2s, top .4s';
  }, 10);
  toolbarAnimationTimeouts.setParameters = setTimeout( function() {
    minibar.style.top = null;
    target.style.minHeight = '28px';
  }, 20);
  toolbarAnimationTimeouts.clearStyles = setTimeout( function() {
    minibar.style.transition = null;
    target.style.transition = null;
    target.style.minHeight = null;
  }, 400);
} );


toolbar.querySelector( '.more' ).addEventListener( 'click', () => document.body.classList.toggle( 'liledix4_minibar__show_more' ) );



moreBlocks.forEach( section => {
  let htmlSectionBlocks = '';

  section.blocks.forEach( block => {
    let html = {
      type: '',
      color: '',
      iconBig: '',
      interactiveCorner: '',
      urlPrimary: '',
      title: `<div class='title'>${ block.text }</div>`,
      messageRails: '',
    };

    if ( block.type !== undefined )
      html.type += ' ' + block.type;
    if ( block.color !== undefined )
      html.color = ` style='background-color: ${ block.color }'`;
    if ( block.emoji !== undefined )
      html.iconBig = `<div class='icon'>${ block.emoji }</div>`;

    if ( block.url !== undefined )
      html.urlPrimary = `<a class='primary_link' href='${ block.url }'></a>`;
    else
      html.type += ' no_primary_url';

    if ( block.messages !== undefined ) {
      if ( block.emoji !== undefined )
        html.interactiveCorner += `<div class='mini_icon'>${ block.emoji }</div>`;
      html.interactiveCorner += `<div class='counter'>${ block.messages.length }</div>`;

      html.messageRails += `<div class='message_rails'>`;
      block.messages.forEach( message => {
        if ( typeof message === 'object' ) {
          let messageResult = '';
          let messageStyle = '';

          if ( message.progress !== undefined && typeof message.progress === 'number' )
            messageResult = `<div class='progress_bar' style='width: ${ message.progress }%;'>${ message.progress }%</div>`;
          if ( message.text !== undefined )
            messageResult += message.text;
          if ( block.color !== undefined )
            messageStyle += `background-color: ${ block.color }; `;
          if ( message.image !== undefined )
            messageStyle += `background-image: url( "${ message.image }" ); `;

          if ( messageStyle.length > 0 )
            messageStyle = ` style='${ messageStyle }'`;

          if ( message.url !== undefined )
            html.messageRails += `<a class='message' href='${ message.url }'${ messageStyle }>${ messageResult }</a>`;
          else if ( block.url !== undefined )
            html.messageRails += `<a class='message' href='${ block.url }'${ messageStyle }>${ messageResult }</a>`;
          else
            html.messageRails += `<div class='message'${ messageStyle }>${ messageResult }</div>`;
        }
        else if ( block.url !== undefined )
          html.messageRails += `<a class='message' href='${ block.url }'>${ message }</a>`;
        else
          html.messageRails += `<div class='message'>${ message }</div>`;
      } );
      html.messageRails += `</div>`;
    }

    if ( html.interactiveCorner.length > 0 )
      html.interactiveCorner = `<div class='interactive_corner' title='Click here to see all messages at once'>${ html.interactiveCorner }</div>`;

    htmlSectionBlocks += `
      <div class='block${ html.type }'${ html.color }>
        ${ html.iconBig }
        ${ html.urlPrimary }
        ${ html.interactiveCorner }
        ${ html.title }
        ${ html.messageRails }
      </div>`;
  } );

  more.innerHTML += `
    <div class='section_wrapper'>
      <div class='section_title'>${ section.section }</div>
      <div class='blocks_wrapper'>${ htmlSectionBlocks }</div>
    </div>`;
} );

let moreBlocks_MessagesRailsIntervals = [];


function closeBlocksWindow() {
  minibar.classList.remove( 'show_blocks_window' );
  minibar.querySelector( '.block_messages_wrapper .title .text' ).innerHTML = '';
  minibar.querySelector( '.block_messages_wrapper .messages' ).innerHTML = '';
}


minibar.querySelector( '.below_block_messages_wrapper' ).addEventListener( 'click', closeBlocksWindow );
minibar.querySelector( '.block_messages_wrapper .close' ).addEventListener( 'click', closeBlocksWindow );
more.querySelectorAll( '.block .interactive_corner' ).forEach( corner => {
  corner.addEventListener( 'click', () => {
    const parentBlock = corner.closest( '.block' );
    const rails = parentBlock.querySelector( '.message_rails' );
    const wrapper = minibar.querySelector( '.block_messages_wrapper' );
    minibar.classList.add( 'show_blocks_window' );
    wrapper.querySelector( '.title .text' ).innerHTML = parentBlock.querySelector( '.title' ).innerText;
    wrapper.querySelector( '.messages' ).innerHTML = rails.innerHTML;
    wrapper.querySelectorAll( '.messages .message' ).forEach( message => {
      message.style.backgroundColor = parentBlock.style.backgroundColor;
    } );
    if ( !wrapper.getAttribute( 'style' ) )
      centerElement( wrapper );
  } );
} );


draggable(
  minibar.querySelector( '.block_messages_wrapper .title' ),
  minibar.querySelector( '.block_messages_wrapper' )
);
window.addEventListener( 'resize', () =>
  fixPosition( minibar.querySelector( '.block_messages_wrapper' ) )
);


more.querySelectorAll( '.message_rails' ).forEach( ( messageRails, index ) => {
  setTimeout( () => {

    const messagesTotal = messageRails.querySelectorAll( '.message' ).length;
    const parentBlock = messageRails.closest( '.block' );
    const interactiveCorner = parentBlock.querySelector( '.interactive_corner' );

    moreBlocks_MessagesRailsIntervals.push(
      setInterval( () => {

        if ( messageRails.style.top === '' ) {
          messageRails.style.top = '0';
          interactiveCorner.classList.add( 'show_icon' );
        }
        else {
          const num = parseInt( messageRails.style.top ) / 160;

          if ( Math.abs( num ) < messagesTotal - 1 ) {
            messageRails.style.top = ( num - 1 ) * 160 + 'px';
            interactiveCorner.classList.add( 'show_icon' );
          }
          else {
            messageRails.style.top = null;
            interactiveCorner.classList.remove( 'show_icon' );
          }
        }

      }, 5000)
    );

  }, index * 50 );
} );


async function showCurrentTime() {
  const selector = minibar.querySelector( '.time' );
  const currentTime = new Date()
    .toLocaleDateString( 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      hour12: false,
      minute: '2-digit',
      timeZone: 'UTC'
    } );
  const previousText = selector.innerText;
  if ( previousText !== currentTime )
    selector.innerText = currentTime;
}


} )();