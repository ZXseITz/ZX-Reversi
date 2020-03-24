const {Schema} = require('../../src/api/Schema.js');
const {ValidationError} = require('../../src/api/Errors.js');

const schema = new Schema([
    {name: 'field', type: Schema.Types.str, required: true},
    {name: 'flag', type: Schema.Types.bool, required: false},
    {name: 'state', type: Schema.Types.int},
]);


describe('test schema validate create', () => {
    test('all fields', () => {
        const doc = schema.validateCreate({
            field: "test",
            flag: true,
            state: 0
        });
        expect(doc.field).toEqual("test");
        expect(doc.flag).toEqual(true);
        expect(doc.state).toEqual(0);
        expect(doc.created_at).toBeDefined();
        expect(doc.updated_at).toBeDefined();
    });

    test('required fields', () => {
        const doc = schema.validateCreate({
            field: "test"
        });
        expect(doc.field).toEqual("test");
        expect(doc.created_at).toBeDefined();
        expect(doc.updated_at).toBeDefined();
    });

    test('redundant fields', () => {
        const doc = schema.validateCreate({
            field: "test",
            redundant: 48
        });
        expect(doc.field).toEqual("test");
        expect(doc.redundant).toBeUndefined();
        expect(doc.created_at).toBeDefined();
        expect(doc.updated_at).toBeDefined();
    });

    test('invalid doc', () => {
        const execute = () => schema.validateCreate(undefined);
        expect(execute).toThrow(ValidationError);
        expect(execute).toThrow('document is undefined');
    });

    test('invalid field', () => {
        const execute = () => schema.validateCreate({
            field: 12,
        });
        expect(execute).toThrow(ValidationError);
        expect(execute).toThrow('invalid field field');
    });

    test('invalid fields', () => {
        const execute = () => schema.validateCreate({
            field: 12,
            flag: "true",
            redundant: 0
        });
        expect(execute).toThrow(ValidationError);
        expect(execute).toThrow('invalid field field, invalid field flag');
    });

    test('missing field', () => {
        const execute = () => schema.validateCreate({
            state: 0
        });
        expect(execute).toThrow(ValidationError);
        expect(execute).toThrow('missing required field field');
    });
});

describe('test schema validate update', () => {
    test('all fields', () => {
        const doc = schema.validateUpdate({
            field: "test",
            flag: true,
            state: 0
        });
        expect(doc.field).toEqual("test");
        expect(doc.flag).toEqual(true);
        expect(doc.state).toEqual(0);
        expect(doc.created_at).toBeUndefined();
        expect(doc.updated_at).toBeDefined();
    });

    test('redundant fields', () => {
        const doc = schema.validateUpdate({
            field: "test",
            redundant: 48
        });
        expect(doc.field).toEqual("test");
        expect(doc.redundant).toBeUndefined();
        expect(doc.created_at).toBeUndefined();
        expect(doc.updated_at).toBeDefined();
    });

    test('invalid doc', () => {
        const execute = () => schema.validateUpdate(undefined);
        expect(execute).toThrow(ValidationError);
        expect(execute).toThrow('document is undefined');
    });

    test('invalid field', () => {
        const execute = () => schema.validateUpdate({
            field: 12,
        });
        expect(execute).toThrow(ValidationError);
        expect(execute).toThrow('invalid field field');
    });

    test('invalid fields', () => {
        const execute = () => schema.validateUpdate({
            field: 12,
            flag: "true",
            redundant: 0
        });
        expect(execute).toThrow(ValidationError);
        expect(execute).toThrow('invalid field field, invalid field flag');
    });
});