export type User = {
  id?: string;
  name: string;
  email: string;
  password?: string;
};

export type FindUserConditions = {
  id?: string;
  name?: string;
  email?: string;
};
