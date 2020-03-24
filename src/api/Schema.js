const {Collection, ObjectID} = require('mongodb');
const {ValidationError} = require('./Errors.js');

const nameRegex = /^\w*$/;    //fixme
const emailRegex = /^.*$/;    //fixme
const passwordRegex = /^.*$/;    //fixme

const keywords = new Set(['_id', 'created_at', 'updated_at']);

class Schema {
    /**
     * Model constructor
     *
     * @param {Object[]} fields - Model field types
     * @param {Function} fields[].name - field name
     * @param {Function} fields[].type - field validation function
     * @param {boolean} [fields[].required] - true if field must be set on creation, or false otherwise
     */
    constructor(fields) {
        this._fields = {};
        fields.forEach(field => {
            const fieldName = field.name;
            if (keywords.has(fieldName)) throw new Error(`field ${fieldName} is used by the application`);
            this._fields[field.name] = field;
        });
    }

    validateCreate(doc) {
        if (!doc) throw new ValidationError("document is undefined");
        const errors = [];
        const now = new Date();
        const create = {
            created_at: now,
            updated_at: now,
        };
        Object.entries(this._fields).forEach(([name, field]) => {
            if (field.required) {
                if (!doc.hasOwnProperty(name)) errors.push(`missing required field ${name}`);
                else if (!field.type(doc[name])) errors.push(`invalid field ${name}`);
                else create[name] = doc[name];
            } else if (doc.hasOwnProperty(name)) {
                if (!field.type(doc[name])) errors.push(`invalid field ${name}`);
                else create[name] = doc[name];
            }
        });
        if (errors.length > 0) throw new ValidationError(errors.join(', '));
        return create;
    }

    validateUpdate(doc) {
        if (!doc) throw new ValidationError("document is undefined");
        const errors = [];
        const now = new Date();
        const update = {
            updated_at: now
        };
        Object.entries(doc).forEach(([name, value]) => {
            if (this._fields.hasOwnProperty(name)) {
                if (!this._fields[name].type(value)) errors.push(`invalid field ${name}`);
                else update[name] = value;
            }
        });
        if (errors.length > 0) throw new ValidationError(errors.join(', '));
        return update;
    }
}

Schema.Types = {
    objectid: (value) => value.constructor.name === 'ObjectID',
    str: (value) => typeof value === 'string',
    name: (value) => typeof value === 'string' && nameRegex.test(value),
    email: (value) => typeof value === 'string' && emailRegex.test(value),
    password: (value) => typeof value === 'string' && passwordRegex.test(value),
    bool: (value) => typeof value === 'boolean',
    int: (value) => Number.isInteger(value),
    float: (value) => typeof value === 'number',
    date: (value) => !!value && value.constructor === Date,
    object: (value) => !!value && value.constructor === Object,
    array: (value) => !!value && value.constructor === Array,
};

module.exports = {
    Schema,
    userSchema: new Schema([
        {name: 'name', type: Schema.Types.name, required: true},
        {name: 'email', type: Schema.Types.email, required: true},
        {name: 'password', type: Schema.Types.password, required: true},
    ]),
    gameSchema: new Schema([
        {name: 'white', type: Schema.Types.objectid, required: true},
        {name: 'black', type: Schema.Types.objectid, required: true},
        {name: 'turns', type: Schema.Types.array, required: true},
        {name: 'end', type: Schema.Types.int, required: true},
    ])
};
