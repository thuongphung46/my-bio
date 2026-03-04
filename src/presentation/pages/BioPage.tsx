/** @format */

import { useMemo, useState } from "react";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { useProductTypes } from "../hooks/useProductTypes";

type ViewMode = "grid" | "list";
type TypeFilter = "all" | "unknown" | string;

export function BioPage() {
  const { products, isLoading, error } = useProducts();
  const { types } = useProductTypes();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const profileName = import.meta.env.VITE_PROFILE_NAME?.trim() || "Profile";
  const avatarUrl = import.meta.env.VITE_PROFILE_AVATAR_URL?.trim() || "";
  const avatarInitial = profileName.trim().charAt(0).toUpperCase() || "P";

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      if (typeFilter === "unknown") {
        if (product.typeId) {
          return false;
        }
      } else if (typeFilter !== "all") {
        if (product.typeId !== typeFilter) {
          return false;
        }
      }

      if (!keyword) {
        return true;
      }

      return product.name.toLowerCase().includes(keyword);
    });
  }, [products, searchTerm, typeFilter]);

  return (
    <main className="page-wrap">
      <Header
        title=""
        subtitle="Trang trưng bày của Phùng Hoài Thương"
        actionLabel="Vào trang admin"
        actionPath="/admin"
      />

      <section className="profile-strip" aria-label="Thông tin hồ sơ">
        <div className="avatar" aria-hidden={!avatarUrl}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={`Avatar ${profileName}`} loading="eager" />
          ) : (
            <span className="avatar-fallback" aria-hidden="true">
              {avatarInitial}
            </span>
          )}
        </div>
        <div className="profile-meta">
          <p className="profile-name">{profileName}</p>
        </div>
      </section>

      {isLoading && <p className="state-text">Đang tải sản phẩm...</p>}
      {error && <p className="state-text error">{error}</p>}

      {!isLoading && !products.length && <p className="state-text">Chưa có sản phẩm.</p>}

      <section className="view-controls">
        <div className="view-controls-inner">
          <div className="toolbar-left">
            <p className="product-count">Tổng số sản phẩm: {products.length}</p>
            <input
              className="search-input"
              type="search"
              placeholder="Tìm sản phẩm..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Tìm sản phẩm theo tên"
            />
            <div className="type-chips" role="tablist" aria-label="Lọc nhanh theo loại mặt hàng">
              <button
                type="button"
                className={`chip-btn ${typeFilter === "all" ? "active" : ""}`}
                onClick={() => setTypeFilter("all")}
              >
                Tất cả
              </button>
              {types.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className={`chip-btn ${typeFilter === type.id ? "active" : ""}`}
                  onClick={() => setTypeFilter(type.id)}
                >
                  {type.name}
                </button>
              ))}
              <button
                type="button"
                className={`chip-btn ${typeFilter === "unknown" ? "active" : ""}`}
                onClick={() => setTypeFilter("unknown")}
                title="Sản phẩm chưa có loại"
              >
                Khác
              </button>
            </div>
          </div>
          <button
            type="button"
            className="view-switch"
            onClick={() => setViewMode((prev) => (prev === "grid" ? "list" : "grid"))}
            aria-label={
              viewMode === "grid" ? "Chuyển sang dạng danh sách" : "Chuyển sang dạng lưới"
            }
            title={viewMode === "grid" ? "Đang ở dạng lưới" : "Đang ở dạng danh sách"}
          >
            {viewMode === "grid" ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="5" width="3" height="3" rx="1" />
                <rect x="4" y="10.5" width="3" height="3" rx="1" />
                <rect x="4" y="16" width="3" height="3" rx="1" />
                <rect x="9" y="5" width="11" height="3" rx="1.2" />
                <rect x="9" y="10.5" width="11" height="3" rx="1.2" />
                <rect x="9" y="16" width="11" height="3" rx="1.2" />
              </svg>
            )}
          </button>
        </div>
      </section>

      {!isLoading && !!products.length && !filteredProducts.length && (
        <p className="state-text">Không tìm thấy sản phẩm phù hợp.</p>
      )}

      <section className={viewMode === "grid" ? "product-grid" : "product-list"}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} viewMode={viewMode} />
        ))}
      </section>
    </main>
  );
}
