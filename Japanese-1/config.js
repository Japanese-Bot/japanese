module.exports = {
  token: process.env.TOKEN,
  whitelisted: ["987500776735785031", "998423423711719506"],
  slash_commands: [
    { name: 'help', description: 'Information about the bot.', type: 1 },
    {
      name: 'translate',
      description: 'Translate from 100+ different languages.',
      type: 1,
      options: [
        {
          type: 3,
          name: 'message',
          description: 'The message to translate.',
          required: true
        },
        {
          type: 3,
          name: 'language',
          description: 'The language you want to translate to.',
          required: true
        },
        {
          type: 3,
          name: 'original_lang',
          description: 'The original langauge (optional)',
          required: false
        }
      ]
    },
    {
      name: 'sentence',
      description: 'Generates a random sentence from 8 languages.',
      type: 1,
      options: [
        {
          type: 3,
          name: 'language',
          description: 'The language of the quote to generate (optional)',
          required: false,
          choices: [
            {
              name: 'English',
              value: 'en'
            },
            {
              name: 'Spanish',
              value: 'es'
            },
            {
              name: 'Portuguese',
              value: 'pt'
            },
            {
              name: 'Italian',
              value: 'it'
            },
            {
              name: 'German',
              value: 'de'
            },
            {
              name: 'French',
              value: 'fr'
            },
            {
              name: 'Czech',
              value: 'cs'
            },
            {
              name: 'Slovak',
              value: 'sk'
            }
          ]
        }
      ]
    },
    {
      name: 'quote',
      description: 'Generates a random quote from 8 languages.',
      type: 1,
      options: [
        {
          type: 3,
          name: 'language',
          description: 'The language of the quote to generate (optional)',
          required: false,
          choices: [
            {
              name: 'English',
              value: 'en'
            },
            {
              name: 'Spanish',
              value: 'es'
            },
            {
              name: 'Portuguese',
              value: 'pt'
            },
            {
              name: 'Italian',
              value: 'it'
            },
            {
              name: 'German',
              value: 'de'
            },
            {
              name: 'French',
              value: 'fr'
            },
            {
              name: 'Czech',
              value: 'cs'
            },
            {
              name: 'Slovak',
              value: 'sk'
            }
          ]
        }
      ]
    }
  ],
  main_color: 0x037a59
}