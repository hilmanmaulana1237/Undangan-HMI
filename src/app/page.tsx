import { getConfig, getWishes, getGuestByName } from "@/lib/db";
import { InvitationView } from "@/components/invitation/invitation-view";

interface PageProps {
  searchParams: Promise<{ to?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const config = await getConfig();
  const wishes = await getWishes();

  const toParam = params.to ? decodeURIComponent(params.to).trim() : undefined;
  const guest = toParam ? (await getGuestByName(toParam)) || null : null;

  return (
    <InvitationView
      config={config}
      guest={guest}
      guestNameParam={toParam}
      initialWishes={wishes}
    />
  );
}
