import { parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { prisma } from '~/.server/db';
import { NotificationTypes } from '~/components/NotificationDropDown';
import {
  acceptConnectionActionIntent,
  cancelConnectionActionIntent,
  declineConnectionActionIntent,
  initiateConnectionActionIntent,
} from '~/forms/ConnectWithUserForm';
import { connectionSchema } from '~/schemas';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  switch (intent) {
    case initiateConnectionActionIntent: {
      return initiateConnection(formData);
    }
    case cancelConnectionActionIntent: {
      return cancelConnection(formData);
    }
    case acceptConnectionActionIntent: {
      return acceptConnection(formData);
    }
    case declineConnectionActionIntent: {
      return declineConnection(formData); // Currently, the decline action is the same as the cancel action
    }
    default: {
      return json({ status: 'error', message: 'Invalid intent' }, { status: 400 });
    }
  }
}

// Do not expose this route
export async function loader() {
  throw redirect('/');
}

async function initiateConnection(formData: FormData) {
  const submission = parseWithZod(formData, { schema: connectionSchema });

  if (submission.status !== 'success') {
    return json(submission.reply(), {
      status: 400,
    });
  }

  const { userId, targetUserId } = submission.value;

  // Refactor into a transaction and include creating a notification

  const [connection, notification] = await prisma.$transaction([
    prisma.connection.create({
      data: {
        userId,
        targetUserId,
      },
    }),
    prisma.notification.create({
      data: {
        type: NotificationTypes.CONNECTION_REQUEST,
        userId: targetUserId,
        metadata: JSON.stringify({ requestedBy: userId }),
      },
    }),
  ]);

  if (!connection) {
    return json({ error: 'Connection could not be created' }, { status: 500 });
  }
  return json({ success: true });
}

async function cancelConnection(formData: FormData) {
  const submission = parseWithZod(formData, { schema: connectionSchema });

  if (submission.status !== 'success') {
    return json(submission.reply(), {
      status: 400,
    });
  }

  const { userId, targetUserId } = submission.value;

  const deletedConnection = await prisma.connection.delete({
    where: {
      userId_targetUserId: {
        userId,
        targetUserId,
      },
    },
  });

  if (!deletedConnection) {
    return json({ error: 'Connection could not be deleted' }, { status: 500 });
  }

  return json({ success: true });
}

async function acceptConnection(formData: FormData) {
  const submission = parseWithZod(formData, { schema: connectionSchema });

  if (submission.status !== 'success') {
    return json(submission.reply(), {
      status: 400,
    });
  }

  const { userId, targetUserId } = submission.value;

  const connection = await prisma.connection.update({
    where: {
      userId_targetUserId: {
        userId: targetUserId,
        targetUserId: userId,
      },
    },
    data: {
      status: 'ACCEPTED',
    },
  });

  if (!connection) {
    return json({ error: 'Connection could not be accepted' }, { status: 500 });
  }

  return json({ success: true });
}

async function declineConnection(formData: FormData) {
  const submission = parseWithZod(formData, { schema: connectionSchema });

  if (submission.status !== 'success') {
    return json(submission.reply(), {
      status: 400,
    });
  }

  const { userId, targetUserId } = submission.value;

  const connection = await prisma.connection.update({
    where: {
      userId_targetUserId: {
        userId: targetUserId,
        targetUserId: userId,
      },
    },
    data: {
      status: 'DECLINED',
    },
  });

  if (!connection) {
    return json({ error: 'Connection could not be declined' }, { status: 500 });
  }

  return json({ success: true });
}
