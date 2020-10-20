const game = require('./game')

require('yargs')
    .command('create-game [whitePlayer] [blackPlayer]', 'Crate a new game',
        (args) => {
            args.positional('whitePlayer', {
                type: 'string',
                describe: 'the object of the white player'
            });
            args.positional('blackPlayer', {
                type: 'string',
                describe: 'the object of the black player'
            });
        }, argv => {
            console.log(`new game id: ${game.create(argv.whitePlayer, argv.blackPlayer)}`);
        })
    .help()
    .argv