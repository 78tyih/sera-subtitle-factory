import { families } from '@/styles/families';
import { FamilyView } from '@/components/library/FamilyView';

/**
 * /library/<family> — a Style Family page (PART I §67).
 * Statically exported: every family key gets its own HTML file.
 */
export function generateStaticParams() {
  return families.map((f) => ({ family: f.key }));
}

export default async function FamilyPage({ params }: { params: Promise<{ family: string }> }) {
  const { family } = await params;
  return <FamilyView familyKey={family} />;
}
