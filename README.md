# Group 1
# ADDN Store
### Created at `2026-05-12`

---

## Project Overview

**ADDN** is a fully responsive online store front-end. The project was developed as a frontend web development assignment, implementing HTML, CSS, JavaScript, and an optional React component.

---

## File Structure

```
addn-store/
├── index.html                         ← Main SPA entry point (4 pages)
├── styles/
│   └── styles.css                     ← Complete stylesheet
├── scripts/
│   └── scripts.js                     ← All JavaScript functionality
├── data/
│   └── products.json                  ← Product data (8 products)
├── react-components/
│   └── FeaturedProducts.jsx           ← React carousel component
└── README.md                          ← This file
```

---

## Features

### Pages (Single-Page Application)
- **Home** — Hero section, categories, featured products (React), promo banner, newsletter
- **Shop** — Full product grid with filtering, sorting, and search
- **About** — Brand story, values, statistics
- **Contact** — Contact form with validation, location info

### JavaScript Functionality
- ✅ Add to cart / remove from cart
- ✅ Quantity controls per cart item
- ✅ Cart total calculation (with free shipping threshold)
- ✅ Product filtering by category
- ✅ Product sorting (price, rating, popularity)
- ✅ Live search / filter
- ✅ Wishlist toggle
- ✅ Quick view modal
- ✅ Form validation (newsletter + contact)
- ✅ Promo code copy to clipboard
- ✅ Toast notifications
- ✅ LocalStorage persistence (cart + wishlist)
- ✅ Scroll animations (Intersection Observer)
- ✅ Back to top button
- ✅ Mobile hamburger menu
- ✅ Grid / List view toggle

### React Component
- Featured Products interactive carousel
- Loads from `data/products.json`
- Navigation dots + arrow controls
- Add to cart integration

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML | Semantic page structure |
| CSS | Styling, layout, animations |
| CSS Grid + Flexbox | Responsive layouts |
| CSS Custom Properties | Theme system |
| JavaScript (ES6+) | Interactivity, state, DOM |
| React  | Featured products component |
| Babel Standalone | JSX transpilation |
| Font Awesome 6 | Icons |
| Google Fonts | Typography (Cormorant Garamond, DM Sans, Space Mono) |
| localStorage | Cart + wishlist persistence |
| Intersection Observer API | Scroll animations |
| Clipboard API | Copy promo code |

---


## Project Group

| Name | ID |
|---|---|
| Nujud Alsubaie | 202300419 |
| Dana Alhmliy | 202201092 |
| Dana AlRadhwan | 202300584 |
| Anfal Alshammari | 202101203 |
