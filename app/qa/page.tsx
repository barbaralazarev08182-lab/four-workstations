import Image from "next/image";
import "./qa.css";

export default function QualityComparisonPage() {
  return (
    <main className="qa-board">
      <figure>
        <figcaption>视觉基准</figcaption>
        <Image src="/qa/reference.png" width={1488} height={1058} alt="四人工位视觉基准" priority unoptimized />
      </figure>
      <figure>
        <figcaption>交互实现</figcaption>
        <Image src="/qa/implementation.png?v=visual-v2" width={1440} height={1024} alt="四人工位实现截图" priority unoptimized />
      </figure>
    </main>
  );
}
