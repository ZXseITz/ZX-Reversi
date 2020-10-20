const {describe, test} = require("@jest/globals")
const app = require('../../../src/games/reversi/app');

describe('test create', () => {
    test('default', () => {
        app.create()
    });
});