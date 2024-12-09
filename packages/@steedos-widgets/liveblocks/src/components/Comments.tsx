import React, { Suspense, useEffect, useState } from 'react';

import { LiveblocksProvider } from "@liveblocks/react";
import { Composer, Thread } from "@liveblocks/react-ui";
import { RoomProvider, useThreads } from "@liveblocks/react/suspense";
import { ErrorBoundary } from "react-error-boundary";
import "@liveblocks/react-ui/styles.css";
// import "@liveblocks/react-ui/styles/dark/media-query.css";

import './Comments.css';

export const Loading = () => {
  return <div>Loading...</div>;
}

export const Threads = (props:any) => {
  const { threads } = useThreads();

  return (
    <>
      {threads.map((thread) => (
        <Thread key={thread.id} thread={thread} className="thread" />
      ))}
      <Composer className="composer" />
    </>
  );
}

export const AmisComments = (props: any) => {
  const {
    config: configJSON = {},
    data: amisData,
    className = "m-2 flex flex-col gap-y-2",
    roomId,
    baseUrl,
    dataFilter
  } = props;

  const [config, setConfig] = useState(configJSON);
  const [token, setToken] = useState(null);

  let onDataFilter = null;
  
  if (typeof dataFilter === 'string') {

    onDataFilter = new Function('config', 'data', 'return (async () => { ' + dataFilter + ' })()')
  }

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        if (onDataFilter) {
          const newConfig = await onDataFilter(config, amisData);
          if (!isCancelled) {
            setConfig(newConfig || config);
          }
        }
      } catch (e) {
        console.warn(e);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <LiveblocksProvider
      //@ts-ignore
      baseUrl={baseUrl}
      authEndpoint={async (room) => {
        const authEndpoint = `${baseUrl}/v2/c/auth`;
        const headers = {
          "Content-Type": "application/json",
        };

        const body = JSON.stringify({
          room,
        });

        const response = await fetch(authEndpoint, {
          method: "POST",
          headers,
          body,
          credentials: 'include'
        });
        const result = await response.json();
        setToken(result.token);

        return result;
      }}
      // Get users' info from their ID
      resolveUsers={async ({ userIds }) => {
        const searchParams = new URLSearchParams(
          userIds.map((userId) => ["userIds", userId])
        );
        const response = await fetch(`${baseUrl}/v2/c/users?${searchParams}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Problem resolving users");
        }

        const users = await response.json();
        return users;
      }}
      // publicApiKey={import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY}

      // Find a list of users that match the current search term
      resolveMentionSuggestions={async ({ text = "" }) => {
        const response = await fetch(
          `${baseUrl}/v2/c/users/search?keyword=${encodeURIComponent(text)}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Problem resolving mention suggestions");
        }

        const userIds = await response.json();
        return userIds;
      }}
    >
      <RoomProvider id={roomId}>
        <ErrorBoundary
          fallback={
            <div className="error">There was an error while getting threads.</div>
          }
        >
          <Suspense fallback={<Loading />}>
            <main className={className}>
              <Threads />
            </main>
          </Suspense>
        </ErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
};
