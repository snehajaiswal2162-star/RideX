import SearchPage from "@/components/SearchPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPage />
          </Suspense>
  );
}