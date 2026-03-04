import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  orderBy,
  query
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import type { NewProductTypeInput, ProductType } from '../../domain/entities/ProductType';
import type { ProductTypeRepository } from '../../domain/repositories/ProductTypeRepository';
import { db, firebaseConfigError } from '../firebase/config';

const collectionName = 'productTypes';

export class FirestoreProductTypeRepository implements ProductTypeRepository {
  async getTypes(): Promise<ProductType[]> {
    const firestore = this.ensureDbReady();

    try {
      const typesQuery = query(collection(firestore, collectionName), orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(typesQuery);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.();

        return {
          id: doc.id,
          name: (data.name ?? '') as string,
          createdAt: createdAt ? createdAt.toISOString() : new Date().toISOString()
        };
      });
    } catch (error) {
      throw this.toReadableError(error);
    }
  }

  async createType(input: NewProductTypeInput): Promise<void> {
    const firestore = this.ensureDbReady();

    try {
      await addDoc(collection(firestore, collectionName), {
        name: input.name,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      throw this.toReadableError(error);
    }
  }

  private toReadableError(error: unknown): Error {
    if (!(error instanceof FirebaseError)) {
      return new Error('Lỗi không xác định khi gọi Firebase.');
    }

    switch (error.code) {
      case 'permission-denied':
        return new Error(
          'Firestore đang chặn quyền đọc/ghi (permission-denied). Kiểm tra Firestore Rules.'
        );
      case 'unauthenticated':
        return new Error('Yêu cầu đăng nhập để ghi dữ liệu vào Firestore.');
      case 'unavailable':
        return new Error('Firebase tạm thời không khả dụng. Thử lại sau.');
      case 'invalid-argument':
        return new Error('Dữ liệu gửi lên Firestore không hợp lệ.');
      default:
        return new Error(`Firebase error: ${error.code}`);
    }
  }

  private ensureDbReady() {
    if (!db) {
      throw new Error(firebaseConfigError ?? 'Firebase chưa được khởi tạo.');
    }

    return db;
  }
}

