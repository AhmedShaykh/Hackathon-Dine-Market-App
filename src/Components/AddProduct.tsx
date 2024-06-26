"use client";
import React, { useState } from "react";
import { cartActions } from "@/redux/features/cartSlice";
import { urlForImage } from "../../sanity/lib/image";
import { useAppDispatch } from "@/redux/store";
import { ProductData } from "../../Types";
import getDomain from "@/lib/getDomain";
import { Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
    id: string;
    count: number;
    product: ProductData;
    userId: string;
};

const AddProduct = (prop: Props) => {

    const [count, setCount] = useState<number>(1);

    const dispatch = useAppDispatch();

    const handleRequestData = async () => {

        const res = await fetch(`${getDomain}/api/getcart/${prop.userId}`, {
            cache: "no-store"
        });

        if (!res.ok) {

            throw new Error("Failed To Fetch Data From API");

        }

        const data = await res.json();

        console.log(data);

        return data;
    };

    const handleAddToCart = async () => {

        const res = await fetch("/api/addcart", {
            method: "POST",
            body: JSON.stringify({
                product_id: prop.id,
                title: prop.product.title,
                image: urlForImage(prop.product.image).url(),
                price: prop.product.price,
                dressname: prop.product.dresstype.name,
                quantity: count,
                totalPrice: prop.product.price * prop.count
            })
        });

        const result = await res.json();

        return result;
    };

    const handleCart = async () => {

        try {

            const cartData = await handleRequestData();

            const existingItem = cartData.cartItems.find(
                (item: any) => item._id === prop.product._id
            );

            if (existingItem) {

                const newQuantity = existingItem.quantity + count;

                const newPrice = prop.product.price * newQuantity;

                const res = await fetch(`api/updatecart`, {
                    method: "PUT",
                    body: JSON.stringify({
                        product_id: prop.product._id,
                        quantity: newQuantity,
                        price: newPrice,
                    }),
                });

                if (!res.ok) {

                    throw new Error("Failed to Update Data");

                }
            }

            else {

                await handleAddToCart();

            }

        } catch (error) {

            console.log(error);

        }

    };

    const addtoCart = () => {

        toast.promise(handleCart(), {
            loading: "Please Wait...",
            success: "New Product Added",
            error: "Failed Product To Cart"
        });

        dispatch(cartActions.addToCart({ product: prop.product as any, quantity: count }));

        setCount(1);

    };

    return (
        <div className="wrapper">
            <div className="lg:w-4/5 mx-auto flex flex-wrap">
                <img
                    className="lg:w-1/2 w-full lg:h-[60%] h-[80%] object-cover object-center rounded"
                    src={urlForImage(prop.product?.image).url()}
                    alt="product"
                />

                <div className="lg:w-1/2 w-full lg:pl-10 lg:py-2 mt-12 lg:mt-2 px-1">
                    <h1 className="text-gray-900 text-3xl font-bold mb-1">
                        {prop.product.title}
                    </h1>

                    <h2 className="leading-relaxed font-bold text-2xl my-2 text-zinc-600">
                        {prop.product.dresstype.name}
                    </h2>

                    <div className="flex mt-6 items-center pb-5 mb-5">
                        <div className="flex items-center">

                            <span className="mr-8">Size</span>

                            <div className="relative">
                                <select className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:border-zinc-700 text-base pl-3 pr-10">
                                    <option>XS</option>
                                    <option>S</option>
                                    <option>M</option>
                                    <option>L</option>
                                    <option>XL</option>
                                </select>

                                <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                                    <svg
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        className="w-4 h-4"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-x-12 my-4 items-center">
                        <h2 className="text-xl font-bold">
                            Quantity:
                        </h2>

                        <div className="flex items-center justify-center space-x-4">
                            <button
                                className="rounded-full p-1 bg-zinc-900 text-white"
                                onClick={() => {
                                    if (count < 8) {
                                        setCount(count + 1);
                                    } else {
                                        toast("Sorry Item Limit Is 8", { icon: "🙃" })
                                    }
                                }}
                            >
                                <Plus />
                            </button>

                            <span className="text-xl font-semibold">
                                {count}
                            </span>

                            <button
                                className="rounded-full p-1 bg-zinc-900 text-white"
                                onClick={() => {
                                    if (count > 1) {
                                        setCount(count - 1);
                                    } else {
                                        toast("Item Less Limit Is 1", { icon: "⚠️" })
                                    }
                                }}
                            >
                                <Minus />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-x-8 my-4 items-center">
                        <button
                            className="my-2 p-3 rounded bg-black text-white font-semibold w-40"
                            onClick={addtoCart}
                        >
                            Add To Cart
                        </button>

                        <h2 className="text-3xl font-bold">
                            ${prop.product.price}.00
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default AddProduct;