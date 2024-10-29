import { useRouteLoaderData } from '@remix-run/react';
import { ConnectWithUserForm } from '~/forms';
import { loader } from '~/root';

const peopleYouMayKnow = [
  {
    name: 'Matt Millard',
    placeOfWork: 'Giulia Pizza, Elgin Street',
    href: '/mattmillard',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Finn Millard',
    placeOfWork: 'Riviera',
    href: '/finnmillard',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Hamish Millard',
    placeOfWork: 'Stolen Goods Cocktail Bar',
    href: '/hamishmillard',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Islay Millard',
    placeOfWork: 'Buvette Daphne',
    href: '/islaymillard',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

export default function PeopleYouMayKnow() {
  const data = useRouteLoaderData<typeof loader>('root');
  const userId = data?.user?.id;
  return (
    <section aria-labelledby="people-you-may-know-heading" className="lg:col-span-1 lg:col-start-3">
      <div className="bg-surface dark:bg-zinc-950 shadow sm:rounded-lg border border-around-surface overflow-hidden">
        <div className="p-6">
          <h2 id="people-you-may-know-heading" className="text-base font-medium text-on-surface">
            People you may know in Ottawa {/*TODO: Replace with dynamic location*/}
          </h2>
          <div className="mt-6 flow-root">
            <ul role="list" className="-my-4 divide-y divide-across-surface">
              {peopleYouMayKnow.map(user => (
                <li key={user.href} className="flex items-center space-x-3 py-4">
                  <div className="flex-shrink-0">
                    <img alt={user.name} src={user.imageUrl} className="h-8 w-8 rounded-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-on-surface">
                      <a href={user.href}>{user.name}</a>
                    </p>
                    <p className="text-sm text-on-surface-variant">{user.placeOfWork}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <ConnectWithUserForm userId={userId} targetUserId={'321'} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
