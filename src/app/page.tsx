import Link from "next/link";
import { fetchBazarApi } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Banner from "@/components/Banner";



export default async function HomePage() {
  let products = [];
  let categories = [];

  try {
    const productData = await fetchBazarApi("/products");
    products = productData?.products || productData || [];

    const categoryData = await fetchBazarApi("/categories");
    categories = categoryData?.categories || categoryData || [];
  } catch (error) {
    console.error("Failed to fetch products or categories:", error);
  }

  const getChangeValue = (product: any) => {
    if (!product.change) return 0;
    if (typeof product.change === "object") {
      const pct = product.change.pct || 0;
      return product.change.dir === "down" ? -Math.abs(pct) : Math.abs(pct);
    }
    return Number(product.change) || 0;
  };

 
  const sortedByChange = [...products].sort((a, b) => getChangeValue(b) - getChangeValue(a));
  
  const topRisers = sortedByChange.filter((p) => getChangeValue(p) > 0).slice(0, 6);
  const topFallers = [...products].sort((a, b) => getChangeValue(a) - getChangeValue(b)).filter((p) => getChangeValue(p) < 0).slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-[rgb(240,245,240)]">
        
      <Banner />
 
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-16 w-full flex-grow">
        
        {topRisers.length > 0 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 text-[rgb(29,39,31)]">
                <span className="text-error">▲</span> আজ দাম বেড়েছে
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {topRisers.map((product: any) => (
                <ProductCard key={product.id || product._id || product.slug} product={product} />
              ))}
            </div>
          </section>
        )}

        {topFallers.length > 0 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 text-[rgb(29,39,31)]">
                <span className="text-success">▼</span> আজ দাম কমেছে
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {topFallers.map((product: any) => (
                <ProductCard key={product.id || product._id || product.slug} product={product} />
              ))}
            </div>
          </section>
        )}

      
        <section id="সব-পণ্য" className="space-y-6 pt-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[rgb(29,39,31)]">সব পণ্য</h2>
            <p className="text-base-content/60 text-sm mt-1">
              মোট <span className="font-semibold text-[rgb(29,39,31)]">{products.length}</span> টি পণ্য দেখানো হচ্ছে
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 text-base-content/60">
              <p className="text-xl">কোনো পণ্যের তথ্য পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id || product._id || product.slug} product={product} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}