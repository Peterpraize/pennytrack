import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return <section className="not-found"><p className="eyebrow">404 · PAGE NOT FOUND</p><h1>We can’t find that page.</h1><p className="page-intro">The page may have moved, or the address may be incorrect.</p><Link className="button button-primary" to="/">Back to overview</Link></section>;
}
