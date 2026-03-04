import type { FormEvent } from 'react';
import { useState } from 'react';
import { Header } from '../components/Header';
import { useProductTypes } from '../hooks/useProductTypes';

const initialForm = { name: '' };

export function AdminTypesPage() {
  const [form, setForm] = useState(initialForm);
  const [successText, setSuccessText] = useState<string | null>(null);
  const { types, isLoading, isCreating, error, createType } = useProductTypes();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessText(null);

    try {
      await createType(form);
      setForm(initialForm);
      setSuccessText('Đã thêm loại mặt hàng.');
    } catch {
      // Error shown via hook state.
    }
  };

  return (
    <main className="page-wrap">
      <Header
        title="Loại mặt hàng"
        subtitle="Tạo danh sách loại để chọn nhanh khi thêm sản phẩm."
        actionLabel="Quay lại admin"
        actionPath="/admin"
      />

      <form className="admin-form" onSubmit={submit}>
        <label>
          Tên loại mặt hàng
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ name: event.target.value })}
            placeholder="Ví dụ: Gia dụng, Quần áo, Giày dép"
          />
        </label>

        <button className="submit-btn" type="submit" disabled={isCreating}>
          {isCreating ? 'Đang lưu...' : 'Thêm loại'}
        </button>

        {error && <p className="state-text error">{error}</p>}
        {successText && <p className="state-text success">{successText}</p>}
      </form>

      <section className="type-list" aria-label="Danh sách loại mặt hàng">
        <h2 className="type-list-title">Danh sách hiện có</h2>
        {isLoading ? (
          <p className="state-text">Đang tải...</p>
        ) : !types.length ? (
          <p className="state-text">Chưa có loại nào.</p>
        ) : (
          <ul className="type-items">
            {types.map((type) => (
              <li key={type.id} className="type-item">
                {type.name}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

