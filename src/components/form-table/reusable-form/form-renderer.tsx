import { Fragment, useState } from "react";
import { ZodObject, type ZodRawShape } from "zod";
import { FormFieldMapper } from "./form-field-mapper";
import { Tabs, Box, Tooltip, useTheme, alpha } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { ElegantTab, SectionPanel } from "./section-panel";
import { mapSchemaToSections } from "./mapper-functions";
import { FormGenerator } from "@/components/question-generator/form-generator";

type FormRendererProps<T extends ZodRawShape> = {
  schema: ZodObject<T>;
  values?: Record<string, any>;
  onChange?: (name: string, value: any) => void;
  sections?: string[];
  disabledValues?: any;
  additionalQuestions?: { name: string; type: "text" | "number" | "boolean" }[];
  // Add these new props for custom components
  formMethods?: any; // react-hook-form methods
  formMode?: "create" | "edit";
  // Add prop to control extended mode
  isExtended?: boolean;
};

export function FormRenderer<T extends ZodRawShape>({
  schema,
  values = {},
  onChange,
  sections,
  disabledValues,
  additionalQuestions = [],
  formMethods,
  formMode = "create",
  isExtended = false, // Default to normal (compact) mode
}: FormRendererProps<T>) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const sectionMap = mapSchemaToSections(schema, values);

  const additionalSectionKey = "additional-questions";

  const sectionKeys =
    sections ?? Object.keys(sectionMap).filter((key) => key !== "no-section");

  if (additionalQuestions.length > 0) {
    if (!sectionKeys.includes(additionalSectionKey)) {
      sectionKeys.push(additionalSectionKey);
    }
  }

  const renderCustomField = (fieldName: string, fieldSchema: any, meta: any) => {
    const CustomComponent = meta.formRelated.customComponent;

    if (CustomComponent) {
      return (
        <CustomComponent
          methods={formMethods}
          formMode={formMode}
          defaultValues={values}
          isExtended={isExtended}
        />
      );
    }

    return null;
  };

  const renderAdditionalQuestions = () => {
    return <FormGenerator questions={additionalQuestions} />;
  };

  // Extended mode layout (first version you provided)
  if (isExtended) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        {sectionKeys.length > 1 && (
          <Box
            sx={{
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              flexShrink: 0,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
            >
              {sectionKeys.map((section) => (
                <ElegantTab
                  key={section}
                  label={
                    section === "no-section" ? (
                      <Tooltip title="Additional fields" arrow>
                        <MoreHorizIcon fontSize="small" />
                      </Tooltip>
                    ) : section === additionalSectionKey ? (
                      "Questions"
                    ) : (
                      section.charAt(0).toUpperCase() +
                      section.slice(1).replace(/-/g, " ")
                    )
                  }
                  disableRipple
                />
              ))}
            </Tabs>
          </Box>
        )}

        <Box sx={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          overflow: "hidden",
          display: 'flex',
          flexDirection: 'column'
        }}>
          {sectionKeys.map((section, index) =>
            index === activeTab ? (
              <SectionPanel key={section} active sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {section === additionalSectionKey ? (
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {renderAdditionalQuestions()}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      height: "100%",
                      overflow: "auto",
                      scrollbarWidth: "thin",
                      p: 2,
                      flex: 1,
                      minHeight: 0,
                    }}
                  >
                    {/* Separate custom components from regular fields */}
                    {sectionMap[section]?.map(({ name, zodField, meta }) => {
                      const value = values[name];

                      if (meta?.formRelated?.inputType === "custom") {
                        return (
                          <Fragment key={name}>
                            {renderCustomField(name, zodField, meta)}
                          </Fragment>
                        );
                      }

                      return null;
                    })}

                    {/* Regular fields in grid layout */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
                        gap: 2,
                        alignContent: "flex-start",
                        flex: 1,
                        minHeight: 0,
                      }}
                    >
                      {sectionMap[section]?.map(({ name, zodField, meta }) => {
                        const value = values[name];

                        if (meta?.formRelated?.inputType === "custom") {
                          return null;
                        }

                        return (
                          <Fragment key={name}>
                            <FormFieldMapper
                              name={name}
                              field={zodField}
                              disabledValues={disabledValues}
                              value={value}
                              onChange={(val) => onChange?.(name, val)}
                              meta={meta}
                            />
                          </Fragment>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </SectionPanel>
            ) : null
          )}
        </Box>
      </Box>
    );
  }

  // Normal mode layout (second version you provided - compact)
  return (
    <>
      {sectionKeys.length > 1 && (
        <Box
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            flexShrink: 0,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
          >
            {sectionKeys.map((section) => (
              <ElegantTab
                key={section}
                label={
                  section === "no-section" ? (
                    <Tooltip title="Additional fields" arrow>
                      <MoreHorizIcon fontSize="small" />
                    </Tooltip>
                  ) : section === additionalSectionKey ? (
                    "Questions"
                  ) : (
                    section.charAt(0).toUpperCase() +
                    section.slice(1).replace(/-/g, " ")
                  )
                }
                disableRipple
              />
            ))}
          </Tabs>
        </Box>
      )}

      <Box sx={{ minHeight: 300, position: "relative", overflow: "hidden" }}>
        {sectionKeys.map((section, index) =>
          index === activeTab ? (
            <SectionPanel key={section} active>
              {section === additionalSectionKey ? (
                renderAdditionalQuestions()
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    height: "100%",
                    overflow: "auto",
                    scrollbarWidth: "thin",
                    p: 2,
                  }}
                >
                  {/* Separate custom components from regular fields */}
                  {sectionMap[section]?.map(({ name, zodField, meta }) => {
                    const value = values[name];

                    if (meta?.formRelated?.inputType === "custom") {
                      return (
                        <Fragment key={name}>
                          {renderCustomField(name, zodField, meta)}
                        </Fragment>
                      );
                    }

                    return null;
                  })}

                  {/* Regular fields in grid layout */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
                      gap: 2,
                      alignContent: "flex-start",
                    }}
                  >
                    {sectionMap[section]?.map(({ name, zodField, meta }) => {
                      const value = values[name];

                      if (meta?.formRelated?.inputType === "custom") {
                        return null;
                      }

                      return (
                        <Fragment key={name}>
                          <FormFieldMapper
                            name={name}
                            field={zodField}
                            disabledValues={disabledValues}
                            value={value}
                            onChange={(val) => onChange?.(name, val)}
                            meta={meta}
                          />
                        </Fragment>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </SectionPanel>
          ) : null
        )}
      </Box>
    </>
  );
}