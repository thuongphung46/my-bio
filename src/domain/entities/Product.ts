export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  linkUrl: string;
  typeId?: string;
  typeName?: string;
  createdAt: string;
}

export interface NewProductInput {
  name: string;
  imageUrl: string;
  linkUrl: string;
  typeId: string;
  typeName: string;
}
