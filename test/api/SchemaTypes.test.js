const {Schema} = require('../../src/api/Schema.js');

test('test boolean type', () => {
    expect(Schema.Types.bool(undefined)).toBeFalsy();
    expect(Schema.Types.bool("test")).toBeFalsy();
    expect(Schema.Types.bool(2)).toBeFalsy();
    expect(Schema.Types.bool(0.5)).toBeFalsy();
    expect(Schema.Types.bool(true)).toBeTruthy();
    expect(Schema.Types.bool({})).toBeFalsy();
    expect(Schema.Types.bool([])).toBeFalsy();
    expect(Schema.Types.bool(new Date())).toBeFalsy();
});

test('test int type', () => {
    expect(Schema.Types.int(undefined)).toBeFalsy();
    expect(Schema.Types.int("test")).toBeFalsy();
    expect(Schema.Types.int(2)).toBeTruthy();
    expect(Schema.Types.int(0.5)).toBeFalsy();
    expect(Schema.Types.int(true)).toBeFalsy();
    expect(Schema.Types.int({})).toBeFalsy();
    expect(Schema.Types.int([])).toBeFalsy();
    expect(Schema.Types.int(new Date())).toBeFalsy();
});

test('test float type', () => {
    expect(Schema.Types.float(undefined)).toBeFalsy();
    expect(Schema.Types.float("test")).toBeFalsy();
    expect(Schema.Types.float(2)).toBeTruthy();
    expect(Schema.Types.float(0.5)).toBeTruthy();
    expect(Schema.Types.float(true)).toBeFalsy();
    expect(Schema.Types.float({})).toBeFalsy();
    expect(Schema.Types.float([])).toBeFalsy();
    expect(Schema.Types.float(new Date())).toBeFalsy();
});

test('test object type', () => {
    expect(Schema.Types.object(undefined)).toBeFalsy();
    expect(Schema.Types.object("test")).toBeFalsy();
    expect(Schema.Types.object(2)).toBeFalsy();
    expect(Schema.Types.object(0.5)).toBeFalsy();
    expect(Schema.Types.object(true)).toBeFalsy();
    expect(Schema.Types.object({})).toBeTruthy();
    expect(Schema.Types.object([])).toBeFalsy();
    expect(Schema.Types.object(new Date())).toBeFalsy();
});

test('test array type', () => {
    expect(Schema.Types.array(undefined)).toBeFalsy();
    expect(Schema.Types.array("test")).toBeFalsy();
    expect(Schema.Types.array(2)).toBeFalsy();
    expect(Schema.Types.array(0.5)).toBeFalsy();
    expect(Schema.Types.array(true)).toBeFalsy();
    expect(Schema.Types.array({})).toBeFalsy();
    expect(Schema.Types.array([])).toBeTruthy();
    expect(Schema.Types.array(new Date())).toBeFalsy();
});

test('test date type', () => {
    expect(Schema.Types.date(undefined)).toBeFalsy();
    expect(Schema.Types.date("test")).toBeFalsy();
    expect(Schema.Types.date(2)).toBeFalsy();
    expect(Schema.Types.date(0.5)).toBeFalsy();
    expect(Schema.Types.date(true)).toBeFalsy();
    expect(Schema.Types.date({})).toBeFalsy();
    expect(Schema.Types.date([])).toBeFalsy();
    expect(Schema.Types.date(new Date())).toBeTruthy();
});

test('test string type', () => {
    expect(Schema.Types.str(undefined)).toBeFalsy();
    expect(Schema.Types.str("test")).toBeTruthy();
    expect(Schema.Types.str(2)).toBeFalsy();
    expect(Schema.Types.str(0.5)).toBeFalsy();
    expect(Schema.Types.str(true)).toBeFalsy();
    expect(Schema.Types.str({})).toBeFalsy();
    expect(Schema.Types.str([])).toBeFalsy();
    expect(Schema.Types.str(new Date())).toBeFalsy();
});