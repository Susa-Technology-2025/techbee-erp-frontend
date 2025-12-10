"use client";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { sessionActions } from "./auth-slice";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
export default function SessionProvider({ children }: { children: ReactNode }) {
  const session = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch();
  useEffect(() => {
    const hostname = window.location.hostname;
    const derivedCode = hostname.split(".")[0];
    setCode(derivedCode);
  }, []);
  const [code, setCode] = useState();
  const {
    data: refreshResult,
    isSuccess,
    isError,
    error,
  } = useDataQuery({
    apiEndPoint: "https://api.techbee.et/api/auth/auth/refresh-token",
    enabled: Boolean(code) && !Boolean(session.tenantCode),
    fetchWithoutRefresh: true,
    tenantCode: code,
    noFilter: true,
  });

  useEffect(() => {
    if (isSuccess) {
      const data = refreshResult;
      if (data && data.user && data.organization) {
        dispatch(
          sessionActions.setSession({
            ...session,
            user: data.user,
            organization: data.organization,
            loggedIn: Boolean(data.user),
            tenantCode: data.tenantCode,
          })
        );
      }
    }
  }, [isSuccess, isError]);

  return <>{children}</>;
}
