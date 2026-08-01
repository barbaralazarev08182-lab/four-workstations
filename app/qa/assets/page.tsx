import { notFound } from "next/navigation";
import { AssetLab } from "@/components/qa/AssetLab";

export default function AssetLabPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <AssetLab />;
}
