import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Link, useFetchers, useLoaderData } from '@remix-run/react';
import {
  deleteEndorsementAction,
  markAllAsReadAction,
  publicEndorsementAction,
  updateLocationAction,
} from '~/.server/actions';
import { requireUserId } from '~/.server/auth';
import { prisma } from '~/.server/db';
import { FallbackAvatar, PeopleYouMayKnow } from '~/components';
import {
  DeleteDocumentForm,
  DeleteEndorsementForm,
  PublicEndorsementForm,
  UpdateLocationForm,
  UploadDocumentForm,
  UploadProfileImageForm,
} from '~/forms';
import { deleteEndorsementActionIntent } from '~/forms/DeleteEndorsementForm';
import { markAllAsReadActionIntent } from '~/forms/MarkAllAsReadForm';
import { publicEndorsementActionIntent } from '~/forms/PublicEndorsmentForm';
import { updateLocationActionIntent } from '~/forms/UpdateLocationForm';
import { uploadProfileImageActionIntent } from '~/forms/UploadProfileImageForm';
import { useOptimistic } from '~/hooks';
import classNames from '~/utils/classNames';
import timeAgo from '~/utils/timeAgo';

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request); // Later update to only allow users who are verified friends
  const formData = await request.formData();
  const intent = formData.get('intent');

  switch (intent) {
    case publicEndorsementActionIntent: {
      return publicEndorsementAction({ userId, formData, request });
    }
    case deleteEndorsementActionIntent: {
      return deleteEndorsementAction({ userId, formData, request });
    }
    case updateLocationActionIntent: {
      return updateLocationAction({ userId, formData, request });
    }
    case markAllAsReadActionIntent: {
      return markAllAsReadAction({ userId, formData, request });
    }
    default: {
      throw new Error('Invalid intent');
    }
  }
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request); // throws if user is not logged in

  const visitorData = await prisma.user.findFirst({
    where: { id: userId },
    include: {
      profileImage: true,
    },
  });

  // get user's document data and return it
  const data = await prisma.user.findUnique({
    where: { username: params.username },
    include: { documents: true, profileImage: true, endorsements: true, location: true },
  });

  const isCurrentUser = data?.id === userId;

  return { ...data, isCurrentUser, visitorData };
}

export default function UserProfileRoute() {
  const data = useLoaderData<typeof loader>();
  const isCurrentUser = data.isCurrentUser;
  const fetchers = useFetchers();

  const isDeletingDocument = (documentId: string) => {
    return fetchers.some(fetcher => {
      return fetcher.formAction === `/resource/${documentId}` && fetcher.formMethod === 'POST';
    });
  };

  const isUploadingProfileImage = fetchers.some(
    fetcher => fetcher.key === uploadProfileImageActionIntent && fetcher.state !== 'idle'
  );

  const isDeletingEndorsement = (endorsementId: string) => {
    return fetchers.some(fetcher => {
      return fetcher.key === deleteEndorsementActionIntent && fetcher.formData?.get('endorsementId') === endorsementId;
    });
  };

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl xl:max-w-full lg:px-8">
        <div className="flex items-center space-x-5">
          <div className="relative flex-shrink-0">
            {data.profileImage?.url ? (
              <img
                className={classNames(
                  'h-20 w-20 lg:h-24 lg:w-24 rounded-full object-cover shadow-md',
                  isUploadingProfileImage ? 'animate-pulse' : ''
                )}
                src={data.profileImage?.url}
              />
            ) : (
              <FallbackAvatar height="h-20 lg:h-24" width="w-20 lg:w-24" isPending={isUploadingProfileImage} />
            )}
            {isCurrentUser ? (
              <div className="absolute bottom-0 right-0">
                <UploadProfileImageForm isPending={isUploadingProfileImage} />
              </div>
            ) : null}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">{`${data.firstName} ${data.lastName}`}</h1>
            <p className="text-sm font-medium text-on-surface-variant">
              Bartender and server at Giulia Pizza Elgin Street
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:mx-0 lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2 lg:col-start-1">
          {/* Personal Information */}
          <section aria-labelledby="personal-information-title">
            <div className="bg-surface dark:bg-zinc-950 shadow sm:rounded-lg border border-around-surface">
              <div className="px-4 py-5 sm:px-6">
                <h2 id="personal-information-title" className="text-lg font-medium leading-6 text-on-surface">
                  Personal Information
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">Personal details and resume.</p>
              </div>

              <div className="border-t border-across-surface px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-on-surface">Current Position</dt>
                    <dd className="mt-1 text-sm text-on-surface-variant">
                      Bartender and server at Giulia Pizza Elgin Street
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-on-surface">Email address</dt>
                    <dd className="mt-1 text-sm text-on-surface-variant">{data.email}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    {isCurrentUser ? (
                      <UpdateLocationForm initialCity={data.location?.city} />
                    ) : (
                      <div>
                        <dt className="text-sm font-medium text-on-surface">Location</dt>
                        <dd className="mt-1 text-sm text-on-surface-variant">
                          {useOptimistic(updateLocationActionIntent, 'city') ?? data.location?.city}
                        </dd>
                      </div>
                    )}
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-on-surface">Phone</dt>
                    <dd className="mt-1 text-sm text-on-surface-variant">+1 (613) 223-9371</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-on-surface">About</dt>
                    <dd className="mt-1 text-sm text-on-surface-variant">
                      Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat.
                      Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia
                      proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-on-surface">Resume & References</dt>
                    <dd className="mt-1 text-sm text-on-surface-variant">
                      <ol
                        role="list"
                        className={classNames(
                          'divide-y divide-across-surface',
                          data?.documents?.length || isCurrentUser ? 'border rounded-md border-around-surface' : ''
                        )}
                      >
                        {isCurrentUser ? <UploadDocumentForm /> : null}

                        {data.documents?.length ? (
                          data.documents.map(document => (
                            <li
                              key={document.id}
                              className={classNames(
                                'items-center justify-between py-2 pl-4 pr-6 text-sm',
                                isDeletingDocument(document.id) ? 'hidden' : 'flex'
                              )}
                            >
                              <a
                                href={`/resource/${document.id}`}
                                className="flex w-0 flex-1 items-center h-6 font-medium text-primary hover:text-primary-variant disabled:text-dodger-blue-800 disabled:cursor-not-allowed"
                                download={document.fileName}
                              >
                                {isCurrentUser ? <DeleteDocumentForm documentId={document.id} /> : null}
                                <span className="w-0 flex-1 truncate text-zinc-500">{document.fileName}</span>
                                <div className="ml-4 flex-shrink-0 flex">Download</div>
                              </a>
                            </li>
                          ))
                        ) : isCurrentUser ? null : (
                          <li className="pr-6 text-sm text-on-surface-variant italic truncate">{`${data.firstName} hasn't uploaded any documents yet.`}</li>
                        )}
                      </ol>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          {/* Public Endorsements*/}
          <section aria-labelledby="public-endorsements">
            <div className="bg-surface dark:bg-zinc-950 shadow sm:rounded-lg border border-around-surface overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h2 id="public-endorsements-title" className="text-lg font-medium leading-6 text-on-surface">
                  Public Endorsements
                </h2>
                {isCurrentUser ? null : (
                  <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">{`If you have worked alongside ${data.firstName}, leave a public endorsement below.`}</p>
                )}
              </div>

              <div className="border-t border-across-surface px-4 py-5 sm:px-6">
                <ul role="list" className="grid grid-cols-1 gap-y-5">
                  {data.endorsements?.length ? (
                    data.endorsements.map(endorsement => (
                      <li
                        key={endorsement.id}
                        className={classNames(isDeletingEndorsement(endorsement.id) ? 'hidden' : '')}
                      >
                        <div className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <Link to={`/${endorsement.authorUsername}`} prefetch="intent">
                              {endorsement?.authorUrl ? (
                                <img
                                  alt={endorsement.authorFullName}
                                  src={endorsement?.authorUrl}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <FallbackAvatar height="h-10" width="w-10" />
                              )}
                            </Link>
                          </div>
                          <div>
                            <div className="text-sm">
                              <Link
                                to={`/${endorsement.authorUsername}`}
                                prefetch="intent"
                                className="font-medium text-on-surface"
                              >
                                {endorsement.authorFullName}
                              </Link>
                            </div>
                            <div className="mt-1 text-sm text-on-surface-variant">
                              <p>{endorsement.body}</p>
                            </div>
                            <div className="mt-2 flex items-center gap-x-2 text-sm">
                              <span className="font-medium text-on-surface-variant">
                                {timeAgo(new Date(endorsement.createdAt))}
                              </span>{' '}
                              {isCurrentUser || endorsement.authorId === data.visitorData?.id ? (
                                <DeleteEndorsementForm endorsementId={endorsement.id} />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : isCurrentUser ? (
                    <li className="pr-6 text-sm text-on-surface-variant italic truncate">{`You currently don't have any endorsements.`}</li>
                  ) : (
                    <li className="pr-6 text-sm text-on-surface-variant italic truncate">{`Be the first to give ${data.firstName} an endorsement.`}</li>
                  )}
                </ul>
              </div>

              {/* If user is not the current user, give the visiting user the ability to post a public endorsement */}
              {!isCurrentUser ? (
                <div className="px-4 py-6 sm:px-6 border-t border-across-surface">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      {data.visitorData?.profileImage?.url ? (
                        <img
                          alt={`${data.visitorData?.firstName} ${data.visitorData?.lastName}`}
                          src={data.visitorData?.profileImage?.url}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <FallbackAvatar height="h-10" width="w-10" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <PublicEndorsementForm endorsedUserId={data.id} />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
        {/* People You May Know */}
        <PeopleYouMayKnow />
      </div>
    </>
  );
}
