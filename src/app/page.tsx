import Hero from "@/Components/Hero";
import Event from "@/Components/Event";
import Products from "@/Components/Products";

const Home = async () => {
    return (
        <>
            <Hero />
            <Event />
            {/* @ts-ignore */}
            <Products />
        </>
    )
};

export default Home;