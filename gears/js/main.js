import { readTextFile } from '../modules/js_xhr_ajax/xhr_ajax.min.js';

const statuses = [
  { id: 'ongoing', text: 'Ongoing', emoji: '▶️' },
  { id: 'stopped', text: 'Stopped', emoji: '🛑' },
  { id: 'done', text: 'Done', emoji: '✅' },
  { id: 'pending', text: 'Pending', emoji: '⏱️' },
  { id: 'improve', text: 'Done, but improvements can be possible', emoji: '⬆️' },
];

readTextFile( { url: './data.json' }, rawData => {
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
      description: '',
      emoji: '',
      status: '',
      progress: '',
      progress_bar: '',
      last_update: '',
      subtasks: '',
    };

    if ( task.title )
      html.title = `<div class='title'>${ task.title }</div>`;

    if ( task.description )
      html.description = `<div class='description'>${ task.description }</div>`;

    if ( task.emoji )
      html.emoji = task.emoji;

    if ( task.status ) {
      const statusObjects = statuses.filter( obj => obj.id === task.status );
      if ( statusObjects.length === 1 ) {
        const statusObject = statusObjects[ 0 ];
        html.status = `<div class='status ${ task.status }'>`;
        if ( html.emoji.length === 0 )
          html.emoji = statusObject.emoji;
        else
          html.status += statusObject.emoji;
        html.status += `<span>${ statusObject.text }</span></div>`;
      }
    }

    if ( task.progress ) {
      html.progress = `<span class='number current'>${ task.progress }</span>`;

      if ( task.progress_change )
        html.progress += ` <span class='change'>${ task.progress_change }</span>`;
      if ( task.progress_goal ) {
        let progressPrefix = '';
        if ( task.progress_goal_precision && task.progress_goal_precision !== true ) {
          switch ( task.progress_goal_precision ) {
            case false: progressPrefix = '≈'; break;
            case 'more': progressPrefix = '>'; break;
            case 'less': progressPrefix = '<'; break;
          }
        }
        html.progress = `${ html.progress } out of <b>${ progressPrefix }${ task.progress_goal }</b>`;
      }
      if ( task.progress_element )
        html.progress += ' ' + task.progress_element;

      if ( task.progress_precision ) {
        let percentageNumber;
        let percentage = '';

        if ( task.progress_precision !== true || !task.progress_goal )
          html.progress_bar = `<div class='bar imprecise' style='width: 100%'></div>`;
        else {
          if ( task.progress_direction === '-' )
            percentageNumber = ( 1 - task.progress / task.progress_goal ) * 10000;
          else
            percentageNumber = task.progress / task.progress_goal * 10000;
          percentage = Math.floor( percentageNumber ) / 100 + '%';
          html.progress_bar = `<div class='bar' style='width: ${ percentage }'></div>`;
        }

        if ( percentage.length > 0 ) {
          percentage = `<br>${ percentage }`;
        }

        switch ( task.progress_precision ) {
          case true: html.progress = `⛳ ${ html.progress } to go${ percentage }`; break;
          case 'more': html.progress = `🎲 More than ${ html.progress } to go${ percentage }`; break;
          case 'less': html.progress = `🎲 Less than ${ html.progress } to go${ percentage }`; break;
          case false: html.progress = `🎲 Imprecisely ${ html.progress } to go${ percentage }`; break;
        }
      }

      html.progress = `<div class='progress'>${ html.progress_bar }${ html.progress }</div>`;
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
        <div class='info'>
          <div class='emoji'>${ html.emoji }</div>
          <div class='center'>
            ${ html.title }
            ${ html.description }
            </div>
          ${ html.last_update }
        </div>
        ${ html.status }
        ${ html.progress }
        ${ html.subtasks }
      </div>`;
  } );

  return taskHTML;
}