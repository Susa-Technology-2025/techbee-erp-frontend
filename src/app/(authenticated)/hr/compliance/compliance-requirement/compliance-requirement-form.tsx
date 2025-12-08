"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Autocomplete,
  Button,
  TextField as MuiTextField,
  Paper,
} from "@mui/material";
import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";

const ComplianceRequirementSchema = z.object({
  autoRemediate: z.boolean(),
  code: z.string().min(1, "Code is required"),
  compliance: z.object({ id: z.string().min(1, "Compliance ID is required") }),
  description: z.string().optional(),
  dueInDays: z
    .preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().optional()
    )
    .optional(),
  entityType: z.string().min(1, "Entity Type is required"),
  expectedValue: z.string().optional(),
  fieldKey: z.string().min(1, "Field Key is required"),
  name: z.string().min(1, "Name is required"),
  operator: z.string().min(1, "Operator is required"),
  severity: z.enum(["Low", "Medium", "High", "Critical"], {
    required_error: "Severity is required",
  }),
});

type ComplianceRequirementForm = z.infer<typeof ComplianceRequirementSchema>;

export default function ComplianceForm({
  initialData,
  formMode = "create",
}: {
  initialData?: any;
  formMode: "edit" | "create";
}) {
  const { data: metadata, isSuccess: isMetadataSuccess } = useDataQuery({
    apiEndPoint: "https://api.techbee.et/api/hr/compliances/metadata/hr",
    noFilter: true,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { data: compliancesData, isSuccess: isCompliancesSuccess } =
    useDataQuery({
      apiEndPoint: "https://api.techbee.et/api/hr/compliances",
      noFilter: true,
    });

  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [operators, setOperators] = useState<string[]>([]);
  const [compliances, setCompliances] = useState<
    { id: string; name: string }[]
  >([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ComplianceRequirementForm>({
    resolver: zodResolver(ComplianceRequirementSchema),
    defaultValues:
      formMode === "create"
        ? {
            autoRemediate: false,
            code: "",
            compliance: { id: "" },
            description: "",
            dueInDays: undefined,
            entityType: "",
            expectedValue: "",
            fieldKey: "",
            name: "",
            operator: "",
            severity: "Low",
          }
        : initialData,
  });
  console.log(errors);
  const selectedEntityType = watch("entityType");
  const selectedFieldKey = watch("fieldKey");
  const selectedOperator = watch("operator");
  const selectedComplianceId = watch("compliance.id");

  useEffect(() => {
    if (isMetadataSuccess) {
      const entities: string[] = metadata.entities.map(
        (entity: any) => entity.name
      );
      setEntityTypes(entities);
    }
  }, [isMetadataSuccess, metadata]);

  useEffect(() => {
    if (isCompliancesSuccess && compliancesData?.data) {
      setCompliances(compliancesData.data);
    }
  }, [isCompliancesSuccess, compliancesData]);

  useEffect(() => {
    const entity = metadata?.entities.find(
      (e: any) => e.name === selectedEntityType
    );
    setFields(entity?.fields || []);
    setValue("fieldKey", "");
    setValue("operator", "");
    setValue("expectedValue", "");
  }, [selectedEntityType, metadata, setValue]);

  useEffect(() => {
    const field = fields.find((f) => f.path === selectedFieldKey);
    setOperators(field?.operators || []);
    setValue("operator", "");
    setValue("expectedValue", "");
  }, [selectedFieldKey, fields, setValue]);

  // --- Mutator Updates ---

  const { mutate: createRequirement, isPending: isCreateLoading } =
    useDataMutation({
      method: "POST",
      apiEndPoint: "https://api.techbee.et/api/hr/complianceRequirements",
      onSuccess: (message) => {
        // Set a reasonable success message for creation
        setSuccessMessage(
          message?.message ?? "Compliance Requirement created successfully!"
        );
        setErrorMessage(""); // Clear any previous error
      },
      onError: (error) => {
        // Set a reasonable error message for creation
        setErrorMessage(
          error?.message ?? "Failed to create Compliance Requirement."
        );
        setSuccessMessage(""); // Clear any previous success
      },
    });

  const { mutate: updateRequirement, isPending: isUpdateLoading } =
    useDataMutation({
      method: "PATCH",
      apiEndPoint:
        "https://api.techbee.et/api/hr/complianceRequirements" +
        `/${initialData?.id}`,
      onSuccess: (message) => {
        // Set a reasonable success message for update
        setSuccessMessage(
          message?.message ?? "Compliance Requirement updated successfully!"
        );
        setErrorMessage(""); // Clear any previous error
      },
      onError: (error) => {
        // Set a reasonable error message for update
        setErrorMessage(
          error?.message ?? "Failed to update Compliance Requirement."
        );
        setSuccessMessage(""); // Clear any previous success
      },
    });

  // --- End Mutator Updates ---

  const onSubmit = (formData: ComplianceRequirementForm) => {
    // Clear messages before submission
    setErrorMessage("");
    setSuccessMessage("");

    if (formMode === "create") {
      createRequirement(formData);
    }
    if (formMode === "edit") {
      updateRequirement(formData);
    }
  };

  const showFieldKey = !!selectedEntityType;
  const showOperator = !!selectedFieldKey;
  const showExpectedValue = !!selectedOperator;

  return (
    <Paper className="max-w-6xl mx-auto py-4 px-3">
      <div className=" ">
        <div className="rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  Compliance Requirement
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Create and configure compliance rules
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* --- Success/Error Messages --- */}
          {successMessage && (
            <div
              className="mx-6 mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg"
              role="alert"
            >
              <span className="font-semibold">Success!</span> {successMessage}
            </div>
          )}

          {errorMessage && (
            <div
              className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg"
              role="alert"
            >
              <span className="font-semibold">Error:</span> {errorMessage}
            </div>
          )}
          {/* --- End Success/Error Messages --- */}

          {/* Form Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Auto Remediate */}
                <div className="lg:col-span-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Controller
                      name="autoRemediate"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <div>
                            <span className="text-sm font-medium text-slate-900">
                              Auto Remediate
                            </span>
                            <p className="text-xs text-slate-600 mt-1">
                              Automatically apply remediation actions when
                              violations are found
                            </p>
                          </div>
                        </label>
                      )}
                    />
                  </div>
                </div>

                {/* Compliance ID */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
                    Compliance *
                  </label>
                  <Controller
                    name="compliance.id"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        options={compliances}
                        value={
                          compliances.find((c) => c.id === field.value) || null
                        }
                        onChange={(_, value) => field.onChange(value?.id || "")}
                        getOptionLabel={(option) => option.name || ""}
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            variant="outlined"
                            size="small"
                            error={!!errors.compliance?.id}
                            helperText={errors.compliance?.id?.message}
                            placeholder="Select compliance"
                          />
                        )}
                        size="small"
                      />
                    )}
                  />
                  {!errors.compliance?.id && (
                    <p className="text-xs text-slate-500">
                      Select the compliance framework
                    </p>
                  )}
                </div>

                {/* Code */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
                    Code *
                  </label>
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-3 py-2 text-sm border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.code
                            ? "border-red-300 bg-red-50"
                            : "border-slate-300 bg-white"
                        }`}
                        placeholder="Enter code"
                      />
                    )}
                  />
                  {errors.code && (
                    <p className="text-xs text-red-600">
                      {errors.code.message}
                    </p>
                  )}
                  <p className="text-xs text-slate-500">
                    Unique identifier for this compliance rule
                  </p>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
                    Name *
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.name
                            ? "border-red-300 bg-red-50"
                            : "border-slate-300 bg-white"
                        }`}
                        placeholder="Enter rule name"
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                  <p className="text-xs text-slate-500">
                    Descriptive name of the compliance rule
                  </p>
                </div>

                {/* Entity Type */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
                    Entity Type *
                  </label>
                  <Controller
                    name="entityType"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        options={entityTypes}
                        value={field.value || ""}
                        onChange={(_, value) => field.onChange(value || "")}
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            variant="outlined"
                            size="small"
                            error={!!errors.entityType}
                            helperText={errors.entityType?.message}
                            placeholder="Select entity type"
                          />
                        )}
                        size="small"
                      />
                    )}
                  />
                  {!errors.entityType && (
                    <p className="text-xs text-slate-500">
                      Select which entity this applies to
                    </p>
                  )}
                </div>

                {/* Field Key - Conditionally Rendered */}
                {showFieldKey && (
                  <div className="space-y-1 animate-fadeIn">
                    <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
                      Field Key *
                    </label>
                    <Controller
                      name="fieldKey"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          options={fields.map((f) => f.path)}
                          value={field.value || ""}
                          onChange={(_, value) => field.onChange(value || "")}
                          getOptionLabel={(option) =>
                            fields.find((f) => f.path === option)?.label ||
                            option
                          }
                          renderInput={(params) => (
                            <MuiTextField
                              {...params}
                              variant="outlined"
                              size="small"
                              error={!!errors.fieldKey}
                              helperText={errors.fieldKey?.message}
                              placeholder="Select field key"
                            />
                          )}
                          size="small"
                        />
                      )}
                    />
                    {!errors.fieldKey && (
                      <p className="text-xs text-slate-500">
                        Select the field to check compliance on
                      </p>
                    )}
                  </div>
                )}

                {/* Operator - Conditionally Rendered */}
                {showOperator && (
                  <div className="space-y-1 animate-fadeIn">
                    <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
                      Operator *
                    </label>
                    <Controller
                      name="operator"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          options={operators}
                          value={field.value || ""}
                          onChange={(_, value) => field.onChange(value || "")}
                          renderInput={(params) => (
                            <MuiTextField
                              {...params}
                              variant="outlined"
                              size="small"
                              error={!!errors.operator}
                              helperText={errors.operator?.message}
                              placeholder="Select operator"
                            />
                          )}
                          size="small"
                        />
                      )}
                    />
                    {!errors.operator && (
                      <p className="text-xs text-slate-500">
                        Select the condition operator to apply
                      </p>
                    )}
                  </div>
                )}

                {/* Expected Value - Conditionally Rendered */}
                {showExpectedValue && (
                  <div className="space-y-1 animate-fadeIn">
                    <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
                      Expected Value
                    </label>
                    <Controller
                      name="expectedValue"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.expectedValue
                              ? "border-red-300 bg-red-50"
                              : "border-slate-300 bg-white"
                          }`}
                          placeholder="Enter expected value"
                        />
                      )}
                    />
                    {errors.expectedValue && (
                      <p className="text-xs text-red-600">
                        {errors.expectedValue.message}
                      </p>
                    )}
                    <p className="text-xs text-slate-500">
                      Value expected for compliance
                    </p>
                  </div>
                )}

                {/* Severity */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
                    Severity *
                  </label>
                  <Controller
                    name="severity"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        options={["Low", "Medium", "High", "Critical"]}
                        value={field.value || ""}
                        onChange={(_, value) => field.onChange(value || "")}
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            variant="outlined"
                            size="small"
                            error={!!errors.severity}
                            helperText={errors.severity?.message}
                            placeholder="Select severity"
                          />
                        )}
                        size="small"
                      />
                    )}
                  />
                  {!errors.severity && (
                    <p className="text-xs text-slate-500">
                      Indicate the risk severity level
                    </p>
                  )}
                </div>

                {/* Due in Days */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
                    Due in Days
                  </label>
                  <Controller
                    name="dueInDays"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.dueInDays
                            ? "border-red-300 bg-red-50"
                            : "border-slate-300 bg-white"
                        }`}
                        placeholder="Enter days"
                        value={field.value || ""}
                      />
                    )}
                  />
                  {errors.dueInDays && (
                    <p className="text-xs text-red-600">
                      {errors.dueInDays.message}
                    </p>
                  )}
                  <p className="text-xs text-slate-500">
                    Days to resolve violations
                  </p>
                </div>

                {/* Description */}
                <div className="lg:col-span-3 space-y-1">
                  <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
                    Description
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                          errors.description
                            ? "border-red-300 bg-red-50"
                            : "border-slate-300 bg-white"
                        }`}
                        placeholder="Provide detailed description of this rule..."
                      />
                    )}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                  <p className="text-xs font-bold text-slate-500">
                    Detailed explanation of this compliance rule
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <div
                    className={`flex items-center ${
                      selectedEntityType ? "text-blue-600" : ""
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        selectedEntityType
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      1
                    </div>
                    <span className="ml-2">Entity</span>
                  </div>
                  <div className="w-8 h-px bg-slate-300"></div>
                  <div
                    className={`flex items-center ${
                      selectedFieldKey ? "text-blue-600" : ""
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        selectedFieldKey
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      2
                    </div>
                    <span className="ml-2">Field</span>
                  </div>
                  <div className="w-8 h-px bg-slate-300"></div>
                  <div
                    className={`flex items-center ${
                      selectedOperator ? "text-blue-600" : ""
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        selectedOperator
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      3
                    </div>
                    <span className="ml-2">Operator</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <Button
                  loading={isUpdateLoading || isCreateLoading}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {formMode === "edit"
                    ? isUpdateLoading
                      ? "Updating..."
                      : "Update Compliance Rule"
                    : isCreateLoading
                    ? "Creating..."
                    : "Create Compliance Rule"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </Paper>
  );
}
