import { config } from '../../config.js';
import { config_local } from '../../config_local.js';
import { readTextFile } from '../modules/js_xhr_ajax/xhr_ajax.min.js';
import { replace_keyword } from './html_replace.js';
import { add_preview } from './preview.js';


let file_sources;
let latest_update_date;
const html_config = config.html;


if ( config_local.local_mode === true )
  file_sources = config.file_sources.local;
else
  file_sources = config.file_sources.remote;


readTextFile( { url: file_sources.version }, file_content => {
  document.querySelector( '.version_number' ).innerText = file_content;
} );


readTextFile( { url: file_sources.todo_data }, file_content => {
  const json = JSON.parse( file_content );
  const main_block = document.querySelector( config.main_wrapper );
  main_block.innerHTML += get_html_from_tasks( json.tasks );
  document.querySelector( '#main_wrapper .icebreak_block.main .latest_update' ).innerText = latest_update_date.toLocaleDateString( undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  } );
  if ( json.more_to_come && json.more_to_come === true )
    main_block.innerHTML += get_html_from_tasks( [ config.and_more ] );
  // add_preview();
} );


function html_replace( initial_string, replace_to ) {
  if ( html_config.default_replacement !== undefined )
    return replace_keyword(
      initial_string, replace_to, html_config.default_replacement
    );
  else
    return replace_keyword(
      initial_string, replace_to
    );
}


function get_html_from_tasks( tasks_array ) {
  let task_html = '';

  tasks_array.forEach( task => {
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
      html.title = html_replace( html_config.title, task.title );

    if ( task.description )
      html.description = html_replace( html_config.description, task.description );

    if ( task.emoji )
      html.emoji = html_replace( html_config.emoji, task.emoji );

    if ( task.status ) {
      const status_is_valid = Object.keys( config.statuses ).indexOf( task.status ) >= 0;
      if ( status_is_valid === true ) {
        const status_object = config.statuses[ task.status ];
        html.blockclass += ' ' + task.status;
        let emoji = '';
        if ( html.emoji.length === 0 )
          html.emoji = status_object.emoji;
        else
          emoji = status_object.emoji + ' ';
        html.status = html_replace( html_config.status, {
          statusclass: task.status,
          statustext: html_replace( html_config.status_text, {
            emoji: emoji,
            text: status_object.text,
          } ),
        } );
      }
    }

    if ( task.progress !== undefined ) {
      let html_progress = {
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
      let html_progress_bar = {
        class: '',
        width: 0,
      };
      let percentage = '';

      if ( task.progress_checkpoint || task.progress_change ) {
        let diff_obj = { class: '', diff: 0 };

        if ( task.progress_change === undefined )
          diff_obj.diff = task.progress - task.progress_checkpoint;
        else
          diff_obj.diff = task.progress_change;

        if ( task.progress_direction === '+' && diff_obj.diff > 0 || task.progress_direction === '-' && diff_obj.diff < 0 )
          diff_obj.class = ' positive';
        else if ( task.progress_direction === '+' && diff_obj.diff < 0 || task.progress_direction === '-' && diff_obj.diff > 0 )
          diff_obj.class = ' negative';

        if ( diff_obj.diff > 0 )
          diff_obj.diff = '+' + diff_obj.diff;

        html_progress.diff = html_replace( html_config.progress_difference, diff_obj );
      }

      if ( task.progress_goal ) {
        let goal_prefix = '';
        if ( task.progress_goal_precision && task.progress_goal_precision !== true ) {
          switch ( task.progress_goal_precision ) {
            case  false: goal_prefix = '≈'; break;
            case 'more': goal_prefix = '>'; break;
            case 'less': goal_prefix = '<'; break;
          }
        }
        html_progress.goal = html_replace( html_config.progress_goal, goal_prefix + task.progress_goal );
      }

      if ( task.progress_element )
        html_progress.element = ' ' + task.progress_element;

      if ( typeof task.progress_encouragement === 'string' )
        html_progress.encouragement = html_replace( html_config.progress_encouragement, task.progress_encouragement );
      else if ( task.progress_encouragement === false )
        html_progress.encouragement = '';
      else
        html_progress.encouragement = html_replace( html_config.progress_encouragement, config.default.progress_encouragement );

      if ( task.progress_precision !== true || task.progress_goal_precision !== undefined && task.progress_goal_precision !== null && task.progress_goal_precision !== true ) {
        html_progress_bar.class = ' imprecise';
        html_progress_bar.width = 100;
      }

      if ( task.progress_goal !== undefined ) {
        let percentage_number;

        if ( task.progress_direction === '-' )
          percentage_number = ( 1 - task.progress / task.progress_goal ) * 10000;
        else
          percentage_number = task.progress / task.progress_goal * 10000;

        percentage = Math.floor( percentage_number ) / 100;
        html_progress_bar.width = percentage;
      }

      html_progress.progressbar = html_replace( html_config.progress_bar, html_progress_bar );

      if ( percentage.length > 0 ) {
        html_progress.percentage = html_replace( html_config.progress_percentage, percentage );
      }

      if ( task.progress_precision === true && ( task.progress_goal_precision === true || task.progress_goal_precision === undefined || task.progress_goal_precision === null ) )
        html_progress.emoji = html_replace( html_config.progress_emoji, '⛳' );
      else
        html_progress.emoji = html_replace( html_config.progress_emoji, '🎲' );

      switch ( task.progress_precision ) {
        case  true : break;
        case 'more': html_progress.imprecision = html_replace( html_config.progress_imprecision, 'More than' ); break;
        case 'less': html_progress.imprecision = html_replace( html_config.progress_imprecision, 'Less than' ); break;
        default:     html_progress.imprecision = html_replace( html_config.progress_imprecision, 'Imprecisely' );
      }

      html.progress = html_replace( html_config.progress, html_progress );
    }

    if ( task.last_update ) {
      const d = task.last_update.split( '.' );
      const date = new Date( d[0], d[1] - 1, d[2] );
      const date_string = date.toLocaleDateString( undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      } );

      html.lastupdate = html_replace( html_config.last_update, date_string );

      if ( latest_update_date === undefined || latest_update_date.getTime() < date.getTime() )
        latest_update_date = date;
    }

    if ( task.subtasks )
      html.subtasks = html_replace( html_config.subtasks, get_html_from_tasks( task.subtasks ) );

    task_html += html_replace( html_config.task_block, html );

  } );

  return task_html;
}