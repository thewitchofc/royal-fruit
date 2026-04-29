import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PageLoadFallback } from "./components/PageLoadFallback";
import { Home } from "./pages/Home";

const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const Fruits = lazy(() => import("./pages/Fruits").then((m) => ({ default: m.Fruits })));
const Vegetables = lazy(() => import("./pages/Vegetables").then((m) => ({ default: m.Vegetables })));
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

export default function App() {
  const location = useLocation();

  return (
    <Layout>
      <div key={location.pathname} className="page-transition-shell">
        <Suspense fallback={<PageLoadFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/articles" element={<ArticlesList />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/projects/*" element={<Navigate to="/gallery" replace />} />
            <Route path="/catalog" element={<Navigate to="/" replace />} />
            <Route path="/fruits" element={<Fruits />} />
            <Route path="/vegetables" element={<Vegetables />} />
            <Route path="/platters" element={<Navigate to="/" replace />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Layout>
  );
}
