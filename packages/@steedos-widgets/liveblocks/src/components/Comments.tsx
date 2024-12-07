import React, { Suspense, useEffect, useState } from 'react';

import { LiveblocksProvider } from "@liveblocks/react";
import { Composer, Thread } from "@liveblocks/react-ui";
import { RoomProvider, useThreads } from "@liveblocks/react/suspense";
import { ErrorBoundary } from "react-error-boundary";

export const Loading = () => {
  return <div>Loading...</div>;
}

export const Threads = (props:any) => {
  const { threads } = useThreads();

  return (
    <main>
      {threads.map((thread) => (
        <Thread key={thread.id} thread={thread} className="thread" />
      ))}
      <Composer className="composer" />
    </main>
  );
}

export const AmisComments = (props: any) => {
  const {
    config: configJSON = null,
    data: amisData,
    className,
    roomId,
    authEndpoint,
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

  if (!config) {
    return <>Loading...</>;
  }

  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
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
    >
      <RoomProvider id={roomId}>
        <ErrorBoundary
          fallback={
            <div className="error">There was an error while getting threads.</div>
          }
        >
          <Suspense fallback={<Loading />}>
            <Threads />
          </Suspense>
        </ErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
};
