export const config = {
  // jsonDataSource: './local/icebreak.json',
  jsonDataSource: 'https://liledix4.github.io/data/icebreak.json',
    // Path or URL to the JSON file/content. OR an object itself! (if you can replicate the structure that is needed for the script)
    // Location must be accessible for HTTP requests (i.e. it's not blocked by CORS and it's not protected by services like CloudFlare).
  statuses: {
    // List of statuses that tasks can have.
    // Object keys work as values for task statuses in JSON, you can change them freely.
    // Each status can have text and emoji, optionally. If you remove them, text will be replaced with an object key, emoji will be replaced with a default one.
    ongoing: { text: 'Ongoing', emoji: '▶️' },
    stopped: { text: 'Stopped', emoji: '🛑' },
    done: { text: 'Done', emoji: '✅' },
    pending: { text: 'Pending', emoji: '⏱️' },
    improve: { text: 'Done, but improvements can be possible', emoji: '⬆️' },
    slowdown: { text: 'Slowed down', emoji: '⏯️' },
  },
  and_more: {
    title: 'And more?',
    description: 'This list is far from being complete. More tasks will be added later, so stay tuned.',
    emoji: '❓',
  },
  mainWrapper: '#main_wrapper',
    // Query selector of an HTML element where the script must add new blocks.
    // See CSS selectors: https://developer.mozilla.org/docs/Web/CSS/CSS_selectors
  default: {
    progress_encouragement: 'to go',
  },
  html: {
    defaultReplacement: '{{REPLACE}}',
    taskBlock: `
      <div class='icebreak_block task{{BLOCKCLASS}}'>
        <div class='info'>
          <div class='emoji'>{{EMOJI}}</div>
          <div class='center'>
            {{TITLE}}
            {{DESCRIPTION}}
          </div>
          {{LASTUPDATE}}
        </div>
        {{STATUS}}
        {{PROGRESS}}
        {{SUBTASKS}}
      </div>`,
    title: '<div class="title">{{REPLACE}}</div>',
    description: '<div class="description">{{REPLACE}}</div>',
    emoji: '{{REPLACE}}',
    status: '<div class="status {{STATUSCLASS}}">{{STATUSTEXT}}</div>',
    status_text: '{{EMOJI}}<span>{{TEXT}}</span>',
    progress: `
      <div class="progress">
        {{PROGRESSBAR}}
        {{EMOJI}}{{IMPRECISION}}<span class="number current">{{CURRENTNUMBER}}{{DIFF}}</span>{{GOAL}}{{ELEMENT}}{{ENCOURAGEMENT}}{{PERCENTAGE}}
      </div>`,
    progress_difference: ' <span class="change{{CLASS}}">{{DIFF}}</span>',
    progress_goal: ' out of <b>{{REPLACE}}</b>',
    progress_element: ' {{REPLACE}}',
    progress_percentage: '<br>{{REPLACE}}%',
    progress_emoji: '{{REPLACE}} ',
    progress_imprecision: '{{REPLACE}} ',
    progress_encouragement: ' {{REPLACE}}',
    progress_bar: '<div class="bar{{CLASS}}" style="width: {{WIDTH}}%"></div>',
    last_update: '<div class="last_update">Last update:<br>{{REPLACE}}</div>',
    subtasks: '<div class="subtasks">{{REPLACE}}</div>',
  },
}