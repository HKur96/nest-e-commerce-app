export class ProductResponse {
  id: number;
  name: string;
  description: string | null;
  price: number;
  categoryId: number;
  discountId: number | null;
  createdAt: Date;
  sellerId: number;
  stock: number; // assuming this represents stock.quantity
  images: string[] | null;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description ?? null;
    this.price = data.price;
    this.categoryId = data.categoryId;
    this.discountId = data.discountId ?? null;
    this.createdAt = new Date(data.createdAt);
    this.sellerId = data.sellerId;
    this.stock = data.stock?.quantity ?? 0;
    this.images = data.images?.length ? data.images : null;
  }
}
