export interface User {
  id: string; // MongoDB's _id usually comes back as 'id' or '_id'
  name: string;
  email: string;
  createdAt?: Date; // Optional field
}
