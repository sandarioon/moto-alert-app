import io, { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

import { SocketIoEvents } from "@/utils/types";
import { InputChatMessage } from "@/app/chat/models";

export const useSocket = ({ authToken }: { authToken: string }) => {
  const [socketData, setSocketData] = useState<any>({});
  const [isConnected, setIsConnected] = useState(false);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!authToken) {
      console.log("No auth token");
      return;
    }

    if (socket.current) {
      console.log("Already connected");
      return;
    }

    try {
      const url = process.env.EXPO_PUBLIC_SOCKET_URL;
      const options = {
        transports: ["websocket"],
        auth: {
          Authorization: authToken,
        },
      };
      socket.current = io(url, options);

      socket.current.on(SocketIoEvents.CHAT, (message: string) => {
        console.log("CHAT Message received:", message);
        setSocketData(message);
      });

      socket.current.on("connect", () => {
        console.log("Connected!");
        setIsConnected(true);
      });

      socket.current.on("disconnect", () => {
        console.log("Disconnected!");
        setIsConnected(false);
      });
    } catch (error) {
      console.log(error);
    }
    return () => {
      if (socket.current) socket.current.off(SocketIoEvents.CHAT);
    };
  }, [authToken]);

  const sendChatMessage = (chatMessage: InputChatMessage) => {
    if (!socket.current) return;

    socket.current.emit(SocketIoEvents.CHAT, JSON.stringify(chatMessage));
  };

  return {
    socketData,
    sendChatMessage,
    isConnected,
  };
};
