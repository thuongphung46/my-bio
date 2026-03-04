import type { NewProductTypeInput } from '../../domain/entities/ProductType';
import type { ProductTypeRepository } from '../../domain/repositories/ProductTypeRepository';

export class CreateProductTypeUseCase {
  constructor(private readonly repository: ProductTypeRepository) {}

  async execute(input: NewProductTypeInput): Promise<void> {
    const trimmedName = input.name.trim();
    if (!trimmedName) {
      throw new Error('Tên loại mặt hàng không được để trống.');
    }

    await this.repository.createType({ name: trimmedName });
  }
}

