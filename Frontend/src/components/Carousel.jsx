"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";



export default function ProductCarousel({ products }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const itemsPerSlide = 6; // mostrar 6 a la vez
  const step = 3; // mover de a 3

  if (!products || products.length === 0) {
    return (
      <p className="text-center text-gray-600">
        No hay productos disponibles
      </p>
    );
  }

  const maxIndex = Math.ceil(products.length / step) - 1;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto mt-5">
      {/* Botón izquierdo */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full shadow-md"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      {/* Carrusel */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform ease-in-out duration-500"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerSlide) * step}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-1/6 flex-shrink-0 p-2" // 1/6 = 6 cards visibles
            >
              <Card className="shadow-lg rounded-2xl">
                <CardContent className="p-2 flex flex-col items-center">
                  <img
                    src={product.images[0]?.url || "/placeholder.png"}
                    alt={product.title}
                    className="h-48 w-40 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-sm font-semibold text-gray-800 text-center line-clamp-2 font-montserrat">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-600 text-center mt-2 line-clamp-2 font-montserrat">
                    {product.description?.slice(0, 50)}...
                  </p>
                  <p className="text-sm font-semibold text-secondary mt-2">
                    {product.moneda} {product.price}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Botón derecho */}
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full shadow-md"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
