import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
  DialogTitle,
  LinearProgress,
  IconButton,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { useForm, Controller, DefaultValues, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  mapZodSchemaToFormFields,
  SchemaToFormFieldMapper,
  FormSectionConfig,
  NestedSchemaHooks,
} from "./schema-to-form-field-mapper";
import AlertTitle from "@mui/material/AlertTitle";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { ExpandMore } from "@mui/icons-material";

type RTKMutationResult<T> = Promise<T> & { unwrap: () => Promise<T> };

interface ReusableFormModalProps<T extends z.ZodObject<any, any, any>> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  schema: T;
  defaultValues?: z.infer<T>;
  createMutationHook?: () => [
    (data: z.infer<T>) => RTKMutationResult<any>,
    { isLoading: boolean; error: any }
  ];
  updateMutationHook?: () => [
    (data: z.infer<T>) => RTKMutationResult<any>,
    { isLoading: boolean; error: any }
  ];
  onSuccess?: (data: z.infer<T>) => void;
  externalSchemaHooks?: NestedSchemaHooks;
}

const SYSTEM_INFO_SECTION = "System Information";

const dummyMutation = <T,>(data?: T): RTKMutationResult<any> => {
  const promise = Promise.resolve(data) as RTKMutationResult<any>;
  promise.unwrap = () => Promise.resolve(data);
  return promise;
};

// New component for rendering validation errors
const ValidationErrors = ({
  errorsBySection,
  onDismiss,
}: {
  errorsBySection: Record<
    string,
    {
      fieldName: string;
      message: string;
    }[]
  >;
  onDismiss: () => void;
}) => {
  const hasErrors = Object.keys(errorsBySection).length > 0;

  if (!hasErrors) {
    return null;
  }

  const allErrors = Object.values(errorsBySection).flat();
  const errorCount = allErrors.length;
  const message = `Please fix the following ${errorCount} error${
    errorCount === 1 ? "" : "s"
  }.`;

  return (
    <Alert
      severity="error"
      onClose={onDismiss}
      icon={false}
      sx={{
        p: 0,
        "& .MuiAlert-message": {
          width: "100%",
          p: 0,
        },
      }}
    >
      <Accordion
        sx={{
          width: "100%",
          boxShadow: "none",
          backgroundColor: "transparent",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            backgroundColor: "rgba(255, 0, 0, 0.05)",
            borderBottom: "1px solid rgba(255, 0, 0, 0.2)",
            "& .MuiAccordionSummary-content": {
              m: 0,
              py: 1,
            },
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              color: "error.dark",
              py: 1,
            }}
          >
            {message}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            maxHeight: "150px",
            overflowY: "auto",
            pt: 2,
            pl: 3,
            backgroundColor: "rgba(255, 0, 0, 0.02)",
          }}
        >
          {Object.entries(errorsBySection).map(([sectionTitle, messages]) => (
            <Box
              key={sectionTitle}
              sx={{
                mb: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: "error.main",
                  mb: 1,
                }}
              >
                {sectionTitle}:
              </Typography>
              <Box
                component="p"
                sx={{
                  m: 0,
                  pl: 2,
                }}
              >
                {messages.map((msg) => (
                  <Typography
                    key={msg.fieldName}
                    variant="body2"
                    component="span"
                    sx={{
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    • <strong>{msg.fieldName}:</strong> {msg.message}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>
    </Alert>
  );
};
export function ReusableFormModal<T extends z.ZodObject<any, any, any>>({
  isOpen,
  onClose,
  title,
  schema,
  defaultValues,
  createMutationHook,
  updateMutationHook,
  onSuccess,
  externalSchemaHooks,
}: ReusableFormModalProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
      ? (defaultValues as DefaultValues<z.infer<T>>)
      : ({} as DefaultValues<z.infer<T>>),
    mode: "onChange",
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = form;

  const theme = useTheme();

  const [generalMessage, setGeneralMessage] = useState<{
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);

  const [validationErrorsData, setValidationErrorsData] = useState<Record<
    string,
    { fieldName: string; message: string }[]
  > | null>(null);

  const [activeTab, setActiveTab] = useState(0);

  const [createMutate, { isLoading: isCreating }] = createMutationHook
    ? createMutationHook()
    : [dummyMutation, { isLoading: false }];
  const [updateMutate, { isLoading: isUpdating }] = updateMutationHook
    ? updateMutationHook()
    : [dummyMutation, { isLoading: false }];

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    reset(defaultValues ? defaultValues : {});
    setGeneralMessage(null);
    setValidationErrorsData(null);
    form.clearErrors();
    setActiveTab(0);
  }, [defaultValues, form, isOpen, reset]);

  const formSections: FormSectionConfig[] = useMemo(
    () => mapZodSchemaToFormFields(schema, externalSchemaHooks),
    [schema, externalSchemaHooks]
  );

  const fieldToSectionMap = useMemo(() => {
    const map = new Map<string, string>();
    formSections.forEach((section) => {
      section.fields.forEach((field) => {
        map.set(field.name, section.title || "General");
      });
    });
    return map;
  }, [formSections]);

  const generateValidationAlert = useCallback(
    (formErrors: typeof errors) => {
      const errorMessagesBySection = Object.keys(formErrors).reduce(
        (acc, key) => {
          const error = formErrors[key as Path<z.infer<T>>];
          if (error) {
            const sectionTitle = fieldToSectionMap.get(key) || "General";
            if (!acc[sectionTitle]) {
              acc[sectionTitle] = [];
            }
            acc[sectionTitle].push({ fieldName: key, message: error.message });
          }
          return acc;
        },
        {} as Record<string, { fieldName: string; message: string }[]>
      );

      if (Object.keys(errorMessagesBySection).length === 0) {
        return null;
      }
      return errorMessagesBySection;
    },
    [fieldToSectionMap]
  );

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setValidationErrorsData(generateValidationAlert(errors));
    } else {
      setValidationErrorsData(null);
    }
  }, [errors, generateValidationAlert]);

  const onSubmit = useCallback(
    async (data: z.infer<T>) => {
      setGeneralMessage(null);

      // No need to check for errors here, as useEffect handles it

      try {
        const payload: Record<string, any> = { ...data };
        Object.keys(payload).forEach((key) => {
          if (payload[key] === undefined) payload[key] = null;
        });

        let result;
        if (defaultValues && updateMutationHook) {
          // Check for defaultValues and remove id from the payload.
          const updatePayload = { ...payload };
          const id = updatePayload.id;
          delete updatePayload.id;

          // Ensure id exists before attempting to update.
          if (!id) {
            throw new Error("ID not found for update operation.");
          }

          // Correctly send the id and the data object
          result = await updateMutate({ id, data: updatePayload }).unwrap();

          setGeneralMessage({
            message: "Saved successfully",
            severity: "success",
          });
        } else if (createMutationHook) {
          result = await createMutate(payload).unwrap();
          setGeneralMessage({
            message: "Created successfully",
            severity: "success",
          });
        } else {
          throw new Error("No mutation hook provided.");
        }
      } catch (err: any) {
        setGeneralMessage({
          message: err?.data?.message || err.message || "Failed to save.",
          severity: "error",
        });
      }
    },
    [
      createMutationHook,
      defaultValues,
      updateMutationHook,
      createMutate,
      updateMutate,
    ]
  );

  const isVisibleField = useCallback(
    (fieldConfig: any) => !(fieldConfig.name === "id" && !defaultValues),
    [defaultValues]
  );

  const allTitlesAreEmpty = useMemo(
    () =>
      formSections.every(
        (section) => !section.title || section.title === "general"
      ),
    [formSections]
  );

  const simpleSections = useMemo(
    () =>
      formSections.filter((section) => {
        const visibleFields = section.fields.filter(isVisibleField);
        return (
          (!section.title || section.title === "general") &&
          visibleFields.length > 0
        );
      }),
    [formSections, isVisibleField]
  );

  const detailedSections = useMemo(
    () =>
      formSections.filter((section) => {
        const visibleFields = section.fields.filter(isVisibleField);
        return (
          section.title &&
          section.title !== "general" &&
          section.title !== SYSTEM_INFO_SECTION &&
          visibleFields.length > 0
        );
      }),
    [formSections, isVisibleField]
  );

  const sectionsForTabs = useMemo(() => {
    let sections = [];
    if (simpleSections.length > 0) {
      sections.push({
        title: "General",
        fields: simpleSections.flatMap((s) => s.fields),
      });
    }
    sections = sections.concat(detailedSections);
    return sections;
  }, [simpleSections, detailedSections]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ "& .MuiDialog-paper": { borderRadius: 3, boxShadow: 6 } }}
    >
      {isLoading && (
        <LinearProgress
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
          }}
        />
      )}
      <DialogTitle
        sx={{
          pb: generalMessage || validationErrorsData ? 1 : 2,
          pt: 2,
          px: 3,
          borderBottom:
            generalMessage || validationErrorsData
              ? "none"
              : `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          zIndex: 1,
        }}
      >
        {generalMessage ? (
          <Alert severity={generalMessage.severity} sx={{ borderRadius: 2 }}>
            {generalMessage.message}
          </Alert>
        ) : validationErrorsData ? (
          <ValidationErrors
            errorsBySection={validationErrorsData}
            onDismiss={() => setValidationErrorsData(null)}
          />
        ) : (
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
        <Box
          component="form"
          id={`form-${title.replace(/\s/g, "-")}`}
          onSubmit={(e) => {
            e.stopPropagation();
            handleSubmit(onSubmit)(e);
          }}
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {allTitlesAreEmpty ? (
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                height: "400px",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                p: 2,
                m: 2,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 1.5,
                backgroundColor: theme.palette.background.default,
              }}
            >
              {formSections
                .flatMap((section) => section.fields.filter(isVisibleField))
                .map((fieldConfig) => (
                  <Controller
                    key={fieldConfig.name}
                    name={fieldConfig.name as Path<z.infer<T>>}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <SchemaToFormFieldMapper
                        field={field}
                        control={control}
                        {...fieldConfig}
                        error={!!error}
                        helperText={error?.message || fieldConfig.description}
                      />
                    )}
                  />
                ))}
            </Box>
          ) : (
            <>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="form sections tabs"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTabs-indicator": {
                    backgroundColor: theme.palette.primary.main,
                    height: 3,
                    borderRadius: "3px 3px 0 0",
                  },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: theme.typography.fontWeightMedium,
                    color: theme.palette.text.secondary,
                    minHeight: "48px",
                    px: 2,
                    "&.Mui-selected": {
                      color: theme.palette.primary.main,
                      fontWeight: theme.typography.fontWeightBold,
                    },
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  },
                }}
              >
                {sectionsForTabs.map((section, index) => (
                  <Tab key={index} label={section.title} />
                ))}
              </Tabs>
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  height: "400px",
                  p: 3,
                  backgroundColor: theme.palette.background.default,
                }}
              >
                {sectionsForTabs.map((section, index) => (
                  <Box
                    key={index}
                    role="tabpanel"
                    hidden={activeTab !== index}
                    id={`tabpanel-${index}`}
                    aria-labelledby={`tab-${index}`}
                  >
                    {activeTab === index && (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(200px, 1fr))",
                          gap: 2,
                          p: 1,
                        }}
                      >
                        {section.fields
                          .filter(isVisibleField)
                          .map((fieldConfig) => (
                            <Controller
                              key={fieldConfig.name}
                              name={fieldConfig.name as Path<z.infer<T>>}
                              control={control}
                              render={({ field, fieldState: { error } }) => (
                                <SchemaToFormFieldMapper
                                  field={field}
                                  control={control}
                                  {...fieldConfig}
                                  error={!!error}
                                  helperText={
                                    error?.message || fieldConfig.description
                                  }
                                />
                              )}
                            />
                          ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              zIndex: 1,
            }}
          >
            <Button
              onClick={onClose}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={isLoading}
              onClick={(e) => e.stopPropagation()}
              form={`form-${title.replace(/\s/g, "-")}`}
              sx={{ borderRadius: 2 }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : defaultValues ? (
                "Save"
              ) : (
                "Create"
              )}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
