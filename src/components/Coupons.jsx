import React from 'react';
import { coupons } from './config';

type CouponsProps = {
  onApplyCoupon: (coupon: string) => void,
  discounts: number,
  totalAmount: Number,
};
const Coupons: React.FC<CouponsProps> = (props) => {
  const { onApplyCoupon, discounts, totalAmount } = props;
  return (
    <section data-name="coupons">
      {coupons.map((coupon) => {
        return (
          <button
            key={coupon.id}
            className="btn btn-info"
            disabled={
              coupon.discount === discounts ||
              totalAmount <= 0 ||
              coupon.discount >= totalAmount
            }
            onClick={() => {
              onApplyCoupon(coupon);
            }}
          >
            {coupon.id}
          </button>
        );
      })}
    </section>
  );
};

export default Coupons;
