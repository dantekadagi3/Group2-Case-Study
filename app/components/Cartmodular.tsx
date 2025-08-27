
import { useCart } from "@/app/context/CartContext";

export default function Cartwindow(){
     const { cartItems, removeFromCart, clearCart } = useCart();
   return (
    <div>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2>Shopping Cart</h2>
            <button>Close</button>
        </div>
        <div>
            {cartItems.length==0 ? (
                <p>Your cart is empty</p>
            ) : (
              <>
          {cartItems.map((item) => (
            <div key={item.title} className="flex justify-between mb-3">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-400">x{item.quantity}</p>
              </div>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => removeFromCart(item.title)}
                className="text-red-400 text-sm ml-2"
              >
                Remove
              </button>
            </div>
          ))}
          <hr className="my-3 border-gray-700" />
          <p className="font-bold">
            Total: $
            {cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}
          </p>
          <button
            onClick={clearCart}
            className="mt-3 w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg"
          >
            Clear Cart
          </button>
        </>
      )}
        </div>
    </div>
   );
}