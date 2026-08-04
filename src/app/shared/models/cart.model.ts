export interface CartResponse {
  numOfCartItems: number;
  cart: {
    cartItems: { quantity: number }[];
  };
}
