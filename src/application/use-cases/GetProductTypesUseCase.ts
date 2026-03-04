import type { ProductType } from '../../domain/entities/ProductType';
import type { ProductTypeRepository } from '../../domain/repositories/ProductTypeRepository';

export class GetProductTypesUseCase {
  constructor(private readonly repository: ProductTypeRepository) {}

  execute(): Promise<ProductType[]> {
    return this.repository.getTypes();
  }
}

