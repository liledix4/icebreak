import { config } from '../../config.js';
import { configLocal } from '../../config-local.js';
import { readTextFile } from '../modules/js_xhr_ajax/xhr_ajax.min.js';
import { replaceKeyword } from './html_replace.js';
import { addPreview } from './preview.js';


let jsonSource;
const htmlConf = config.html;
let latestUpdateDate;


if ( configLocal.localMode === true )
  jsonSource = config.jsonDataSource.local;
else
  jsonSource = config.jsonDataSource.remote;


readTextFile( { url: jsonSource }, rawData => {
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
    mainBlock.innerHTML += getHTMLFromTasks( [ config.and_more ] );
  // addPreview();
} );


function htmlReplace( initialString, replaceTo ) {
  if ( htmlConf.defaultReplacement !== undefined )
    return replaceKeyword(
      initialString, replaceTo, htmlConf.defaultReplacement
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
      blockclass: '',
      progress: '',
      lastupdate: '',
      subtasks: '',
    };

    if ( task.title )
      html.title = htmlReplace( htmlConf.title, task.title );

    if ( task.description )
      html.description = htmlReplace( htmlConf.description, task.description );

    if ( task.emoji )
      html.emoji = htmlReplace( htmlConf.emoji, task.emoji );

    if ( task.status ) {
      const statusIsValid = Object.keys( config.statuses ).indexOf( task.status ) >= 0;
      if ( statusIsValid === true ) {
        const statusObject = config.statuses[ task.status ];
        html.blockclass += ' ' + task.status;
        let emoji = '';
        if ( html.emoji.length === 0 )
          html.emoji = statusObject.emoji;
        else
          emoji = statusObject.emoji + ' ';
        html.status = htmlReplace( htmlConf.status, {
          statusclass: task.status,
          statustext: htmlReplace( htmlConf.status_text, {
            emoji: emoji,
            text: statusObject.text,
          } ),
        } );
      }
    }

    if ( task.progress !== undefined ) {
      let htmlProgress = {
        currentnumber: task.progress,
        diff: '',
        goal: '',
        element: '',
        percentage: '',
        emoji: '',
        imprecision: '',
        progressbar: '',
        encouragement: '',
      };
      let htmlProgressBar = {
        class: '',
        width: 0,
      };
      let percentage = '';

      if ( task.progress_checkpoint || task.progress_change ) {
        let diffObj = { class: '', diff: 0 };

        if ( task.progress_change === undefined )
          diffObj.diff = task.progress - task.progress_checkpoint;
        else
          diffObj.diff = task.progress_change;

        if ( task.progress_direction === '+' && diffObj.diff > 0 || task.progress_direction === '-' && diffObj.diff < 0 )
          diffObj.class = ' positive';
        else if ( task.progress_direction === '+' && diffObj.diff < 0 || task.progress_direction === '-' && diffObj.diff > 0 )
          diffObj.class = ' negative';

        if ( diffObj.diff > 0 )
          diffObj.diff = '+' + diffObj.diff;

        htmlProgress.diff = htmlReplace( htmlConf.progress_difference, diffObj );
      }

      if ( task.progress_goal ) {
        let goalPrefix = '';
        if ( task.progress_goal_precision && task.progress_goal_precision !== true ) {
          switch ( task.progress_goal_precision ) {
            case  false: goalPrefix = '≈'; break;
            case 'more': goalPrefix = '>'; break;
            case 'less': goalPrefix = '<'; break;
          }
        }
        htmlProgress.goal = htmlReplace( htmlConf.progress_goal, goalPrefix + task.progress_goal );
      }

      if ( task.progress_element )
        htmlProgress.element = ' ' + task.progress_element;

      if ( typeof task.progress_encouragement === 'string' )
        htmlProgress.encouragement = htmlReplace( htmlConf.progress_encouragement, task.progress_encouragement );
      else if ( task.progress_encouragement === false )
        htmlProgress.encouragement = '';
      else
        htmlProgress.encouragement = htmlReplace( htmlConf.progress_encouragement, config.default.progress_encouragement );

      if ( task.progress_precision !== true || task.progress_goal_precision !== undefined && task.progress_goal_precision !== null && task.progress_goal_precision !== true ) {
        htmlProgressBar.class = ' imprecise';
        htmlProgressBar.width = 100;
      }

      if ( task.progress_goal !== undefined ) {
        let percentageNumber;

        if ( task.progress_direction === '-' )
          percentageNumber = ( 1 - task.progress / task.progress_goal ) * 10000;
        else
          percentageNumber = task.progress / task.progress_goal * 10000;

        percentage = Math.floor( percentageNumber ) / 100;
        htmlProgressBar.width = percentage;
      }

      htmlProgress.progressbar = htmlReplace( htmlConf.progress_bar, htmlProgressBar );

      if ( percentage.length > 0 ) {
        htmlProgress.percentage = htmlReplace( htmlConf.progress_percentage, percentage );
      }

      if ( task.progress_precision === true && ( task.progress_goal_precision === true || task.progress_goal_precision === undefined || task.progress_goal_precision === null ) )
        htmlProgress.emoji = htmlReplace( htmlConf.progress_emoji, '⛳' );
      else
        htmlProgress.emoji = htmlReplace( htmlConf.progress_emoji, '🎲' );

      switch ( task.progress_precision ) {
        case  true : break;
        case 'more': htmlProgress.imprecision = htmlReplace( htmlConf.progress_imprecision, 'More than' ); break;
        case 'less': htmlProgress.imprecision = htmlReplace( htmlConf.progress_imprecision, 'Less than' ); break;
        default:     htmlProgress.imprecision = htmlReplace( htmlConf.progress_imprecision, 'Imprecisely' );
      }

      html.progress = htmlReplace( htmlConf.progress, htmlProgress );
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

      html.lastupdate = htmlReplace( htmlConf.last_update, dateString );

      if ( latestUpdateDate === undefined || latestUpdateDate.getTime() < date.getTime() )
        latestUpdateDate = date;
    }

    if ( task.subtasks )
      html.subtasks = htmlReplace( htmlConf.subtasks, getHTMLFromTasks( task.subtasks ) );

    taskHTML += htmlReplace( htmlConf.taskBlock, html );

  } );

  return taskHTML;
}