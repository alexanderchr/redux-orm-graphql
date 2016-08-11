import { GraphQLSchema, GraphQLObjectType, GraphQLList } from 'graphql';
import createType from './createType';
import createQueryField from './createQueryField';

function createRootQuery(types) {
  const fields = types.reduce(
    (acc, type) => { acc[type.name.toLowerCase()] = createQueryField(type); return acc; },
    {}
  );

  return new GraphQLObjectType({
    name: 'Query',
    fields,
  });
};

function createSchema(models) {
  // bit icky but `createType` eventually has to be able to find graphql types
  // to create relation fields
  let graphQLTypes;
  const getType = (name) => graphQLTypes.filter(x => x.name == name)[0];
  graphQlTypes = models.map(m => createType(m, getType));

  const rootQuery = createRootQuery(graphQLTypes);

  return new GraphQLSchema({
    query: rootQuery,
  });
}

export default createSchema;