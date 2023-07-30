export type User = {
  id?: string;
  name: string;
  email: string;
  password?: string;
};

// Type used when searching for a user on data store with a given attribute
export type FindUserConditions = {
  id?: string;
  name?: string;
  email?: string;
};
