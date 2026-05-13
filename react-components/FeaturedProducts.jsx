//  ADDN STORE — FeaturedProducts.jsx
//  React Component: Featured Products Carousel

function FeaturedProducts() {
    const [featured, setFeatured] = React.useState([]);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);

    const productEmojis = {
        watch: '⌚', jacket: '🧥', headphones: '🎧',
        mug: '☕', wallet: '👛', perfume: '🌑',
        sneakers: '👟', lamp: '🪔'
    };

    React.useEffect(() => {
        // Load from JSON or use fallback
        fetch('data/products.json')
            .then(r => r.json())
            .then(data => {
                // Pick top-rated items as featured
                const top = [...data]
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 4);
                setFeatured(top);
                setIsLoading(false);
            })
            .catch(() => {
                // Fallback
                setFeatured([
                    { id:2, name:"ADDN Leather Jacket",  category:"apparel",     price:289, rating:4.9, reviews:87,  badge:"Bestseller", description:"Full-grain genuine leather with asymmetric zip closure.", image:"jacket"    },
                    { id:6, name:"Midnight Fragrance",   category:"lifestyle",   price:125, rating:4.8, reviews:64,  badge:"Limited",    description:"Dark amber and black oud with sandalwood base notes.",    image:"perfume"   },
                    { id:1, name:"Obsidian Chronograph", category:"watches",     price:349, rating:4.8, reviews:142, badge:"Sale",        description:"Precision-crafted timepiece with sapphire crystal glass.", image:"watch"     },
                    { id:3, name:"Eclipse Headphones",   category:"electronics", price:199, rating:4.7, reviews:213, badge:"Sale",        description:"Active noise cancellation with 40hr battery life.",        image:"headphones"}
                ]);
                setIsLoading(false);
            });
    }, []);

    const goTo = (index) => {
        setActiveIndex((index + featured.length) % featured.length);
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <i
                key={i}
                className="fas fa-star"
                style={{ opacity: i < Math.floor(rating) ? 1 : 0.2, fontSize: '0.7rem', color: 'var(--accent-gold)' }}
            />
        ));
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✦</div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.2em' }}>
                    LOADING FEATURED ITEMS
                </p>
            </div>
        );
    }

    if (featured.length === 0) return null;

    const current = featured[activeIndex];

    return (
        <div className="react-featured" style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            minHeight: '400px'
        }}>
            {/* Left: Product Display */}
            <div style={{
                background: 'var(--bg-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(201,169,110,0.08) 0%, transparent 70%)'
                }} />
                <span style={{ fontSize: '9rem', filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.5))', position: 'relative', zIndex: 1 }}>
                    {productEmojis[current.image] || '📦'}
                </span>

                {/* Navigation dots */}
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
                    {featured.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            style={{
                                width: i === activeIndex ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: i === activeIndex ? 'var(--accent-gold)' : 'var(--border-medium)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                padding: 0
                            }}
                            aria-label={`Go to product ${i + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Right: Product Info */}
            <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {current.badge && (
                    <span style={{
                        display: 'inline-flex', alignSelf: 'flex-start',
                        background: 'var(--accent-glow)', border: '1px solid var(--accent-dim)',
                        color: 'var(--accent-gold)',
                        fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em',
                        textTransform: 'uppercase', padding: '0.2rem 0.7rem',
                        borderRadius: '999px', marginBottom: '1rem'
                    }}>
                        {current.badge}
                    </span>
                )}

                <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '0.5rem'
                }}>
                    {current.category}
                </span>

                <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 300,
                    color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '0.8rem'
                }}>
                    {current.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>{renderStars(current.rating)}</div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {current.rating} ({current.reviews})
                    </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                    {current.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--text-primary)' }}>
                        ${current.price.toFixed(2)}
                    </span>
                    <button
                        onClick={() => typeof addToCart !== 'undefined' && addToCart(current.id)}
                        style={{
                            background: 'var(--accent-gold)', color: 'var(--bg-void)',
                            border: 'none', borderRadius: '999px',
                            padding: '0.75rem 1.5rem', fontSize: '0.78rem', fontWeight: 500,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            cursor: 'pointer', transition: 'all 0.3s ease',
                            fontFamily: 'var(--font-body)'
                        }}
                        onMouseEnter={e => e.target.style.background = '#e0bb7a'}
                        onMouseLeave={e => e.target.style.background = 'var(--accent-gold)'}
                    >
                        Add to Cart
                    </button>
                </div>

                {/* Navigation arrows */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                    <button
                        onClick={() => goTo(activeIndex - 1)}
                        style={{
                            background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
                            color: 'var(--text-secondary)', width: '36px', height: '36px',
                            borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', transition: 'all 0.3s ease',
                            fontFamily: 'inherit'
                        }}
                        aria-label="Previous product"
                    >
                        ←
                    </button>
                    <button
                        onClick={() => goTo(activeIndex + 1)}
                        style={{
                            background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
                            color: 'var(--text-secondary)', width: '36px', height: '36px',
                            borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', transition: 'all 0.3s ease',
                            fontFamily: 'inherit'
                        }}
                        aria-label="Next product"
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
}

// Mount when React is available
if (typeof ReactDOM !== 'undefined' && document.getElementById('react-featured-root')) {
    ReactDOM.render(<FeaturedProducts />, document.getElementById('react-featured-root'));
}
