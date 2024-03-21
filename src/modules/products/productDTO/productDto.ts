import { Expose, Transform, Type } from 'class-transformer';

export class ProductsDto {
  @Expose()
  totalProducts: number;
  @Expose()
  limit: number;
  @Expose()
  @Type(() => ProductList)
  products: ProductList[];
}

export class ProductList {
  @Expose({ name: 'product_id' })
  id: number;
  @Expose({ name: 'product_nameProduct' })
  nameProduct: string;

  @Expose({ name: 'product_nameDescription' })
  nameDescription: string;
  @Expose({ name: 'product_price' })
  price: number;
  @Expose({ name: 'product_stock' })
  stock: number;
  @Expose({ name: 'product_images' })
  @Transform(({ value }) => value.toString().split(','))
  images: string[];

  @Transform(({ obj }) => {
    return {
      id: obj.category_id,
      title: obj.category_title,
    };
  })
  @Expose()
  category: any;
}
