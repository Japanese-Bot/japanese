const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const ISO6391 = require('iso-639-1');
const languages = require('../languages.js');
const axios = require('axios');
const { main_color } = require('../config.js');

module.exports = {
  run: async (client, interaction) => {
    var e = 1;
    if (e = 0) {
      let message = interaction.options?.getString('message');
    let lang = ISO6391.validate(interaction.options?.getString('language')) === true ? ISO6391.getName(interaction.options?.getString('language')) : interaction.options?.getString('language');

    if (ISO6391.validate(lang.toLowerCase()) === false && !languages.includes(lang.toLowerCase())) return interaction.reply({ content: 'Please specify a valid language to translate your message to!', ephemeral: true });

    if (interaction.options?.getString('original_lang') !== null && ISO6391.validate(interaction.options?.getString('original_lang').toLowerCase()) === false && ISO6391.getCode(interaction.options?.getString('original_lang').toLowerCase()) === '') return interaction.reply({ content: 'You\'ve provided an invalid original language, please try again.', ephemeral: true });

    let buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('correct')
          .setLabel(`Correct!`)
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('issue')
          .setLabel(`There's an issue!`)
          .setStyle(ButtonStyle.Danger)
      );
    let disabled_buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('correct')
          .setLabel(`Correct!`)
          .setStyle(ButtonStyle.Success)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId('issue')
          .setLabel(`There's an issue!`)
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true)
      );
    
    await interaction.deferReply();

    const params = new URLSearchParams();
    params.append("q", message);
    params.append("target", ISO6391.getCode(lang.toLowerCase()));
    
    if (interaction.options?.getString('original_lang') !== null) params.append("source", ISO6391.validate(interaction.options?.getString('original_lang')) === true ? interaction.options?.getString('original_lang').toLowerCase() : ISO6391.getCode(interaction.options?.getString('original_lang')).toLowerCase());

    await axios.request({
      method: 'POST',
      url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/gzip',
        'X-RapidAPI-Key': process.env.RapidAPI_Key,
        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
      },
      data: params
    }).then(resp => {
      if (!resp.data.data.translations[0]['translatedText']) return interaction.editReply({ content: 'An error occurred while translating your text!' });

      let embed = new EmbedBuilder()
        .setColor(main_color)
        .setTitle('Translation')
        .addFields(
          { name: 'Translation', value: `\`\`\`${resp.data.data.translations[0]['translatedText']}\`\`\``, inline: true },
          { name: 'Language', value: `\`\`\`${lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase()}\`\`\``, inline: true }
        )
        .setFooter({ text: `${interaction.options?.getString('original_lang') === null ? `Detected Source Language: ${ISO6391.getName(resp.data.data.translations[0]['detectedSourceLanguage'])}` : `Source Language: ${interaction.options?.getString('original_lang').charAt(0).toUpperCase() + interaction.options?.getString('original_lang').slice(1).toLowerCase()}`}`, iconURL: `${client.user.avatarURL()}?size=2048` })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed], components: [buttons] }).then(() => {
        e++;
        setTimeout(() => {
          interaction.editReply({ components: [disabled_buttons] })
        }, 5000);
      });
    }).catch(resp => {
      function embed(err) {
        return new EmbedBuilder()
          .setColor(main_color)
          .setTitle('Error')
          .setDescription(`${err}`)
          .addFields({ name: 'Error', value: `\`${resp.response.data.error.message}\`` })
          .setFooter({ text: client.user.username, iconURL: `${client.user.avatarURL()}?size=2048` })
          .setTimestamp();
      };

      console.log(resp.response.data);
      if (resp.response.data && resp.response.data.error.message.includes('Bad language pair')) return interaction.editReply({ embeds: [embed('You\'ve provided an invalid language pair, please try again.')] });
      
      return interaction.editReply({ content: 'An error occurred while translating your text!' });
    });
    } else {
      return interaction.reply({ content: 'You have reached the limit for translating messages in **this server**.', ephemeral: true });
    }
  }
};