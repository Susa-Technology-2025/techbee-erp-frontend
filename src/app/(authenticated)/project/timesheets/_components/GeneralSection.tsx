import { EmployeeIdField } from "./GeneralSectionFields";
import { EntryCodeField } from "./GeneralSectionFields";
import { PeriodStartField } from "./GeneralSectionFields";
import { PeriodEndField } from "./GeneralSectionFields";
import { TotalHoursField } from "./GeneralSectionFields";
import { TotalAmountField } from "./GeneralSectionFields";
import { RejectionReasonField } from "./GeneralSectionFields";
import { ApprovedByEmployeeIdField } from "./GeneralSectionFields";
import { ApprovedAtField } from "./GeneralSectionFields";
import { SubmittedAtField } from "./GeneralSectionFields";
import { EntriesField } from "./GeneralSectionFields";
import { Box } from "@mui/material";

export const GeneralSection = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <EmployeeIdField />
      <EntryCodeField />
      <PeriodStartField />
      <PeriodEndField />
      <TotalHoursField />
      <TotalAmountField />
      <RejectionReasonField />
      {/* <ApprovedByEmployeeIdField/> */}
      <ApprovedAtField />
      <SubmittedAtField />
      <EntriesField />
    </Box>
  );
};
