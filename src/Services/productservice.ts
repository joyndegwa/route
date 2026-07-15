import { productRepo } from "../lib/product";
import type { CreateProductInput, Product, ProductStatus } from "../types/product";

export type ProductStatusSummary = Record<ProductStatus, number>;

/** Count products grouped by their status. Pure and easy to unit test. */
export function summarizeByStatus(products: Product[]): ProductStatusSummary {
  const summary: ProductStatusSummary = {
    active: 0,
    in_repair: 0,
    recycled: 0,
    retired: 0,
  };
  for (const product of products) {
    if (product.status in summary) {
      summary[product.status] += 1;
    }
  }
  return summary;
}

/** Case-insensitive search across a product's key text fields. */
export function filterProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) =>
    [p.name, p.manufacturer, p.serialNumber, p.category]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export const productService = {
  summarizeByStatus,
  filterProducts,
  listForOwner: (ownerId: string) => productRepo.listByOwner(ownerId),
  listAll: () => productRepo.listAll(),
  getById: (id: string) => productRepo.getById(id),
  register: (ownerId: string, input: CreateProductInput) =>
    productRepo.create(ownerId, input),
  update: productRepo.update,
  remove: productRepo.remove,
};
