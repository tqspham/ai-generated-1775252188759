"use client";

import React, { useState, useEffect } from "react";

type Bicycle = {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  specifications: string;
};

type CartItem = {
  bicycle: Bicycle;
  quantity: number;
};

const fetchBicycles = async (): Promise<Bicycle[]> => {
  const response = await fetch("https://api.example.com/bicycles");
  if (!response.ok) throw new Error("Failed to fetch bicycles");
  return response.json();
};

const HomePage = () => {
  const [bicycles, setBicycles] = useState<Bicycle[]>([]);
  const [selectedBicycle, setSelectedBicycle] = useState<Bicycle | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBicycles = async () => {
      try {
        const data = await fetchBicycles();
        setBicycles(data);
      } catch (e: any) {
        setError(e?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    loadBicycles();
  }, []);

  const addToCart = (bicycle: Bicycle) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.bicycle.id === bicycle.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.bicycle.id === bicycle.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { bicycle, quantity: 1 }];
    });
  };

  const renderBicycles = () => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error} <button onClick={() => window.location.reload()}>Retry</button></div>;
    if (bicycles?.length === 0) return <div>No bicycles available for sale.</div>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bicycles.map((bicycle) => (
          <div key={bicycle.id} className="border p-4">
            <img src={bicycle.images[0] || "https://loremflickr.com/320/240/bicycle"} alt={bicycle.name} />
            <h2 className="text-xl">{bicycle.name || "Unnamed Bicycle"}</h2>
            <p>{bicycle.description || "No description available."}</p>
            <p>${bicycle.price || 0}</p>
            <button onClick={() => setSelectedBicycle(bicycle)}>View Details</button>
          </div>
        ))}
      </div>
    );
  };

  const renderBicycleDetail = () => {
    if (!selectedBicycle) return null;
    return (
      <div className="p-4">
        <h2 className="text-2xl">{selectedBicycle.name || "Unnamed Bicycle"}</h2>
        <div className="flex space-x-4">
          {selectedBicycle.images.map((img, index) => (
            <img key={index} src={img || "https://loremflickr.com/320/240/bicycle"} alt={selectedBicycle.name} />
          ))}
        </div>
        <p>{selectedBicycle.specifications || "No specifications available."}</p>
        <p>${selectedBicycle.price || 0}</p>
        <button onClick={() => addToCart(selectedBicycle)}>Add to Cart</button>
      </div>
    );
  };

  const renderCart = () => {
    if (cart.length === 0) return <div>Your cart is empty.</div>;
    return (
      <div className="p-4">
        <h2 className="text-2xl">Shopping Cart</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.bicycle.name || "Unnamed Bicycle"} - ${item.bicycle.price || 0} x {item.quantity} = $
              {(item.bicycle.price || 0) * item.quantity}
            </li>
          ))}
        </ul>
        <button>Checkout</button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {selectedBicycle ? renderBicycleDetail() : renderBicycles()}
      {renderCart()}
    </div>
  );
};

export default HomePage;