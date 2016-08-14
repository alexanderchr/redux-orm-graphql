import PropTypes from 'prop-types';
import {
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';

function mapPropTypeToGraphQlType(propType) {
  switch (propType) {
    case PropTypes.string:
      return GraphQLString;

    case PropTypes.number:
      return GraphQLInt;

    case PropTypes.bool:
      return GraphQLBoolean;

    default:
      throw new Error('Tried to map a PropType without a corresponding GraphQLType type');
  }
}

export default mapPropTypeToGraphQlType;
