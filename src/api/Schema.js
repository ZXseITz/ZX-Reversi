const {ObjectID} = require('mongodb');
const {ValidationError} = require('./Errors.js');

const nameRegex = /^\w+$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,20})/;

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

    /**
     * Validates a document for insertion.
     * Appends created_at and updated_at automatically
     *
     * @param {Object} doc - document to validate
     * @returns {{updated_at: Date, created_at: Date}}
     */
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

    /**
     * Validates a document for updating.
     * Appends updated_at automatically
     *
     * @param {Object} doc
     * @returns {{updated_at: Date}}
     */
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
    objectid: (value) => !!value && value.constructor === ObjectID,
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
