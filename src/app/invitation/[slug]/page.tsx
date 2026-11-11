import { notFound } from "next/navigation";
import { getConfig, getWishes, getGuestBySlug } from "@/lib/db";
import { InvitationView } from "@/components/invitation/invitation-view";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PersonalizedInvitationPage({ params }: PageProps) {
  const { slug } = await params;
  const config = await getConfig();
  const wishes = await getWishes();
  const guest = await getGuestBySlug(slug);

  if (!guest) {
    const fallbackName = decodeURIComponent(slug)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return (
      <InvitationView
        config={config}
        guest={null}
        guestNameParam={fallbackName}
        initialWishes={wishes}
      />
    );
  }

  return (
    <InvitationView
      config={config}
      guest={guest}
      guestNameParam={guest.name}
      initialWishes={wishes}
    />
  );
}
