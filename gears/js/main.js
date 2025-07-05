import { readTextFile } from '../modules/js_xhr_ajax/xhr_ajax.min.js';

const statuses = [ 'ongoing', 'stopped', 'done', 'pending', 'improve' ];

readTextFile( { url: '../../data.json' }, rawData => {
  const json = JSON.parse( rawData );
  const mainBlock = document.getElementById( 'main_block' );
  mainBlock.innerHTML += getHTMLFromTasks( json.tasks );
  if ( json.more_to_come && json.more_to_come === true )
    mainBlock.innerHTML += getHTMLFromTasks( [ {
      title: 'And more?',
      emoji: '❓',
    } ] );
} );

function getHTMLFromTasks( tasksArray ) {
  let taskHTML = '';
  tasksArray.forEach( task => {
    let html = {
      title: '',
      emoji: '',
      status: '',
      progress: '',
      progress_precision: '',
      last_update: '',
      subtasks: '',
    };

    if ( task.title )
      html.title = `<div class='title'>${ task.title }</div>`;

    if ( task.emoji )
      html.emoji = task.emoji;

    if ( task.status && statuses.indexOf( task.status ) >= 0 ) {
      html.status = `<div class='status ${ task.status }'>`;
      if ( html.emoji.length === 0 ) {
        switch ( task.status ) {
          case 'ongoing': html.emoji = '▶️'; break;
          case 'stopped': html.emoji = '🛑'; break;
          case 'done': html.emoji = '✅'; break;
          case 'pending': html.emoji = '⏱️'; break;
          case 'improve': html.emoji = '⬆️'; break;
        }
      }
      else {
        switch ( task.status ) {
          case 'ongoing': html.status += '▶️ '; break;
          case 'stopped': html.status += '🛑 '; break;
          case 'done': html.status += '✅ '; break;
          case 'pending': html.status += '⏱️ '; break;
          case 'improve': html.status += '⬆️ '; break;
        }
      }
      switch ( task.status ) {
        case 'ongoing': html.status += '<span>Ongoing</span>'; break;
        case 'stopped': html.status += '<span>Stopped</span>'; break;
        case 'done': html.status += '<span>Done</span>'; break;
        case 'pending': html.status += '<span>Pending</span>'; break;
        case 'improve': html.status += '<span>Done, but improvements can be possible</span>'; break;
      }
      html.status += `</div>`;
    }

    if ( task.progress ) {
      html.progress = `<div class='progress'>`;
      if ( task.progress_precision === true )
        html.progress += `⛳ ${ task.progress } (precisely)`;
      else if ( task.progress_precision === false )
        html.progress += `🎲 ${ task.progress } (imprecisely)`;
      html.progress += `</div>`;
    }

    if ( task.last_update ) {
      const d = task.last_update.split( '.' );
      const date = new Date( d[0], d[1] - 1, d[2] ).toDateString();
      html.last_update = `<div class='last_update'>Last update:<br>${ date }</div>`;
    }

    if ( task.subtasks )
      html.subtasks = `<div class='subtasks'>${ getHTMLFromTasks( task.subtasks ) }</div>`;

    taskHTML += `
      <div class='task'>
        <div class='emoji'>${ html.emoji }</div>
        <div class='info'>
          ${ html.last_update }
          ${ html.title }
          ${ html.status }
          ${ html.progress }
          ${ html.subtasks }
        </div>
      </div>`;
  } );

  return taskHTML;
}