import type { NewProductInput } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/repositories/ProductRepository';

export class CreateProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(input: NewProductInput): Promise<void> {
    const trimmedName = input.name.trim();
    if (!trimmedName) {
      throw new Error('Tên sản phẩm không được để trống.');
    }

    if (!input.typeId.trim()) {
      throw new Error('Vui lòng chọn loại mặt hàng.');
    }

    this.ensureUrl(input.imageUrl, 'Image URL');
    this.ensureUrl(input.linkUrl, 'Product link');

    await this.repository.createProduct({
      ...input,
      name: trimmedName
    });
  }

  private ensureUrl(url: string, label: string) {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error();
      }
    } catch {
      throw new Error(`${label} không hợp lệ.`);
    }
  }
}
