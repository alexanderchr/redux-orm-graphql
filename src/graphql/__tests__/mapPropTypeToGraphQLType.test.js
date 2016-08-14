import test from 'ava';
import PropTypes from 'prop-types';
import {
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';

import mapPropTypeToGraphQlType from '../mapPropTypeToGraphQlType';

test('maps PropTypes.string to GraphQLString', (t) => {
  t.is(
    mapPropTypeToGraphQlType(PropTypes.string),
    GraphQLString
  );
});

test('maps PropTypes.number to GraphQLNumber', (t) => {
  t.is(
    mapPropTypeToGraphQlType(PropTypes.number),
    GraphQLInt
  );
});

test('maps PropTypes.bool to GraphQLBoolean', (t) => {
  t.is(
    mapPropTypeToGraphQlType(PropTypes.bool),
    GraphQLBoolean
  );
});
