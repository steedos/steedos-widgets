import React, { Suspense, useEffect, useState } from 'react';

import { LiveblocksProvider } from "@liveblocks/react";
import { Composer, Thread } from "@liveblocks/react-ui";
import { RoomProvider, useThreads } from "@liveblocks/react/suspense";
import { ErrorBoundary } from "react-error-boundary";
import "@liveblocks/react-ui/styles.css";
// import "@liveblocks/react-ui/styles/dark/media-query.css";
import { Loading } from "./Loading";

import './Comments.css';

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
    className = "m-2 flex flex-col gap-y-2",
    roomId,
  } = props;


  return (
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
  );
};
