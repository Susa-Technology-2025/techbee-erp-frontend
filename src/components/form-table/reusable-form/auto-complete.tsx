import { type JSX } from "react";
import { Box } from "@mui/material";
import { type FieldLevelMeta } from "@/lib/schemas/types";
import { AsyncAutocomplete } from "./async-auto-complete";
import { StaticAutocomplete } from "./static-auto-complete";

type AutocompleteFieldProps = {
  value: any;
  onChange: (val: any) => void;
  helperText: string | undefined;
  meta: FieldLevelMeta;
  error: boolean;
  required: boolean;
  label: string;
  disabled: boolean;
};

export default function AutocompleteField(
  props: AutocompleteFieldProps
): JSX.Element {
  const { meta } = props;
  if (!meta.formRelated.autoComplete) return <Box />;

  return meta.formRelated.autoComplete.async ? (
    <AsyncAutocomplete {...props} />
  ) : (
    <StaticAutocomplete {...props} />
  );
}
