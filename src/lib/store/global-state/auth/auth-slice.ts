import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserType = {
  firstName: string;
  fatherName: string;
  avatar: string;
  id: string;
  employeeId: string;
  username: string;
  email: string;
};

type OrganizationType = {
  name: string;
  code: string;
  logo: string;
  id: string;
};

type AuthSlice = {
  loggedIn: boolean;
  user: UserType;
  organization: OrganizationType;
  accessToken: string;
  permissions: string[];
  tenantCode: string;
};

const initialState: AuthSlice = {
  loggedIn: false,
  accessToken: "",
  user: {
    firstName: "",
    username: "",
    avatar: "",
    employeeId: "",
    fatherName: "",
    id: "",
    email: "",
  },
  organization: {
    code: "",
    id: "",
    logo: "",
    name: "",
  },
  permissions: ["super_admin"],
  tenantCode: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state: AuthSlice, action: PayloadAction<AuthSlice>) => {
      return action.payload;
    },

    clearSession: (state) => {
      return initialState;
    },
  },
});

export const sessionActions = authSlice.actions;
export default authSlice.reducer;
