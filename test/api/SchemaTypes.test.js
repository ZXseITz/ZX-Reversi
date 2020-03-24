const {Schema} = require('../../src/api/Schema.js');
const {ObjectID} = require('mongodb');

test('test boolean type', () => {
    expect(Schema.Types.bool(undefined)).toBeFalsy();
    expect(Schema.Types.bool("test")).toBeFalsy();
    expect(Schema.Types.bool(2)).toBeFalsy();
    expect(Schema.Types.bool(0.5)).toBeFalsy();
    expect(Schema.Types.bool(true)).toBeTruthy();
    expect(Schema.Types.bool({})).toBeFalsy();
    expect(Schema.Types.bool([])).toBeFalsy();
    expect(Schema.Types.bool(new Date())).toBeFalsy();
    expect(Schema.Types.bool(new ObjectID("5e77969a654bd96a0097daa1"))).toBeFalsy();
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
    expect(Schema.Types.int(new ObjectID("5e77969a654bd96a0097daa1"))).toBeFalsy();
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
    expect(Schema.Types.float(new ObjectID("5e77969a654bd96a0097daa1"))).toBeFalsy();
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
    expect(Schema.Types.object(new ObjectID("5e77969a654bd96a0097daa1"))).toBeFalsy();
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
    expect(Schema.Types.array(new ObjectID("5e77969a654bd96a0097daa1"))).toBeFalsy();
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
    expect(Schema.Types.date(new ObjectID("5e77969a654bd96a0097daa1"))).toBeFalsy();
});

test('test date type', () => {
    expect(Schema.Types.objectid(undefined)).toBeFalsy();
    expect(Schema.Types.objectid("test")).toBeFalsy();
    expect(Schema.Types.objectid(2)).toBeFalsy();
    expect(Schema.Types.objectid(0.5)).toBeFalsy();
    expect(Schema.Types.objectid(true)).toBeFalsy();
    expect(Schema.Types.objectid({})).toBeFalsy();
    expect(Schema.Types.objectid([])).toBeFalsy();
    expect(Schema.Types.objectid(new Date())).toBeFalsy();
    expect(Schema.Types.objectid(new ObjectID("5e77969a654bd96a0097daa1"))).toBeTruthy();
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
    expect(Schema.Types.str(new ObjectID("5e77969a654bd96a0097daa1"))).toBeFalsy();
});

test('test name type', () => {
    expect(Schema.Types.name(undefined)).toBeFalsy();
    expect(Schema.Types.name("")).toBeFalsy();
    expect(Schema.Types.name("test")).toBeTruthy();
    expect(Schema.Types.name("test1_0df")).toBeTruthy();
    expect(Schema.Types.name("test1.uz")).toBeFalsy();
    expect(Schema.Types.name("test1$")).toBeFalsy();
    expect(Schema.Types.name("{$exists: true}")).toBeFalsy();
});

test('test email type', () => {
    expect(Schema.Types.email(undefined)).toBeFalsy();
    expect(Schema.Types.email("")).toBeFalsy();
    expect(Schema.Types.email("test")).toBeFalsy();
    expect(Schema.Types.email("test1_")).toBeFalsy();
    expect(Schema.Types.email("test@example.com")).toBeTruthy();
    expect(Schema.Types.email("test._1@example.com")).toBeTruthy();
    expect(Schema.Types.email("test@admin.example.com")).toBeTruthy();
    expect(Schema.Types.email("test.adm1@admin.example.com")).toBeTruthy();
    expect(Schema.Types.email("test.adm1@admin.example.com")).toBeTruthy();
    expect(Schema.Types.email("test-adm1.xgc@qc.admin.test.ch")).toBeTruthy();
    expect(Schema.Types.email("test.adm$@admin.example.com")).toBeFalsy();
    expect(Schema.Types.email("{$exists: true}")).toBeFalsy();
});

test('test password type', () => {
    expect(Schema.Types.password(undefined)).toBeFalsy();
    expect(Schema.Types.password("")).toBeFalsy();
    expect(Schema.Types.password("test")).toBeFalsy();
    expect(Schema.Types.password("test1_0df")).toBeFalsy();
    expect(Schema.Types.password("kv{lu03c#vcsl$vzhB")).toBeTruthy();
});