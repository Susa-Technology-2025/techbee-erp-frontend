// "use client";

// import { Controller, useFormContext } from "react-hook-form";
// import { useState, SyntheticEvent, useEffect, useMemo } from "react";
// import { Autocomplete, Box, TextField, CircularProgress } from "@mui/material";
// import { SxProps, Theme } from "@mui/material/styles";
// import { FieldValues, Path } from "react-hook-form";
// import { useDataQuery } from "@/lib/tanstack/useDataQuery";

// type RHFAutocompleteProps<T extends FieldValues, Option> = {
//   name?: Path<T>; // Make name optional
//   apiEndPoint: string;
//   getOptionLabel: (option: Option) => string;
//   getOptionValue: (option: Option) => string;
//   helperText?: string;
//   sx?: SxProps<Theme>;
//   onSelected?: (option: Option | null) => void;
//   onChange?: (value: string) => void; // Add onChange prop for non-RHF usage
//   value?: string; // Add value prop for non-RHF usage
//   initialDisplayValue?: string;
//   label?: string;
//   isOptionEqualToValue?: (option: Option, value: Option) => boolean;
//   renderOption?: (
//     props: React.HTMLAttributes<HTMLLIElement> & { key?: string },
//     option: Option
//   ) => React.ReactNode;
//   enabled?: boolean;
// };

// export function RHFAutocomplete<T extends FieldValues, Option>({
//   name,
//   apiEndPoint,
//   getOptionLabel,
//   getOptionValue,
//   helperText,
//   sx,
//   onSelected,
//   onChange, // New prop for non-RHF usage
//   value, // New prop for non-RHF usage
//   initialDisplayValue,
//   label = "Select",
//   isOptionEqualToValue = (option, value) =>
//     getOptionValue(option) === getOptionValue(value),
//   renderOption = (props, option) => {
//     const { key, ...rest } = props;
//     return (
//       <Box component="li" key={key} {...rest}>
//         {getOptionLabel(option)}
//       </Box>
//     );
//   },
//   enabled = true,
// }: RHFAutocompleteProps<T, Option>) {
//   // Check if we're inside a form context
//   let formContext;
//   try {
//     formContext = useFormContext();
//   } catch {
//     formContext = null;
//   }

//   const isInsideForm = !!formContext && !!name;

//   const [open, setOpen] = useState(false);
//   const [allOptions, setAllOptions] = useState<Option[]>([]);
//   const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
//   const [inputValue, setInputValue] = useState("");
//   const [initialized, setInitialized] = useState(false);

//   // Use your useDataQuery hook with the provided endpoint
//   const { data, isLoading, isError, refetch } = useDataQuery<any>({
//     apiEndPoint,
//     enabled: enabled && open, // Only fetch when dropdown is open for performance
//   });

//   // Extract data from the response based on your API structure
//   const optionsData = useMemo(() => {
//     if (!data) return [];

//     // Handle different possible response structures
//     if (Array.isArray(data)) {
//       return data;
//     } else if (data?.data && Array.isArray(data.data)) {
//       return data.data;
//     } else if (data?.content && Array.isArray(data.content)) {
//       return data.content;
//     } else if (data?.items && Array.isArray(data.items)) {
//       return data.items;
//     } else if (data?.result && Array.isArray(data.result)) {
//       return data.result;
//     }

//     console.warn('Unexpected data structure from API:', data);
//     return [];
//   }, [data]);

//   // Get initial value based on whether we're inside form or not
//   const initialValue = useMemo(() => {
//     if (isInsideForm && formContext) {
//       return formContext.control._formValues[name!];
//     }
//     return value || "";
//   }, [isInsideForm, formContext, name, value]);

//   useEffect(() => {
//     if (optionsData && Array.isArray(optionsData)) {
//       setAllOptions(optionsData);
//       setFilteredOptions(optionsData);

//       if (initialValue && !initialDisplayValue) {
//         const foundOption = optionsData.find(
//           (option: Option) => getOptionValue(option) === initialValue
//         );
//         if (foundOption) {
//           setInputValue(getOptionLabel(foundOption));
//         }
//       }

//       setInitialized(true);
//     }
//   }, [
//     optionsData,
//     initialValue,
//     initialDisplayValue,
//     getOptionValue,
//     getOptionLabel,
//   ]);

//   useEffect(() => {
//     if (inputValue.trim() === "") {
//       setFilteredOptions(allOptions);
//     } else {
//       const searchTerm = inputValue.toLowerCase();
//       const filtered = allOptions.filter((option) =>
//         getOptionLabel(option).toLowerCase().includes(searchTerm)
//       );
//       setFilteredOptions(filtered);
//     }
//   }, [inputValue, allOptions, getOptionLabel]);

//   const currentSelectedValue: Option | null = useMemo(() => {
//     if (!initialized) return null;

//     if (!initialValue) return null;

//     const foundOption = allOptions.find(
//       (option) => getOptionValue(option) === initialValue
//     );

//     if (foundOption) return foundOption;

//     if (initialDisplayValue) {
//       return {
//         [getOptionValue({} as Option)]: initialValue,
//         [getOptionLabel({} as Option)]: initialDisplayValue,
//       } as unknown as Option;
//     }

//     return null;
//   }, [
//     initialValue,
//     allOptions,
//     initialDisplayValue,
//     getOptionValue,
//     initialized,
//   ]);

//   const handleChange = (newValue: Option | null) => {
//     const newValueId = newValue ? getOptionValue(newValue) : "";

//     if (isInsideForm && formContext) {
//       // Use form context if available
//       formContext.setValue(name!, newValueId, { shouldValidate: true });
//     } else if (onChange) {
//       // Use onChange prop if provided
//       onChange(newValueId);
//     }

//     if (onSelected) {
//       onSelected(newValue);
//     }
//   };

//   // If we're inside a form context and have a name, use Controller
//   if (isInsideForm && formContext) {
//     return (
//       <Controller
//         name={name!}
//         control={formContext.control}
//         render={({
//           field: { value: controllerValue, ref },
//           fieldState: { error },
//         }) => {
//           const controllerSelectedValue: Option | null = useMemo(() => {
//             if (!initialized) return null;

//             if (!controllerValue) return null;

//             const foundOption = allOptions.find(
//               (option) => getOptionValue(option) === controllerValue
//             );

//             if (foundOption) return foundOption;

//             if (initialDisplayValue) {
//               return {
//                 [getOptionValue({} as Option)]: controllerValue,
//                 [getOptionLabel({} as Option)]: initialDisplayValue,
//               } as unknown as Option;
//             }

//             return null;
//           }, [
//             controllerValue,
//             allOptions,
//             initialDisplayValue,
//             getOptionValue,
//             initialized,
//           ]);

//           return (
//             <Autocomplete
//               open={open}
//               onOpen={() => {
//                 setOpen(true);
//                 if (allOptions.length === 0) {
//                   refetch();
//                 }
//               }}
//               onClose={() => setOpen(false)}
//               loading={isLoading}
//               options={filteredOptions}
//               getOptionLabel={getOptionLabel}
//               isOptionEqualToValue={isOptionEqualToValue}
//               onInputChange={(event: SyntheticEvent, newInputValue: string) => {
//                 setInputValue(newInputValue);
//               }}
//               onChange={(_, newValue) => handleChange(newValue)}
//               value={controllerSelectedValue}
//               multiple={false}
//               inputValue={inputValue}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   fullWidth
//                   inputRef={ref}
//                   error={!!error}
//                   helperText={error?.message || helperText}
//                   label={label}
//                   sx={sx}
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {isLoading ? (
//                           <CircularProgress color="inherit" size={20} />
//                         ) : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//               renderOption={renderOption}
//               filterOptions={(options) => options}
//             />
//           );
//         }}
//       />
//     );
//   }

//   // If we're not inside a form context, use regular Autocomplete
//   return (
//     <Autocomplete
//       open={open}
//       onOpen={() => {
//         setOpen(true);
//         if (allOptions.length === 0) {
//           refetch();
//         }
//       }}
//       onClose={() => setOpen(false)}
//       loading={isLoading}
//       options={filteredOptions}
//       getOptionLabel={getOptionLabel}
//       isOptionEqualToValue={isOptionEqualToValue}
//       onInputChange={(event: SyntheticEvent, newInputValue: string) => {
//         setInputValue(newInputValue);
//       }}
//       onChange={(_, newValue) => handleChange(newValue)}
//       value={currentSelectedValue}
//       multiple={false}
//       inputValue={inputValue}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           fullWidth
//           error={false}
//           helperText={helperText}
//           label={label}
//           sx={sx}
//           InputProps={{
//             ...params.InputProps,
//             endAdornment: (
//               <>
//                 {isLoading ? (
//                   <CircularProgress color="inherit" size={20} />
//                 ) : null}
//                 {params.InputProps.endAdornment}
//               </>
//             ),
//           }}
//         />
//       )}
//       renderOption={renderOption}
//       filterOptions={(options) => options}
//     />
//   );
// }