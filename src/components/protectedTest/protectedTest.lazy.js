import React, { lazy, Suspense } from 'react';

const LazyProtectedTest = lazy(() => import('./ProtectedTest'));

const ProtectedTest = props => (
  <Suspense fallback={null}>
    <LazyProtectedTest {...props} />
  </Suspense>
);

export default ProtectedTest;
