import { notFound } from "next/navigation";
import { QASceneViewer } from "@/components/qa/QASceneViewer";

export default function QAPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <QASceneViewer />;
}
