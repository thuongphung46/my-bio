import { useEffect, useMemo, useState } from 'react';
import {
  onDisconnect,
  onValue,
  ref,
  remove,
  serverTimestamp,
  set
} from 'firebase/database';
import { firebaseConfigError, rtdb } from '../../infrastructure/firebase/config';

function getSessionId() {
  const key = 'presence_session_id';
  const existing = sessionStorage.getItem(key);
  if (existing) {
    return existing;
  }

  const nextId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now());
  sessionStorage.setItem(key, nextId);
  return nextId;
}

export function usePresenceCount() {
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [presenceError, setPresenceError] = useState<string | null>(null);

  useEffect(() => {
    if (!rtdb) {
      setPresenceError(firebaseConfigError ?? 'Firebase chưa được khởi tạo.');
      return;
    }

    setPresenceError(null);

    const sessionId = getSessionId();
    const sessionRef = ref(rtdb, `presence/${sessionId}`);
    const listRef = ref(rtdb, 'presence');

    // Mark this tab/session as online and ensure cleanup.
    void set(sessionRef, {
      path: window.location.pathname,
      connectedAt: serverTimestamp()
    });
    void onDisconnect(sessionRef).remove();

    const unsubscribe = onValue(
      listRef,
      (snapshot) => {
        let count = 0;
        snapshot.forEach(() => {
          count += 1;
          return false;
        });
        setOnlineCount(count);
      },
      () => {
        setPresenceError('Không lấy được số người đang online.');
      }
    );

    return () => {
      unsubscribe();
      void remove(sessionRef);
    };
  }, []);

  return useMemo(
    () => ({
      onlineCount,
      presenceError
    }),
    [onlineCount, presenceError]
  );
}
