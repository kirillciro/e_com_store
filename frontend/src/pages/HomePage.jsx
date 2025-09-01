import CategoryItem from "../components/CategoryItem";

const categories = [
	{ href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg", title: "Stylish Jeans" },
	{ href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg", title: "Casual T-shirts" },
	{ href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg", title: "Trendy Shoes" },
	{ href: "/glasses", name: "Glasses", imageUrl: "/glasses.png",  title: "Fashionable Glasses" },
	{ href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg", title: "Stylish Jackets" },
	{ href: "/suits", name: "Suits", imageUrl: "/suits.jpg", title: "Elegant Suits" },
	{ href: "/bags", name: "Bags", imageUrl: "/bags.jpg", title: "Trendy Bags" },
];
const paypal = "paypal"
const HomePage = () => {
        return <>
        <div className="relative min-h-screen text-white overflow-hidden">
                <div className='relative z-10 max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8 py-16 '>
                       < h1 className="text-center text-6xl text-blue-400 font-bold mb-8 mt-20">Explore Our Categories</h1>
                        <p className="text-center text-xl text-blue-300 mb-20">Discover the latest trends in fashion and accessories</p>

                        <div className='grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {categories.map((category) => (
                                      <CategoryItem
                                        category={category}
                                        key={category.name}
                                      />
                                ))}
                        </div>
                </div>
        </div>
        </>     
}
export default HomePage;