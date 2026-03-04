import { useCallback, useEffect, useMemo, useState } from 'react';
import { CreateProductTypeUseCase } from '../../application/use-cases/CreateProductTypeUseCase';
import { GetProductTypesUseCase } from '../../application/use-cases/GetProductTypesUseCase';
import type { NewProductTypeInput, ProductType } from '../../domain/entities/ProductType';
import { FirestoreProductTypeRepository } from '../../infrastructure/repositories/FirestoreProductTypeRepository';

const repository = new FirestoreProductTypeRepository();
const getTypesUseCase = new GetProductTypesUseCase(repository);
const createTypeUseCase = new CreateProductTypeUseCase(repository);

export function useProductTypes() {
  const [types, setTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTypes = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const items = await getTypesUseCase.execute();
      setTypes(items);
    } catch {
      setError('Không tải được danh sách loại mặt hàng.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTypes();
  }, [loadTypes]);

  const createType = useCallback(
    async (input: NewProductTypeInput) => {
      try {
        setError(null);
        setIsCreating(true);
        await createTypeUseCase.execute(input);
        await loadTypes();
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Tạo loại mặt hàng thất bại.');
        }
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [loadTypes]
  );

  return useMemo(
    () => ({
      types,
      isLoading,
      isCreating,
      error,
      loadTypes,
      createType
    }),
    [types, isLoading, isCreating, error, loadTypes, createType]
  );
}

