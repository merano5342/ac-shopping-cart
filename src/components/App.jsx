/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
import ProductItem from './ProductItem';
import { PRODUCTS } from './config';
import Cart from './Cart';
import Coupons from './Coupons';
import type { LineItem } from './types';
import { CartContext } from './CartContext';

const ShoppingCart = () => {
  // TODO 2
  const [totalAmount, setTotalAmount] = React.useState(0);
  /**
   * @type {[LineItem[], Function]}
   */
  const [lineItems, setLineItems] = React.useState([]);
  const [productItems, setProductItems] = React.useState(PRODUCTS);
  const [discounts, setDiscounts] = React.useState(0);
  // TODO 6
  React.useEffect(() => {
    const calcTotalAmount = lineItems.reduce((total, currentItem) => {
      return total + currentItem.price * currentItem.quantity;
    }, 0);
    const newAmount = calcTotalAmount - discounts;
    if (newAmount > 0) {
      return setTotalAmount(newAmount);
    }
    setDiscounts(0);
    return setTotalAmount(0);
  }, [discounts, lineItems, totalAmount]);

  // TODO 5
  const atUpdateQuantity = useCallback((id: String, quantityChange: Number) => {
    // 只要 function 要傳值給其他 component 的話，就要用 useCallback 包起來，避免產生新的 instance
    // 增加數量

    setLineItems((prev) => {
      return prev.map((item: LineItem) => {
        if (item.id === id) {
          const currentQuantity = item.quantity + quantityChange;
          // console.log(item.title, inventory, currentQuantity);
          return {
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: currentQuantity > 0 ? currentQuantity : 1,
            inventory: PRODUCTS.find((product) => product.id === id).inventory,
          };
        }

        return item;
      });
    });
    setProductItems((prev) => {
      return prev.map((product: Product) => {
        if (product.id === id) {
          const currentProductQuantity = product.inventory - quantityChange;
          return {
            id: product.id,
            img: product.img,
            title: product.title,
            price: product.price,
            inventory: currentProductQuantity,
          };
        }
        return product;
      });
    });
  }, []);
  // 使用 useCallback 時，讓 [] 數量越少越好
  // 比較優雅的寫法，不用在 [] 塞東西
  // TODO

  // TODO 5
  const atAddToCart = useCallback(
    (id: string) => {
      const foundItem = lineItems.find((data) => data.id === id);
      if (foundItem) {
        atUpdateQuantity(id, +1);
      } else {
        // 新增
        const foundProduct = PRODUCTS.find((data) => data.id === id);

        const lineItem = {
          id,
          price: foundProduct.price,
          title: foundProduct.title,
          quantity: 1,
        };
        atUpdateQuantity(id, +1);
        setLineItems((prev) => prev.concat(lineItem));
      }
    },
    [atUpdateQuantity, lineItems],
  );

  const onRemoveItem = useCallback((id: string) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));

    const { inventory } = PRODUCTS.find((product) => product.id === id);
    setProductItems((prev) => {
      return prev.map((product: Product) => {
        if (product.id === id) {
          return {
            id: product.id,
            img: product.img,
            title: product.title,
            price: product.price,
            inventory,
          };
        }
        return product;
      });
    });
  }, []);

  const onRemoveCart = useCallback(() => {
    setLineItems([]);
    setProductItems(PRODUCTS);
    setDiscounts(0);
  }, []);

  // FIXME 請實作 coupon

  const atApplyCoupon = useCallback((coupon) => {
    console.log('coupon', coupon);
    setDiscounts(coupon.discount);
  }, []);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const provideValue = {
    totalAmount,
    lineItems,
    productItems,
  };

  return (
    <CartContext.Provider value={provideValue}>
      <div className="container">
        <div className="row">
          {/* TODO 4 */}
          {productItems.map((product) => {
            return (
              <div className="col-3" key={product.id}>
                <ProductItem
                  // {...product}
                  id={product.id}
                  img={product.img}
                  title={product.title}
                  price={product.price}
                  inventory={product.inventory}
                  // TODO 5
                  onAddToCart={atAddToCart}
                />
              </div>
            );
          })}
        </div>
        <Cart
          totalAmount={totalAmount}
          lineItems={lineItems}
          onRemoveCart={onRemoveCart}
          onUpdateQuantity={atUpdateQuantity}
          onRemoveItem={onRemoveItem} // at
        />
        {/* FIXME 請實作 coupon 功能 */}
        <Coupons
          onApplyCoupon={atApplyCoupon}
          discounts={discounts}
          totalAmount={totalAmount}
        />
      </div>
    </CartContext.Provider>
  );
};

export default ShoppingCart;
