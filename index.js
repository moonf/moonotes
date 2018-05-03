const Telegraf = require('telegraf');
const mongoose = require('mongoose');

const bot = new Telegraf(process.env.BOT_TOKEN);

mongoose.connect('mongodb://localhost/moonotes');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  name: String,
  description: String,
  type: String, // book, movie, etc.
  author: Number,
});

const Note = mongoose.model('Note', noteSchema);

bot.command('/add', ctx => {
  const message = ctx.message;
  const myNote = new Note({
    name: message.text.split(';\n')[0].replace('/add ', ''),
    description: message.text.split(';\n')[1],
    type: message.text.split(';\n')[2].toLowerCase(),
    author: message.from.id,
  })

  myNote.save((err, mess) => {
    ctx.reply('Saved! ✅')
  });
});

bot.command('/getRandomBook', ctx => {
  Note.find({
    type: 'book',
    author: ctx.message.from.id,
  })
  .then(books => books[Math.floor(Math.random() * books.length)])
  .then(el => {
    ctx.reply(
      `Name: ${el.name};\n` +
      `Description: ${el.description};\n` +
      `Type: ${el.type};`
      );
    Note.remove({ name: el.name }, err => {
      if (err) console.log(err);
    });
  })
  .catch(err => {
    ctx.reply('Empty');
  });
});

bot.command('/getRandomMovie', ctx => {
  Note.find({
    type: 'movie',
    author: ctx.message.from.id,
  })
  .then(movies => movies[Math.floor(Math.random() * movies.length)])
  .then(el => {
    ctx.reply(
      `Name: ${el.name};\n` +
      `Description: ${el.description};\n` +
      `Type: ${el.type};`
      );

    Note.remove({ name: el.name }, err => {
      if (err) console.log(err);
    });

  })
  .catch(err => {
    ctx.reply('Empty');
  });
});

bot.command('/getAll', ctx => {
  Note.find((err, msg) => {
    if (msg.length) {
      msg.forEach(e => {
        ctx.reply(
        `Name: ${e.name};\n` +
        `Description: ${e.description};\n` +
        `Type: ${e.type};`
        );
      });
    } else {
      ctx.reply('Empty');
    }
  });
});

bot.startPolling();
