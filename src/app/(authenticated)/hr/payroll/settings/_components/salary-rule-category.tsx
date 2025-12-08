"use client";

import { useMemo } from "react";
import {
  useGetSalaryrulecategoriesQuery,
  useCreateSalaryrulecategoriesMutation,
  useUpdateSalaryrulecategoriesMutation,
  useDeleteSalaryrulecategoriesMutation,
} from "../../_queries/salaryRuleCategories";
import { ReusableTable } from "@/components/form-components";
import { MRT_ColumnDef } from "material-react-table";
import { UseFormReturn } from "react-hook-form";
import { Box, TextField, Grid } from "@mui/material";
import {
  SalaryRuleCategory,
  salaryRuleCategorySchema,
} from "../../_schemas/salary-rule-category";

export default () => {
  const {
    data: fetchedSalaryRuleCategories = [],
    isLoading,
    isFetching,
    isError,
  } = useGetSalaryrulecategoriesQuery();
  const [createSalaryrulecategory] = useCreateSalaryrulecategoriesMutation();
  const [updateSalaryrulecategory] = useUpdateSalaryrulecategoriesMutation();
  const [deleteSalaryrulecategory] = useDeleteSalaryrulecategoriesMutation();

  const normalizedSalaryRuleCategories = useMemo(() => {
    return fetchedSalaryRuleCategories.map((category) => ({
      ...category,
      description: category.description || "",
    }));
  }, [fetchedSalaryRuleCategories]);

  const columns = useMemo<MRT_ColumnDef<SalaryRuleCategory>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 80,
        muiTableHeadCellProps: { sx: { display: "none" } },
        muiTableBodyCellProps: { sx: { display: "none" } },
        muiTableFooterCellProps: { sx: { display: "none" } },
      },
      {
        accessorKey: "code",
        header: "Code",
        size: 150,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 200,
      },
      {
        accessorKey: "description",
        header: "Description",
        size: 300,
      },
    ],
    []
  );

  const renderSalaryRuleCategoryFormFields = (
    methods: UseFormReturn<SalaryRuleCategory>
  ) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          py: "1rem",
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              {...methods.register("code")}
              label="Code"
              margin="normal"
              fullWidth
              error={!!methods.formState.errors.code}
              helperText={
                methods.formState.errors.code?.message ||
                "A unique code for the salary rule category (e.g., 'GROSS')."
              }
              color="secondary"
              slotProps={{ inputLabel: { shrink: true } }}
              placeholder="e.g. GROSS"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              {...methods.register("name")}
              label="Name"
              margin="normal"
              fullWidth
              error={!!methods.formState.errors.name}
              helperText={
                methods.formState.errors.name?.message ||
                "The name of the salary rule category (e.g., 'Gross Salary')."
              }
              color="secondary"
              slotProps={{ inputLabel: { shrink: true } }}
              placeholder="e.g. Gross Salary"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <TextField
              {...methods.register("description")}
              label="Description (Optional)"
              margin="normal"
              fullWidth
              multiline
              rows={3}
              error={!!methods.formState.errors.description}
              helperText={
                methods.formState.errors.description?.message ||
                "A brief description of the salary rule category."
              }
              color="secondary"
              slotProps={{ inputLabel: { shrink: true } }}
              placeholder="e.g. Total gross salary before deductions."
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const handleCreateSalaryRuleCategory = async (values: SalaryRuleCategory) => {
    try {
      const {
        id,
        createdAt,
        updatedAt,
        createdBy,
        updatedBy,
        ...restOfValues
      } = values;

      const payload: Partial<
        Omit<
          SalaryRuleCategory,
          "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
        >
      > = {
        ...restOfValues,
      };

      for (const key in payload) {
        if (
          payload[key as keyof typeof payload] === "" ||
          payload[key as keyof typeof payload] === null ||
          payload[key as keyof typeof payload] === undefined
        ) {
          delete payload[key as keyof typeof payload];
        }
      }
      const response = await createSalaryrulecategory(payload).unwrap();
      return {
        success: true,
        message: "Salary rule category created successfully!",
      };
    } catch (error) {
      console.error("Failed to create salary rule category:", error);
      return {
        success: false,
        message:
          (error as any)?.data?.message ||
          (error as any)?.message ||
          "Failed to create salary rule category.",
      };
    }
  };

  const handleUpdateSalaryRuleCategory = async (values: SalaryRuleCategory) => {
    try {
      if (!values.id) {
        throw new Error("Cannot update: Salary Rule Category ID is missing.");
      }

      const { createdAt, updatedAt, createdBy, updatedBy, ...restOfValues } =
        values;

      const payload: Partial<
        Omit<
          SalaryRuleCategory,
          "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
        >
      > = {
        ...restOfValues,
      };

      for (const key in payload) {
        if (
          payload[key as keyof typeof payload] === "" ||
          payload[key as keyof typeof payload] === null ||
          payload[key as keyof typeof payload] === undefined
        ) {
          delete payload[key as keyof typeof payload];
        }
      }
      const response = await updateSalaryrulecategory({
        id: values.id,
        data: payload,
      }).unwrap();
      return {
        success: true,
        message: "Salary rule category updated successfully!",
      };
    } catch (error) {
      console.error("Failed to update salary rule category:", error);
      return {
        success: false,
        message:
          (error as any)?.data?.message ||
          (error as any)?.message ||
          "Failed to update salary rule category.",
      };
    }
  };

  const handleDeleteSalaryRuleCategory = async (id: string) => {
    try {
      const response = await deleteSalaryrulecategory(id).unwrap();
      return {
        success: true,
        message: "Salary rule category deleted successfully!",
      };
    } catch (error) {
      console.error("Failed to delete salary rule category:", error);
      return {
        success: false,
        message:
          (error as any)?.data?.message ||
          (error as any)?.message ||
          "Failed to delete salary rule category.",
      };
    }
  };

  return (
    <ReusableTable<typeof salaryRuleCategorySchema>
      data={normalizedSalaryRuleCategories}
      columns={columns}
      schema={salaryRuleCategorySchema}
      renderFormFields={renderSalaryRuleCategoryFormFields}
      onCreate={handleCreateSalaryRuleCategory}
      onUpdate={handleUpdateSalaryRuleCategory}
      onDelete={handleDeleteSalaryRuleCategory}
      getId={(row) => row.id || row.code}
      tableTitle="Salary Rule Category"
      createButtonText="new"
      isLoading={isLoading}
      isFetching={isFetching}
      isError={isError}
    />
  );
};
