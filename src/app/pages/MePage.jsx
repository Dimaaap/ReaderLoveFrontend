"use client";

import { withAuth } from '@/components/WithAuth'

function MeContent() {
  return (
    <div>MePage</div>
  )
}

const ProtectedMePage = withAuth(MeContent);

export default function MePage() {
  return <ProtectedMePage />;
}