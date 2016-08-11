import { Model, many, fk, oneToOne } from 'redux-orm';
import PropTypes from 'prop-types';

export class Credentials extends Model {
  static modelName = 'Credentials';

  static fields = {
    user: oneToOne('User'),
  };

  static propTypes = {
    username: PropTypes.string,
    password: PropTypes.string,
  }
}

export class User extends Model {
  static modelName = 'User';

  static propTypes = {
    name: PropTypes.string,
    age: PropTypes.number,
  };
}

export class Todo extends Model {
  static modelName = 'Todo';

  static propTypes = {
    title: PropTypes.string,
    done: PropTypes.bool,
  };

  static fields = {
    user: fk('User', 'todos'),
    tags: many('Tag', 'todos'),
  };
}

export class Tag extends Model {
  static modelName = 'Tag';

  static propTypes = {
    name: PropTypes.string,
  };
}

Tag.backend = {
  idAttribute: 'name'
};
