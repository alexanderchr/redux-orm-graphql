import test from 'ava';
import { graphql } from 'graphql';
import { Schema } from 'redux-orm';

import createSchema from '../createSchema';
import { Credentials, User, Todo, Tag } from './testModels'

test('creates a queryable schema', async (t) => {
  const ormSchema = new Schema();
  ormSchema.register(Credentials, User, Todo, Tag);
  const models = ormSchema.getModelClasses();

  const graphQlSchema = createSchema(models);

  const session = ormSchema.withMutations(ormSchema.getDefaultState());
  session.Todo.create({ title: 'Something', done: false, user: 0 });
  session.User.create({ name: 'Alexander', age: 120 });
  session.Credentials.create({ username: 'hello', password: 'pizza123', user: 0 });

  const query = `{
    todo {
      title
      done
      user {
        id
        name
        age
        credentials {
          username
          password
        }
      }
    }
  }`;


  const result = await graphql(
    graphQlSchema,
    query,
    { session },
  );

  const resultTodo = result.data.todo[0];
  t.is(resultTodo.title, 'Something');
  t.is(resultTodo.done, false);

  const resultUser = resultTodo.user;
  t.is(resultUser.name, 'Alexander');
  t.is(resultUser.age, 120);

  const resultCredentials = resultUser.credentials;
  t.is(resultCredentials.username, 'hello');
  t.is(resultCredentials.password, 'pizza123');
});
