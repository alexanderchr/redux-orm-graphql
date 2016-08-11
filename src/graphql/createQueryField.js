import { GraphQLList } from 'graphql';

function createQueryField(graphQlType) {
  return {
    type: new GraphQLList(graphQlType),
    resolve: (root) => {
      return root.session[graphQlType.name].all().toModelArray();
    }
  }
}

export default createQueryField;
