import React, { Suspense, useEffect, useState } from 'react';

import { LiveblocksProvider } from "@liveblocks/react";
import { Composer, Thread } from "@liveblocks/react-ui";
import { RoomProvider, useThreads } from "@liveblocks/react/suspense";
import { ErrorBoundary } from "react-error-boundary";
import "@liveblocks/react-ui/styles.css";
// import "@liveblocks/react-ui/styles/dark/media-query.css";
import { Loading } from "./Loading";

import './Comments.css';

export const Threads = ({
      indentCommentContent,
      showActions,
      showDeletedComments,
      showResolveAction,
      showReactions,
      showComposer,
      showAttachments
      }) => {
  const { threads } = useThreads();

  return (
    <>
      {threads.map((thread) => (
        <Thread key={thread.id} thread={thread} className="thread" 
                indentCommentContent={indentCommentContent} 
                showActions={showActions} 
                showDeletedComments={showDeletedComments} 
                showResolveAction={showResolveAction} 
                showReactions={showReactions} 
                showComposer={showComposer} 
                showAttachments={showAttachments}  />
      ))}
      { showComposer && (<Composer className="composer" />) }
    </>
  );
}

export const AmisComments = (props: any) => {
  let {
    className = "m-2 flex flex-col gap-y-2",
    roomId,
    readonly = false,
    indentCommentContent = true,
    showActions = "hover",
    showDeletedComments,
    showResolveAction = true,
    showReactions = true,
    showComposer = "collapsed",
    showAttachments = true,
  } = props;

  if (readonly) {
    showComposer = false;
    showActions = false;
  }

  return (
      <RoomProvider id={roomId}>
        <ErrorBoundary
          fallback={
            <div className="error">There was an error while getting threads.</div>
          }
        >
          <Suspense fallback={<Loading />}>
            <main className={className}>
              <Threads 
                indentCommentContent={indentCommentContent} 
                showActions={showActions} 
                showDeletedComments={showDeletedComments} 
                showResolveAction={showResolveAction} 
                showReactions={showReactions} 
                showComposer={showComposer} 
                showAttachments={showAttachments} />
            </main>
          </Suspense>
        </ErrorBoundary>
      </RoomProvider>
  );
};
