type Params = {
    params: {
        id: string;
    }
};

const Product = async ({ params }: Params) => {

    const { id } = params;
    
    return (
        <div className="my-16 mx-24">
            Hello
        </div>
    )
};

export default Product;