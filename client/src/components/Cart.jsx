import React from "react";

function Cart({ isCartOpen, setIsCartOpen }) {
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/30"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Panel */}
      <div className="w-4/6 md:w-3/6 lg:w-2/6 bg-white h-screen shadow-lg animate-slide-in">
        <div className="flex justify-between items-center p-4 bg-neutral-800 text-white">
          <h2 className="text-2xl font-bold tracking-tight">Cart Treasure</h2>
          <button onClick={() => setIsCartOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
