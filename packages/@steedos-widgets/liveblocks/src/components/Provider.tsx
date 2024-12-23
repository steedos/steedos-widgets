import React, { Suspense, useEffect, useState } from 'react';

import { LiveblocksProvider } from "@liveblocks/react";
import { Composer, Thread } from "@liveblocks/react-ui";
import { RoomProvider, useThreads } from "@liveblocks/react/suspense";
import { ErrorBoundary } from "react-error-boundary";
import "@liveblocks/react-ui/styles.css";


export const AmisRoomsProvider = (props: any) => {
  const {
    data: amisData,
    baseUrl,
    children,
    body, 
    render,
  } = props;

  const [token, setToken] = useState(null);

  const fixedBaseUrl = baseUrl || amisData.context?.rootUrl || `${window.location.protocol}//${window.location.host}`
  console.log('liveblocks baseUrl:', fixedBaseUrl);

  return (
    <LiveblocksProvider
      //@ts-ignore
      baseUrl={fixedBaseUrl}
      authEndpoint={async (room) => {
        const authEndpoint = `${fixedBaseUrl}/v2/c/auth`;
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
        const response = await fetch(`${fixedBaseUrl}/v2/c/users?${searchParams}`, {
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
          `${fixedBaseUrl}/v2/c/users/search?keyword=${encodeURIComponent(text)}`, {
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
      {body && render('body', body, {})}

      {children}
    </LiveblocksProvider>
  );
};
