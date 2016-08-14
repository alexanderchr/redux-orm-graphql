import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { OneToOne } from 'redux-orm';
import mapValues from 'lodash.mapvalues';

import mapPropTypeToGraphQLType from './mapPropTypeToGraphQLType';

function createType(ormModel, getType) {
  function fieldsThunk() {
    const idField = { [ormModel.idAttribute]: { type: GraphQLString } };

    const propFields = mapValues(
      ormModel.propTypes,
      (field) => {
        const type = mapPropTypeToGraphQLType(field);
        return { type };
      }
    );

    // 'fk'
    const foreignFields = mapValues(
      ormModel.fields,
      (field) => {
        const relationType = getType(field.toModelName);
        return { type: relationType };
      }
    );

    // opposite of 'fk'
    const virtualFields = mapValues(
      ormModel.virtualFields,
      (field) => {
        const relationType = getType(field.toModelName);

        return field instanceof OneToOne
          ? { type: relationType }
          : { type: new GraphQLList(relationType) };
      }
    )

    return Object.assign({}, idField, propFields, foreignFields, virtualFields);
  }

  return new GraphQLObjectType({
    name: ormModel.modelName,
    fields: fieldsThunk,
  });
}

export default createType;
