export const config = {
  jsonDataSource: './data.json',
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
  },
  mainWrapper: '#main_wrapper',
    // Query selector of an HTML element where the script must add new blocks.
    // See CSS selectors: https://developer.mozilla.org/docs/Web/CSS/CSS_selectors
  html: {
    defaultReplacement: '{{REPLACE}}',
    taskBlock: `
      <div class='icebreak_block task'>
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
    title: "<div class='title'>{{REPLACE}}</div>",
    description: "<div class='description'>{{REPLACE}}</div>",
    emoji: '{{REPLACE}}',
    status: "",
    progress: "",
    progress_bar: "",
    last_update: "<div class='last_update'>Last update:<br>{{REPLACE}}</div>",
    subtasks: "<div class='subtasks'>{{REPLACE}}</div>",
  },
}