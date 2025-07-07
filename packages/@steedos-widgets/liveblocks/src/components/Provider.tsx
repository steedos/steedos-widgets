import React, { Suspense, useEffect, useState, ReactNode } from 'react';

import { LiveblocksProvider } from "@liveblocks/react";
import { Composer, Thread, LiveblocksUIConfig } from "@liveblocks/react-ui";
import { RoomProvider, useThreads } from "@liveblocks/react/suspense";
import { ErrorBoundary } from "react-error-boundary";
import "@liveblocks/react-ui/styles.css";
import { i18next } from '../i18n';
import { useTranslation } from "react-i18next";

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

  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const liveblocksResources = i18next.getResourceBundle(lang, "liveblocks") || {};

  const overrides = {
    locale: lang,
    ...liveblocksResources
  };

  const commentsCommented = overrides.INBOX_NOTIFICATION_THREAD_COMMENTS_LIST__commented || 'commented';
  const commentsIn = overrides.INBOX_NOTIFICATION_THREAD_COMMENTS_LIST__in || 'in';
  const commentsInAThread = overrides.INBOX_NOTIFICATION_THREAD_COMMENTS_LIST__in_a_thread || 'in a thread';
  overrides.INBOX_NOTIFICATION_THREAD_COMMENTS_LIST = (
    list: ReactNode,
    room: ReactNode
  ) => (
    <>
      {list} {commentsCommented}
      {room ? <> {commentsIn} {room}</> : <> {commentsInAThread}</>}
    </>
  )

  return (
    <LiveblocksUIConfig overrides={overrides}>
    <LiveblocksProvider
      //@ts-ignore
      baseUrl={fixedBaseUrl}
      authEndpoint={async (room) => {
        const authEndpoint = `${fixedBaseUrl}/v2/c/auth`;
        const headers = {
          "Content-Type": "application/json",
        };
        const authToken = localStorage.getItem("steedos:authToken")
        const spaceId = localStorage.getItem("steedos:spaceId")
        if (spaceId && authToken) {
          headers['Authorization'] = `Bearer ${spaceId},${authToken}`
        }

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
      // Get rooms' info from their ID
      resolveRoomsInfo={async ({ roomIds }) => {
        const searchParams = new URLSearchParams(
          roomIds.map((roomId) => ["roomIds", roomId])
        );
        const response = await fetch(`${fixedBaseUrl}/v2/c/rooms?${searchParams}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(i18next.t('liveblocks:frontend_fetch_rooms_info_error'));
        }

        const roomsInfo = await response.json();
        return roomsInfo;
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
          throw new Error(i18next.t('liveblocks:frontend_fetch_users_error'));
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
          throw new Error(i18next.t('liveblocks:frontend_fetch_mention_suggestions_error'));
        }

        const userIds = await response.json();
        return userIds;
      }}
    >
      {body && render('body', body, {})}

      {children}
    </LiveblocksProvider>
    </LiveblocksUIConfig>
  );
};
