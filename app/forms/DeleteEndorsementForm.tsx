import { TrashIcon } from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";

export const deleteEndorsementActionIntent = "delete-endorsement";

export default function DeleteEndorsementForm({ endorsementId }: { endorsementId: string }) {
  const fetcher = useFetcher({ key: deleteEndorsementActionIntent });
  return (
    <fetcher.Form method="POST">
      <input type="hidden" name="endorsementId" value={endorsementId} />
      <button type="submit" name="intent" value={deleteEndorsementActionIntent} className="flex items-center h-4 w-4 text-on-surface-variant">
        <TrashIcon />
      </button>
    </fetcher.Form>
  );
}
