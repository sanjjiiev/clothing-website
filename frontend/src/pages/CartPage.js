function CartPage({ cart, setCart }) {
  const handleCheckout = () => {
    alert('Checkout functionality coming soon!');
  };

  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Your Cart</h2>
      {cart.length === 0 ? <p>Cart is empty</p> : (
        <div>
          {cart.map((item, index) => (
            <div key={index} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <button onClick={() => removeItem(index)}>Remove</button>
            </div>
          ))}
          <h3>Total: ${total}</h3>
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
