import React from "react";
import AllProducts from "@/Components/AllProducts";
import { client } from "@/lib/sanityClient";
import { Image } from "sanity";

export const getProductData = async () => {

    const res = await client.fetch(`
    *[_type=="product"] {
        _id,
        title,
        image,
        price,
        category -> {
            name
        },
        dresstype -> {
            name
        }
      }
    `);

    return res;

};

interface IProduct {
    _id: string;
    title: string;
    image: Image;
    price: number;
    category: {
        name: string;
    }
    dresstype: {
        name: string;
    }
};

const Products = async () => {

    const data: IProduct[] = await getProductData();

    return (
        <div className="my-8 grid grid-cols-[repeat(3,auto)] justify-center gap-x-10 gap-y-12">
            {data?.map((item, i: number) => (
                <div key={i}>
                    <AllProducts
                        id={item._id}
                        title={item.title}
                        image={item.image}
                        price={item.price}
                        category={item.category.name}
                        dresstype={item.dresstype.name}
                    />
                </div>
            ))}
        </div>
    )
};

export default Products;