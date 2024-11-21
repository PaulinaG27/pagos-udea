import { Stripe } from 'stripe';
import ButtonCheckout from '../components/ButtonCheckout';

async function loadPrices() {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const pricesData = await stripe.prices.list();

    const pricesWithProductNames = await Promise.all(
        pricesData.data.map(async (price) => {
            const product = await stripe.products.retrieve(price.product);
            return {
                id: price.id,
                unit_amount: price.unit_amount,
                currency: price.currency,
                productName: product.name,
            };
        })
    );
    return pricesWithProductNames;
}

async function PricingPage() {
    const prices = await loadPrices();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-6xl w-full p-4">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">GameStore Udea - Pricing</h1>
                    <p className="text-gray-600 mt-2">
                        Choose the game that beats with you!
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prices.map((price) => (
                        <div
                            key={price.id}
                            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <h3
                                className="text-lg font-medium text-gray-800 truncate"
                                title={price.productName}
                            >
                                {price.productName}
                            </h3>
                            <h2 className="text-4xl font-extrabold text-indigo-600 mt-4">
                                ${(price.unit_amount / 100).toFixed(2)}{' '}
                                <span className="text-xl text-gray-500">
                                    {price.currency.toUpperCase()}
                                </span>
                            </h2>
                            <ButtonCheckout
                                priceId={price.id}
                                className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Choose Plan
                            </ButtonCheckout>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PricingPage;
