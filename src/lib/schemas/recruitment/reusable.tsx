import z from "zod";
import { FieldLevelMeta } from "../types";
import { ApplicationCreateInput } from "./application";

export const application = z
  .object({
    id: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        section: "General",
        label: "application",
        placeholder: "Select application",
        description: "The applicator associated with this record.",
        validationErrorMessage: "Application is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: true,
          getEndpoint: "https://api.techbee.et/api/hr/applications",
          getOptionsLabel: (value) =>
            value.requisition?.title +
            " - " +
            value.candidate?.firstName +
            " " +
            value.candidate?.fatherName,
          getOptionsValue: (value) => value.id,
          allowCreateNew: true,
          createSchema: ApplicationCreateInput,
        },
      },
    } as FieldLevelMeta),
  })
  .meta({
    formRelated: {
      inputType: "object",
    },
    tableRelated: {
      header: "Applicator",
      accessorKey: "application.id",
      Cell: ({ row }) => {
        const candidate = row.original.application?.candidate;
        return `${row.original.application?.requisition?.title} / ${candidate?.firstName} ${candidate?.fatherName}`;
      },
    },
  } as FieldLevelMeta);
