import { useState, useRef, forwardRef, useMemo, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Stack,
  Alert,
  useTheme,
  Popover,
  Typography,
  Badge,
  Box,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import MinimizeIcon from "@mui/icons-material/Minimize";
import { ZodObject, type ZodRawShape, z } from "zod";
import { FormRenderer } from "./form-renderer";
import { useDataMutation } from "@/lib/tanstack/useDataQuery";
import { generateSchemaFromQuestions } from "@/components/question-generator/generate-schema-from-questions";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

type FormMode = "create" | "edit";

interface ReusableFormModalProps<T extends ZodRawShape> {
  schema: ZodObject<T>;
  title: string;
  formMode: FormMode;
  defaultValues?: Partial<any>;
  sections?: string[];
  open: boolean;
  onClose: () => void;
  disabledValues?: any;
}

export function ReusableFormModal<T extends ZodRawShape>({
  schema,
  title,
  formMode,
  defaultValues,
  sections = ["General"],
  open,
  onClose,
  disabledValues,
}: ReusableFormModalProps<T>) {
  return (
    <>
      {open && (
        <FormContent
          schema={schema}
          title={title}
          formMode={formMode}
          defaultValues={defaultValues}
          sections={sections}
          onClose={onClose}
          disabledValues={disabledValues}
        />
      )}
    </>
  );
}

interface FormContentProps<T extends ZodRawShape>
  extends Omit<ReusableFormModalProps<T>, "children" | "open"> { }

const FormContent = forwardRef(
  <T extends ZodRawShape>(
    {
      schema,
      title,
      formMode,
      defaultValues,
      sections,
      onClose,
      disabledValues,
    }: FormContentProps<T>,
    ref: React.Ref<any>
  ) => {
    const theme = useTheme();
    const [errorPopoverOpen, setErrorPopoverOpen] = useState(false);
    const errorButtonRef = useRef<HTMLButtonElement>(null);

    // Add modal state management
    const [modalState, setModalState] = useState<'normal' | 'extended' | 'minimized'>('normal');

    // Toggle functions
    const handleExtend = () => {
      setModalState('extended');
    };

    // const handleMinimize = () => {
    //   setModalState('minimized');
    // };

    const handleRestore = () => {
      setModalState('normal');
    };

    // Ref to store original IDs for comparison in update mode (for connect/disconnect logic)
    const originalConnectIdsRef = useRef<Record<string, string[]>>({});

    const additionalQuestions = useSelector(
      (state: RootState) => state.questions.questions
    );

    const combinedSchema = useMemo(() => {
      const questionSchema = generateSchemaFromQuestions(additionalQuestions);
      return schema.merge(questionSchema);
    }, [schema, additionalQuestions]);

    const schemaMeta: any =
      typeof schema.meta === "function" ? schema.meta() : schema.meta || {};
    const mergePoint = schemaMeta.mergePoint;

    // A helper function to transform API data to the form's expected structure
    const transformApiDataToForm = (data: any, schema: ZodObject<any>) => {
      if (!data) return {};
      const transformed: any = { ...data };

      for (const key in schema.shape) {
        if (Object.prototype.hasOwnProperty.call(schema.shape, key)) {
          const fieldSchema: any = schema.shape[key];
          const meta =
            typeof fieldSchema?.meta === "function"
              ? fieldSchema.meta()
              : fieldSchema?.meta;

          // Check if it is a relational field that needs the { connect: ... } structure
          if (
            meta?.formRelated?.inputType === "object" &&
            Array.isArray(transformed[key])
          ) {
            const apiArray = transformed[key];
            let connectArray: string[] = [];

            if (apiArray.length > 0) {
              if (
                typeof apiArray[0] === "object" &&
                apiArray[0] !== null &&
                apiArray[0].id
              ) {
                // Map complex objects (like subjects: [{ id: '...', employee: {...} }]) to simple ID strings
                connectArray = apiArray.map((item: any) => item.id);
              }
              // Otherwise, assume it's already an array of strings (ID's)
              else if (typeof apiArray[0] === "string") {
                connectArray = apiArray;
              }
            }

            // Store the original IDs for comparison later (only when defaultValues are present)
            if (formMode === "edit" && defaultValues) {
              originalConnectIdsRef.current[key] = connectArray;
            }

            // Set the transformed value to { connect: [IDs] } for useForm
            transformed[key] = { connect: connectArray };
          }
        }
      }

      return transformed;
    };

    const transformedDefaultValues = useMemo(() => {
      let transformed = defaultValues ? { ...defaultValues } : {};

      // Apply the generic transformation based on the schema
      // This call also populates originalConnectIdsRef
      transformed = transformApiDataToForm(transformed, schema);

      if (mergePoint && transformed[mergePoint]) {
        return {
          ...transformed,
          ...transformed[mergePoint],
        };
      }
      return transformed;
    }, [defaultValues, mergePoint, schema, formMode]);

    const methods = useForm<any>({
      resolver: zodResolver(combinedSchema),
      defaultValues: transformedDefaultValues,
      mode: "onSubmit",
    });

    useEffect(() => {
      const formFields = Object.keys(methods.getValues());

      formFields.forEach((fieldName) => {
        const isDynamicQuestion = fieldName.startsWith("question_");
        if (isDynamicQuestion) {
          methods.setValue(fieldName, undefined);
        }
      });
    }, [additionalQuestions, methods]);

    const { mutate, isPending, isSuccess, isError, error } = useDataMutation({
      apiEndPoint:
        formMode === "edit" && defaultValues?.id
          ? `${schemaMeta.apiEndPoint}/${defaultValues.id}`
          : schemaMeta.apiEndPoint,
      method: formMode === "edit" ? "PATCH" : "POST",
      invalidateQueryKey: ["data", schemaMeta.apiEndPoint],
    });

    const removeNulls = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj
          .map(removeNulls)
          .filter((v) => v !== null && v !== undefined);
      } else if (obj && typeof obj === "object") {
        if (obj instanceof Date) return obj.toISOString();
        return Object.fromEntries(
          Object.entries(obj)
            .filter(([_, v]) => v !== null && v !== undefined)
            .map(([k, v]) => [k, removeNulls(v)])
            .filter(
              ([_, v]) =>
                v !== null &&
                v !== undefined &&
                (typeof v !== "object" || Object.keys(v).length > 0)
            )
        );
      }
      return obj;
    };

    // Helper function to transform the payload for the backend using connect/disconnect
    const transformPayloadForBackend = (
      data: any,
      schema: ZodObject<any>,
      originalIds: Record<string, string[]>
    ): any => {
      const transformedData: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          const fieldSchema: any = schema.shape[key];
          const meta =
            typeof fieldSchema?.meta === "function"
              ? fieldSchema.meta()
              : fieldSchema?.meta;

          // Check if the field is a relational object with a 'connect' array
          if (
            meta?.formRelated?.inputType === "object" &&
            value &&
            value.connect &&
            Array.isArray(value.connect)
          ) {
            const submittedIds: string[] = value.connect;
            const originalIdsList: string[] = originalIds[key] || [];

            // Find IDs to connect (New IDs: Submitted but not Original)
            const toConnect = submittedIds.filter(
              (id) => !originalIdsList.includes(id)
            );

            // Find IDs to disconnect (Removed IDs: Original but not Submitted)
            const toDisconnect = originalIdsList.filter(
              (id) => !submittedIds.includes(id)
            );

            // Only include the field in the payload if a change occurred
            if (toConnect.length > 0 || toDisconnect.length > 0) {
              transformedData[key] = {};

              if (toConnect.length > 0) {
                // Format for Prisma connect: { id: "..." }
                transformedData[key].connect = toConnect.map((id) => ({
                  id: id,
                }));
              }

              if (toDisconnect.length > 0) {
                // Format for Prisma disconnect: { id: "..." }
                transformedData[key].disconnect = toDisconnect.map((id) => ({
                  id: id,
                }));
              }
            }
            // If no changes, the field is omitted (no action is sent to the backend)
          } else {
            transformedData[key] = value;
          }
        }
      }
      return transformedData;
    };

    const onSubmit = methods.handleSubmit((data: any) => {
      console.log("Form Data Before Transformation:", JSON.stringify(data));

      let filteredData = removeNulls(data);
      delete filteredData.conditionalItem;
      delete filteredData.conditionalOperator;
      delete filteredData.conditionalValue;
      if (filteredData.id) {
        delete filteredData.createdAt;
        delete filteredData.updatedAt;
      }

      const payload: Record<string, any> = {};
      const mergedObject: Record<string, any> = {};

      if (mergePoint) {
        additionalQuestions.forEach((q, index) => {
          const fieldId = q.id || `question_${index}`;
          if (filteredData.hasOwnProperty(fieldId)) {
            mergedObject[fieldId] = filteredData[fieldId];
            delete filteredData[fieldId];
          }
        });
        payload[mergePoint] = {
          ...(filteredData[mergePoint] || {}),
          ...mergedObject,
        };
        delete filteredData[mergePoint];
      }

      const finalPayload = { ...filteredData, ...payload };

      // Transform the final payload for the backend, passing the original IDs
      const transformedFinalPayload = transformPayloadForBackend(
        finalPayload,
        combinedSchema,
        originalConnectIdsRef.current
      );

      console.log(
        "Payload sent to backend----------------",
        JSON.stringify(transformedFinalPayload),
        "form-ref---",
        ref
      );

      mutate(transformedFinalPayload, {
        onSuccess: () => {
          setTimeout(() => {
            onClose();
          }, 2000);
        },
      });
    });

    const errors = methods.formState.errors;
    console.log("Form Errors:", JSON.stringify(errors));

    const flattenErrors = (obj: any, path: string = "", result: any[] = []) => {
      if (!obj) return result;
      Object.keys(obj).forEach((key) => {
        const currentPath = path ? `${path}.${key}` : key;
        const value = obj[key];
        if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value) &&
          value.message
        ) {
          result.push({ path: currentPath, message: value.message });
        } else if (value && typeof value === "object") {
          flattenErrors(value, currentPath, result);
        }
      });
      return result;
    };

    const flattenedErrors = useMemo(() => {
      const flatErrors: { path: string; message: string }[] = [];
      const traverseErrors = (obj: any, path: string = "") => {
        if (!obj) return;

        Object.keys(obj).forEach((key) => {
          const currentPath = path ? `${path}.${key}` : key;
          const value = obj[key];

          const topLevelField = currentPath.split(".")[0];
          const zodField: any = combinedSchema.shape[topLevelField as keyof T];
          const meta =
            typeof zodField?.meta === "function"
              ? zodField.meta()
              : zodField?.meta;

          const metaMessage = meta?.formRelated?.validationErrorMessage;

          if (
            value &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            value.message
          ) {
            flatErrors.push({
              path: currentPath,
              message: metaMessage || value.message,
            });
          } else if (value && typeof value === "object") {
            traverseErrors(value, currentPath);
          }
        });
      };

      traverseErrors(errors);
      return flatErrors;
    }, [errors, combinedSchema]);

    const errorGroups = useMemo(() => {
      return flattenedErrors.reduce<
        Record<string, { path: string; message: string }[]>
      >((acc, { path, message }) => {
        const fieldName = path.split(".")[0];
        const zodField: any = combinedSchema.shape[fieldName as keyof T];
        const meta =
          typeof zodField?.meta === "function"
            ? zodField.meta()
            : zodField?.meta;

        let section = meta?.formRelated?.section ?? "General";
        const isQuestionField = additionalQuestions.some(
          (q: any) => q.id === fieldName
        );

        if (isQuestionField) {
          section = "Questions";
        } else if (section === "no-section") {
          section = "General";
        }

        if (!acc[section]) {
          acc[section] = [];
        }
        acc[section].push({ path, message });
        return acc;
      }, {});
    }, [flattenedErrors, combinedSchema, additionalQuestions]);

    const errorCount = flattenedErrors.length;
    const hasErrors = errorCount > 0;

    const handleErrorButtonClick = () => setErrorPopoverOpen(!errorPopoverOpen);

    // Determine dialog props based on modal state
    const getDialogProps = () => {
      switch (modalState) {
        case 'extended':
          return {
            fullScreen: true,
            maxWidth: false,
          };
        case 'minimized':
          return {
            fullWidth: true,
            maxWidth: 'sm',
            sx: {
              '& .MuiDialog-paper': {
                position: 'fixed',
                bottom: 16,
                right: 16,
                width: 400,
                maxHeight: 200,
                margin: 0,
              }
            }
          };
        default:
          return {
            fullWidth: true,
            maxWidth: 'md',
          };
      }
    };

    const dialogProps = getDialogProps();

    return (
      <Dialog
        open
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();
            onSubmit();
          }
        }}
        onClose={onClose}
        {...dialogProps}
        slotProps={{
          paper: {
            sx: {
              borderRadius: modalState === 'minimized' ? 2 : 2,
              overflow: "hidden",
              backgroundColor: theme.palette.background.paper,
              transition: 'all 0.3s ease',
              ...(modalState === 'minimized' && {
                position: 'fixed',
                bottom: 16,
                right: 16,
                width: 400,
                maxHeight: 200,
                margin: 0,
              }),
              ...(modalState === 'extended' && {
                height: '100vh',
                maxHeight: '100vh',
              }),
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: modalState === 'minimized' ? 1 : 2,
            flexShrink: 0, // Prevent title from shrinking
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant={modalState === 'minimized' ? "subtitle1" : "h6"}
              noWrap
            >
              {title}
            </Typography>
            {hasErrors && modalState !== 'minimized' && (
              <IconButton
                ref={errorButtonRef}
                onClick={handleErrorButtonClick}
                size="small"
                sx={{
                  color: theme.palette.error.main,
                  "&:focus": { outline: "none", borderRadius: 0 },
                }}
              >
                <Badge badgeContent={errorCount} color="error">
                  <ErrorIcon />
                </Badge>
              </IconButton>
            )}
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.5}>
            {/* Extend/Minimize buttons */}
            {modalState === 'normal' && (
              <IconButton
                onClick={handleExtend}
                size="small"
                title="Extend"
              >
                <FullscreenIcon />
              </IconButton>
            )}

            {modalState === 'extended' && (
              <IconButton
                onClick={handleRestore}
                size="small"
                title="Restore"
              >
                <FullscreenExitIcon />
              </IconButton>
            )}

            {/* {modalState === 'normal' && (
              <IconButton
                onClick={handleMinimize}
                size="small"
                title="Minimize"
              >
                <MinimizeIcon />
              </IconButton>
            )} */}

            {modalState === 'minimized' && (
              <IconButton
                onClick={handleRestore}
                size="small"
                title="Restore"
              >
                <FullscreenIcon />
              </IconButton>
            )}

            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        {/* Only show content if not minimized */}
        {modalState !== 'minimized' && (
          <>
            <Popover
              open={errorPopoverOpen}
              anchorEl={errorButtonRef.current}
              onClose={() => setErrorPopoverOpen(false)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              sx={{
                "& .MuiPaper-root": {
                  maxWidth: 600,
                  maxHeight: 400,
                  overflow: "auto",
                  p: 2,
                },
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Form Errors ({errorCount})
              </Typography>
              <Stack spacing={2}>
                {Object.entries(errorGroups).map(([section, errors]) => (
                  <Box key={section}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {section}
                    </Typography>
                    {errors.map(({ path, message }, idx) => (
                      <Alert key={idx} severity="error" sx={{ mt: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {path}
                        </Typography>
                        <Typography variant="body2">{message}</Typography>
                      </Alert>
                    ))}
                  </Box>
                ))}
              </Stack>
            </Popover>

            {isPending && <LinearProgress sx={{ height: 8, flexShrink: 0 }} />}
            {isSuccess && <Alert severity="success" sx={{ flexShrink: 0 }}>Operation successful!</Alert>}
            {isError && <Alert severity="error" sx={{ flexShrink: 0 }}> {error?.toString()}</Alert>}

            <DialogContent
              dividers
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                p: 3,
                ...(modalState === 'extended' && {
                  minHeight: 0, // Important for flex children to shrink properly
                }),
              }}
            >
              <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0, // Important for flex children to shrink properly
              }}>
                <FormProvider {...methods}>
                  <FormRenderer
                    sections={sections}
                    schema={combinedSchema}
                    values={methods.getValues()}
                    disabledValues={disabledValues}
                    onChange={(name, value) => {
                      methods.setValue(name as any, value);
                    }}
                    additionalQuestions={additionalQuestions}
                    formMethods={methods}
                    formMode={formMode}
                    isExtended={modalState === 'extended'}
                  />

                </FormProvider>

              </Box>

            </DialogContent>
            <DialogActions sx={{ flexShrink: 0 }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={onSubmit}
                loading={isPending}
              >
                {formMode === "create" ? "Create" : "Save Changes"}
              </Button>
            </DialogActions>
          </>
        )}

        {/* Show minimal content when minimized */}
        {modalState === 'minimized' && (
          <Box sx={{ p: 2, flexShrink: 0 }}>
            <Typography variant="body2" color="text.secondary">
              Form is minimized - {title}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button
                size="small"
                onClick={handleRestore}
                variant="outlined"
              >
                Restore
              </Button>
              <Button
                size="small"
                onClick={onSubmit}
                loading={isPending}
                variant="contained"
              >
                Submit
              </Button>
            </Stack>
          </Box>
        )}
      </Dialog>
    );
  }
);