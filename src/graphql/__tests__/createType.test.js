import test from 'ava';
import { Model, fk, Schema } from 'redux-orm';
import { GraphQLString, GraphQLBoolean, GraphQLList } from 'graphql';
import PropTypes from 'prop-types';

import createType from '../createType';
import { Credentials, User, Todo, Tag } from './testModels'

const ormSchema = new Schema();
ormSchema.register(Credentials, User, Todo, Tag);
const modelClasses = ormSchema.getModelClasses();

const InitializedCredentials = modelClasses.filter(x => x.modelName === 'Credentials')[0];
const InitializedUser = modelClasses.filter(x => x.modelName === 'User')[0];
const InitializedTodo = modelClasses.filter(x => x.modelName === 'Todo')[0];
const InitializedTag = modelClasses.filter(x => x.modelName === 'Tag')[0];

// Prepare all graphql types. Not great but the option is to mock getType with each
// call to `createType`.
let graphQlTypes;
const getType = (name) => graphQlTypes.filter(x => x.name == name)[0];
graphQlTypes = modelClasses.map(m => createType(m, getType));

test.before(() => { console.log('\nRunning tests...\n'); })

test('creates a type with same name as model', (t) => {
  const type = createType(InitializedUser);
  t.is(type.name, 'User');
});

test('creates a type with id field', (t) => {
  const type = createType(InitializedUser, getType);
  const fields = type.getFields();

  const idField = fields['id'];

  t.is(idField.type, GraphQLString);
});

test('creates a type with id field when using a custom id attribute', (t) => {
  const type = createType(InitializedTag, getType);
  const fields = type.getFields();

  const idField = fields['name'];

  t.is(idField.type, GraphQLString);
});

test('creates a type with propTypes as fields', (t) => {
  const type = createType(InitializedTodo, getType);
  const fields = type.getFields();

  const titleField = fields['title'];
  const doneField = fields['done'];

  // t.not(titleField, null);
  // t.not(doneField, null);
});

test('discerns between different propTypes', (t) => {
  const type = createType(InitializedTodo, getType);
  const fields = type.getFields();

  const titleField = fields['title'];
  const doneField = fields['done'];
  //
  // t.is(titleField.type, GraphQLString);
  // t.is(doneField.type, GraphQLBoolean);
});

test('creates a type with many-to-one relations', (t) => {
  const todoType = createType(InitializedTodo, getType);
  const userType = createType(InitializedUser, getType);

  const userField = todoType.getFields()['user'];
  const todosField = userType.getFields()['todos'];

  t.is(userField.type, getType('User'));
  t.deepEqual(todosField.type, new GraphQLList(getType('Todo')));
});

test('creates a type with many-to-many relations', (t) => {
  const todoType = createType(InitializedTodo, getType);
  const tagType = createType(InitializedTag, getType);

  const tagsField = todoType.getFields()['tags'];
  const todosField = tagType.getFields()['todos'];

  t.deepEqual(tagsField.type, new GraphQLList(getType('Tag')));
  t.deepEqual(todosField.type, new GraphQLList(getType('Todo')));
});

test('creates a type with one-to-one relations', (t) => {
  const userType = createType(InitializedUser, getType);
  const credentialsType = createType(InitializedCredentials, getType);

  const credentialsField = userType.getFields()['credentials'];
  const userField = credentialsType.getFields()['user'];

  t.is(credentialsField.type, getType('Credentials'));
  t.is(userField.type, getType('User'));
});
