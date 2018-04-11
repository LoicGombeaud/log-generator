module.exports = {
  generate: generate
};

function generate() {
  var fs = require('fs');
  var randOutput = require('random-seed').create("Seed for output decision");
  var randPage = require('random-seed').create("Seed for page index");
  var strftime = require('strftime');

  var config = require('./config.json');

  // open log file for writing
  var flags = config.append ? 'a' : 'w';
  var logFileDescriptor = fs.openSync(config.outputFile, flags);

  // start infinite loop
  while (true) {
    // check whether to output
    if (randOutput.random() < config.probability) {
      // roll dice on pages
      var page = config.pages[randPage.range(config.pages.length)];

      // generate log entry and write to file
      var logEntry = [
          '127.0.0.1',
          'SevenLeggedSpider',
          'anonymous',
          '[' + strftime('%d/%b/%Y:%H:%M:%S %z') + ']',
          '"GET /' + page + ' HTTP/1.1"',
          '200',
          Math.floor(Math.random() * 1000),
          '\n'
      ].join(' ');

      fs.writeSync(logFileDescriptor, logEntry);

      if (config.consoleOutput) {
        console.log(logEntry);
      }
    }
  }
}
