export default function ProtectedRoute({ allowed, fallback, children }) {
  if (!allowed) return <>{fallback ?? null}</>;
  return <>{children}</>;
}
