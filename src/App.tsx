import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PageLoadFallback } from "./components/PageLoadFallback";
import { Home } from "./pages/Home";
import { Fruits } from "./pages/Fruits";
import { Vegetables } from "./pages/Vegetables";
import { GreensRoots } from "./pages/GreensRoots";
import { HomeFood } from "./pages/HomeFood";
import { ROUTES } from "./lib/publicRoutes";

/** דפי חנות נטענים יחד עם האפליקציה — פחות המתנה ל־chunk בכניסה ישירה ל־/shop/fruits */
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const Cart = lazy(() => import("./pages/Cart").then((m) => ({ default: m.Cart })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const Faq = lazy(() => import("./pages/Faq").then((m) => ({ default: m.Faq })));
const ArticlesList = lazy(() => import("./pages/ArticlesList").then((m) => ({ default: m.ArticlesList })));
const ArticlePage = lazy(() => import("./pages/ArticlePage").then((m) => ({ default: m.ArticlePage })));
const Testimonials = lazy(() => import("./pages/Testimonials").then((m) => ({ default: m.Testimonials })));
const Privacy = lazy(() => import("./pages/Privacy").then((m) => ({ default: m.Privacy })));
const Accessibility = lazy(() => import("./pages/Accessibility").then((m) => ({ default: m.Accessibility })));
const Gallery = lazy(() => import("./pages/Gallery").then((m) => ({ default: m.Gallery })));
const Returns = lazy(() => import("./pages/Returns").then((m) => ({ default: m.Returns })));
const Terms = lazy(() => import("./pages/Terms").then((m) => ({ default: m.Terms })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

function LegacyArticleSlugRedirect() {
  const { slug } = useParams();
  if (!slug) return <Navigate to={ROUTES.blog} replace />;
  return <Navigate to={`${ROUTES.blog}/${slug}`} replace />;
}

export default function App() {
  const location = useLocation();

  return (
    <Layout>
      <div key={location.pathname} className="page-transition-shell">
        <Suspense fallback={<PageLoadFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />

            <Route path={ROUTES.shop.fruits} element={<Fruits />} />
            <Route path={ROUTES.shop.vegetables} element={<Vegetables />} />
            <Route path={ROUTES.shop.greensRoots} element={<GreensRoots />} />
            {/* מיצים התאחדו לתוך «מטבח טרי» */}
            <Route path={ROUTES.shop.juices} element={<Navigate to={ROUTES.ready.meals} replace />} />

            <Route path={ROUTES.ready.meals} element={<HomeFood />} />
            {/* חלווה התאחדה לתוך «מטבח טרי» */}
            <Route path={ROUTES.ready.sweets} element={<Navigate to={ROUTES.ready.meals} replace />} />

            <Route path={ROUTES.boxes.fruits} element={<Fruits />} />
            <Route path="/boxes/gifts" element={<Navigate to={ROUTES.boxes.fruits} replace />} />

            <Route path={ROUTES.about} element={<About />} />
            <Route path={ROUTES.gallery} element={<Gallery />} />
            <Route path={ROUTES.reviews} element={<Testimonials />} />
            <Route path={ROUTES.faq} element={<Faq />} />

            <Route path={ROUTES.blog} element={<ArticlesList />} />
            <Route path={`${ROUTES.blog}/:slug`} element={<ArticlePage />} />

            <Route path={ROUTES.contact} element={<Contact />} />
            <Route path={ROUTES.cart} element={<Cart />} />

            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/accessibility" element={<Accessibility />} />

            <Route path="/projects/*" element={<Navigate to={ROUTES.gallery} replace />} />
            <Route path="/catalog" element={<Navigate to="/" replace />} />
            <Route path="/platters" element={<Navigate to="/" replace />} />

            <Route path="/fruits" element={<Navigate to={ROUTES.shop.fruits} replace />} />
            <Route path="/vegetables" element={<Navigate to={ROUTES.shop.vegetables} replace />} />
            <Route path="/greens-roots" element={<Navigate to={ROUTES.shop.greensRoots} replace />} />
            <Route path="/juices" element={<Navigate to={ROUTES.ready.meals} replace />} />
            <Route path="/home-food" element={<Navigate to={ROUTES.ready.meals} replace />} />
            <Route path="/halva" element={<Navigate to={ROUTES.ready.meals} replace />} />
            <Route path="/testimonials" element={<Navigate to={ROUTES.reviews} replace />} />

            <Route path="/articles" element={<Navigate to={ROUTES.blog} replace />} />
            <Route path="/articles/:slug" element={<LegacyArticleSlugRedirect />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Layout>
  );
}
