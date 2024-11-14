import { useRouteLoaderData } from '@remix-run/react';
import { ConnectWithUserForm } from '~/forms';
import { loader } from '~/root';
import FallbackAvatar from './FallbackAvatar';

export type ConnectionStatus = 'ACCEPTED' | 'PENDING' | 'DECLINED';

export default function PeopleYouMayKnow() {
  const data = useRouteLoaderData<typeof loader>('root');
  const userId = data?.user?.id;
  const peopleYouMayKnow = data?.peopleYouMayKnow ?? [];

  const hasConnection = (targetUserId: string): boolean => {
    const userConnections = data?.user?.connections ?? [];
    const receivedConnections = data?.user?.receivedConnections ?? [];

    // Check if the user has an accepted connection with the target user
    const hasBeenAccepted = userConnections.some(
      connection => connection.targetUserId === targetUserId && connection.status === 'ACCEPTED'
    );

    // Check if the target user has accepted a connection from the user
    const hasAccepted = receivedConnections.some(
      connection => connection.userId === targetUserId && connection.status === 'ACCEPTED'
    );

    return hasBeenAccepted || hasAccepted;
  };

  return (
    <section aria-labelledby="people-you-may-know-heading" className="lg:col-span-1 lg:col-start-3">
      <div className="bg-surface dark:bg-zinc-950 shadow sm:rounded-lg border border-around-surface overflow-hidden">
        <div className="p-6">
          <h2 id="people-you-may-know-heading" className="text-base font-medium text-on-surface">
            {data?.peopleYouMayKnow?.length
              ? `People you may know in ${data?.user?.location?.city}`
              : 'People you may know near you'}
          </h2>
          <div className="mt-6 flow-root">
            <ul role="list" className="-my-4 divide-y divide-across-surface">
              {peopleYouMayKnow ? (
                peopleYouMayKnow
                  .filter(user => !hasConnection(user.id))
                  .slice(0, 5)
                  .map(user => (
                    <li key={user.id} className="flex items-center space-x-3 py-4">
                      <div className="flex-shrink-0">
                        {user?.profileImage?.url ? (
                          <img
                            alt={`${user.firstName} ${user.lastName}`}
                            src={user.profileImage?.url}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <FallbackAvatar height="h-8" width="w-8" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-on-surface">
                          <a href={`/${user.username}`}>{`${user.firstName} ${user.lastName}`}</a>
                        </p>
                        <p className="text-sm text-on-surface-variant">Hardcoded Cafe</p>
                      </div>
                      <div className="flex-shrink-0">
                        <ConnectWithUserForm userId={userId} targetUserId={user.id} />
                      </div>
                    </li>
                  ))
              ) : (
                <p className="text-sm text-on-surface-variant italic">No users found</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
