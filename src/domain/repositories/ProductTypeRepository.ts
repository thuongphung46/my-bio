import type { NewProductTypeInput, ProductType } from '../entities/ProductType';

export interface ProductTypeRepository {
  getTypes(): Promise<ProductType[]>;
  createType(input: NewProductTypeInput): Promise<void>;
}

