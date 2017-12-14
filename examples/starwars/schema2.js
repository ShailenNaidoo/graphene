import {
  ObjectType,
  InterfaceType,
  Schema,
  Field,
  ID,
  EnumType,
  EnumValue
} from '../../src/types';
import { getHero, getFriends, getHuman, getDroid } from './data';

@EnumType()
export class Episode {
  static NEWHOPE = 4;
  static EMPIRE = 5;
  static JEDI = 6;
}

@InterfaceType({
  resolveType: root => {
    return getHuman(root.id) ? Human : Droid;
  }
})
export class Character {
  @Field(ID) id;
  @Field(String) name;
  @Field([Character])
  friends() {
    return getFriends(this);
  }
}

@ObjectType({
  interfaces: [Character]
})
export class Human {
  @Field(String) homePlanet;
}

@ObjectType({
  interfaces: [Character]
})
export class Droid {
  @Field(String) primaryFunction;
}

@ObjectType()
class Query {
  @Field(Character, { episode: Number })
  hero({ episode }) {
    return getHero(episode);
  }

  @Field(Human, { id: String })
  human({ id }) {
    return getHuman(id);
  }

  @Field(Droid, { id: String })
  droid({ id }) {
    return getDroid(id);
  }
}

const schema = new Schema({
  query: Query
});

console.log(schema.toString());
schema
  .execute(
    `{ hero {
  id
}
}`
  )
  .then(resp => console.log(resp));

export default schema;