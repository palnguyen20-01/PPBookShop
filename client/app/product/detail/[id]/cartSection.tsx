"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BookImage, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { writeToLocalStorage } from "@/lib/localStorage";
import { signIn, useSession } from "next-auth/react";
import { BookEntity } from "@/codegen/__generated__/graphql";
import { useToast } from "@/components/ui/use-toast";
import { useCartContext } from "@/app/CartContext";
import { useRouter } from "next/navigation";
interface CartSectionProps {
  book: BookEntity;
}

export const CartSection = ({ book }: CartSectionProps) => {
  const { cartCount, setCartCount } = useCartContext();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();
  const router = useRouter();
  function addToCart() {
    if (!session?.user.id) {
      signIn();
      return;
    }
    const currentCart = localStorage.getItem(session?.user.id);
    const cart = currentCart ? JSON.parse(currentCart) : {};
    const storedData = {
      BookImage: book.ImageURL,
      BookTitle: book.BookTitle,
      BookID: book.BookID,
      Quantity: quantity,
      Price: book.BookPrice,
      Promotion: book.Promotion,
    };

    const newCart = { ...cart, [book.BookID]: storedData };
    writeToLocalStorage(session?.user.id, newCart);
    toast({
      title: "Added to cart",
      description: `${book.BookTitle} has been added to cart`,
      variant: "success",
    });
    setCartCount(cartCount + 1);
  }

  function checkOut() {
    if (!session?.user.id) {
      signIn();
      return;
    }
    const currentCart = localStorage.getItem(session?.user.id);
    const cart = currentCart ? JSON.parse(currentCart) : {};
    const storedData = {
      BookImage: book.ImageURL,
      BookTitle: book.BookTitle,
      BookID: book.BookID,
      Quantity: quantity,
      Price: book.BookPrice,
      Promotion: book.Promotion,
    };

    const newCart = { ...cart, [book.BookID]: storedData };
    writeToLocalStorage(session?.user.id, newCart);
    setCartCount(cartCount + 1);
    router.push("/cart");
  }
  return (
    <>
      <div className="QUANTITY ">
        <Label>Quantity</Label>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setQuantity(quantity - 1 > 0 ? quantity - 1 : 1)}
          >
            <Minus className="w-6 h-6" />
          </Button>
          <Button size="icon" variant="outline">
            {quantity}
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>
      <div className="ACTION grid grid-cols-2 gap-2 ">
        <Button onClick={() => addToCart()}>Add to cart</Button>
        <Button variant="outline" onClick={() => checkOut()}>
          Checkout
        </Button>
      </div>
    </>
  );
};
