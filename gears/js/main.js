import { config } from '../../config.js';
import { readTextFile } from '../modules/js_xhr_ajax/xhr_ajax.min.js';
import { replaceKeyword } from './html_replace.js';
import { addPreview } from './preview.js';


let latestUpdateDate;

readTextFile( { url: config.jsonDataSource }, rawData => {
  const json = JSON.parse( rawData );
  const mainBlock = document.querySelector( config.mainWrapper );
  mainBlock.innerHTML += getHTMLFromTasks( json.tasks );
  document.querySelector( '#main_wrapper .icebreak_block.main .latest_update' ).innerText = latestUpdateDate.toLocaleDateString( undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  } );
  if ( json.more_to_come && json.more_to_come === true )
    mainBlock.innerHTML += getHTMLFromTasks( [ {
      title: 'And more?',
      emoji: '❓',
    } ] );
  // addPreview();
} );


function htmlReplace( initialString, replaceTo ) {
  if ( config.html.defaultReplacement !== undefined )
    return replaceKeyword(
      initialString, replaceTo, config.html.defaultReplacement
    );
  else
    return replaceKeyword(
      initialString, replaceTo
    );
}


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
      html.title = htmlReplace( config.html.title, task.title );

    if ( task.description )
      html.description = htmlReplace( config.html.description, task.description );

    if ( task.emoji )
      html.emoji = htmlReplace( config.html.emoji, task.emoji );

    if ( task.status ) {
      const statusObjects = Object.keys( config.statuses ).indexOf( task.status );
      if ( statusObjects >= 0 ) {
        const statusObject = config.statuses[ task.status ];
        html.status = `<div class='status ${ task.status }'>`;
        if ( html.emoji.length === 0 )
          html.emoji = statusObject.emoji;
        else
          html.status += statusObject.emoji;
        html.status += `<span>${ statusObject.text }</span></div>`;
      }
    }

    if ( task.progress !== undefined ) {
      html.progress = `<span class='number current'>${ task.progress }</span>`;

      if ( task.progress_checkpoint || task.progress_change ) {
        let additionalClass = '';
        let difference = 0;

        if ( task.progress_change === undefined )
          difference = task.progress - task.progress_checkpoint;
        else
          difference = task.progress_change;

        if ( task.progress_direction === '+' && difference > 0 || task.progress_direction === '-' && difference < 0 )
          additionalClass = ' positive';
        else if ( task.progress_direction === '+' && difference < 0 || task.progress_direction === '-' && difference > 0 )
          additionalClass = ' negative';

        if ( difference > 0 )
          difference = '+' + difference;

        html.progress += ` <span class='change${ additionalClass }'>${ difference }</span>`;
      }
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
      const date = new Date( d[0], d[1] - 1, d[2] );
      const dateString = date.toLocaleDateString( undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      } );

      html.last_update = htmlReplace( config.html.last_update, dateString );

      if ( latestUpdateDate === undefined || latestUpdateDate.getTime() < date.getTime() )
        latestUpdateDate = date;
    }

    if ( task.subtasks )
      html.subtasks = htmlReplace( config.html.subtasks, getHTMLFromTasks( task.subtasks ) );

    taskHTML += htmlReplace( config.html.taskBlock, {
      emoji: html.emoji,
      title: html.title,
      description: html.description,
      lastupdate: html.last_update,
      status: html.status,
      progress: html.progress,
      subtasks: html.subtasks,
    } );

  } );

  return taskHTML;
}