/**
 * Base interface for most entity with audit and soft delete
 * */
export interface IBaseEntity<T = any> {
  id?: T;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OmitBaseFields = 'id' | 'updatedAt' | 'createdAt';
