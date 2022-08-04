import React from 'react';

export const CartContext = React.createContext();

export default function useCartContext() {
  return React.useContext(CartContext);
}
