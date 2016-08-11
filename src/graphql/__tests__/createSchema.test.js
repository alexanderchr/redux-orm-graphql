import test from 'ava';
import { graphql } from 'graphql';
import { Schema } from 'redux-orm';

import createSchema from '../createSchema';
import { Credentials, User, Todo, Tag } from './testModels'

test('something', (t) => {
  const ormSchema = new Schema();
  ormSchema.register(Credentials, User, Todo, Tag);
  const models = ormSchema.getModelClasses();

  const graphQlSchema = createSchema(models);

  const session = ormSchema.withMutations(ormSchema.getDefaultState());
  session.User.create({ name: 'Alexander', age: 120 });
  session.User.create({ name: 'Christiansson', age: 133 });
  session.Credentials.create({ username: 'hello', password: 'pizza123', user: 0 });
  session.Todo.create({ name: 'Something', done: false, user: 0 });
  session.Todo.create({ name: 'Important', done: true });

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

  const result = graphql(
    graphQlSchema,
    query,
    { session },
  );

  result.then(r => console.log(r.data.todo[0].user));
});
