import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import {
  dateCell,
  preprocessedDate,
  preprocessedDateTime,
} from "@/lib/schemas/time-parser";
import { application } from "./reusable";
import OfferDetailsDialog from "./offer-detail";
import { orgology, userology } from "../nested-reusable-objects";
import { userSchema } from "../users";
import { salaryStructureSchema } from "../salary-structure";

// Dummy schemas for nested object creation (as per rule 4)
const applicationSchema = z.object({ id: z.string(), name: z.string() });
const approvalInstanceSchema = z.object({ id: z.string(), name: z.string() });

// Enum options as per schema (Draft, PendingApproval, Approved, etc.)
const approvalStatusOptions = [
  "Draft",
  "PendingApproval",
  "Approved",
  "Rejected",
  "InformationRequested",
  "Reassigned",
  "Withdrawn",
  "Cancelled",
  "Delete",
  "Closed",
].map((status) => ({
  id: status,
  name: status.replace(/([A-Z])/g, " $1").trim(),
}));

const offerStatusOptions = ["Draft", "Accepted", "Declined"].map((status) => ({
  id: status,
  name: status,
}));
const currencyOptions = [
  { id: "USD", name: "USD - US Dollar" },
  { id: "EUR", name: "EUR - Euro" },
  { id: "GBP", name: "GBP - British Pound" },
  { id: "CAD", name: "CAD - Canadian Dollar" },
  { id: "ETB", name: "ETB - Ethiopian Birr" },
  { id: "JPY", name: "JPY - Japanese Yen" },
  { id: "AUD", name: "AUD - Australian Dollar" },
];

export const offerSchema = z
  .object({
    // Fields from OfferCreateInput
    id,
    application,

    approvalStatus: z
      .string()
      .default("Draft")
      .meta({
        formRelated: {
          inputType: "table-only",
          section: "General", // Changed to General
          label: "Approval Status",
          placeholder: "Select approval status",
          description: "Status within the approval workflow.",
          validationErrorMessage: "Approval status is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: approvalStatusOptions,
            allowCreateNew: false,
            getOptionsLabel: (value) => value.name,
            getOptionsValue: (value) => value.id,
          },
        },
        tableRelated: {
          header: "Approval Status",
          accessorKey: "approvalStatus",
        },
      } as FieldLevelMeta),

    baseSalary: z.number().meta({
      formRelated: {
        section: "General", // Changed to General
        inputType: "number-field",
        label: "Base Salary",
        placeholder: "Enter annual base salary",
        description: "The primary salary component.",
        validationErrorMessage: "Base salary is required and must be a number.",
        required: true,
      },
      tableRelated: {
        header: "Salary",
        accessorKey: "baseSalary",
      },
    } as FieldLevelMeta),

    benefits: z.string().meta({
      formRelated: {
        section: "Benefits", // Changed to General
        inputType: "markdown",
        label: "Benefits Package",
        placeholder: "List additional benefits...",
        description: "Details on health insurance, PTO, etc.",
        validationErrorMessage: "Benefits are required.",
        required: true,
      },
      tableRelated: {
        header: "Benefits",
        accessorKey: "benefits",
      },
    } as FieldLevelMeta),

    currency: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete", // CHANGED to auto-complete
        label: "Currency",
        placeholder: "Select the currency",
        description: "The currency of the base salary.",
        validationErrorMessage: "Currency is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: currencyOptions, // Static list of currencies
          allowCreateNew: false,
          getOptionsLabel: (value) => value.name,
          getOptionsValue: (value) => value.id,
        },
      },
      tableRelated: {
        header: "Currency",
        accessorKey: "currency",
      },
    } as FieldLevelMeta),

    // fileUrl: z
    //   .string()
    //   .optional()
    //   .nullable()
    //   .meta({
    //     formRelated: {
    //       section: "Documents", // Changed to General
    //       inputType: "file",
    //       label: "Offer Document URL",
    //       placeholder: "Enter URL to the final offer document",
    //       description: "Link to the physical/digital offer letter.",
    //       validationErrorMessage: "Invalid URL for offer document.",
    //       required: false,
    //       file: {
    //         allowedFileTypes: ["pdf", "png", "jpg"],
    //       },
    //     },
    //     tableRelated: {
    //       header: "Document Link",
    //       accessorKey: "fileUrl",
    //     },
    //   } as FieldLevelMeta),

    notes: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General", // Changed to General
          inputType: "text-area",
          label: "Internal Notes",
          placeholder: "Add internal notes about the offer...",
          description: "Private notes for the HR team.",
          validationErrorMessage: "Notes must be a string.",
          required: false,
        },
        tableRelated: {
          header: "Notes",
          accessorKey: "notes",
          hidden: true,
        },
      } as FieldLevelMeta),
    terms: z
      .url()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General", // Changed to General
          inputType: "text-field",
          label: "Terms Url",
          placeholder: "https://www.example.com",
          description: "company terms and regualations link.",
          validationErrorMessage: "terms must be a url.",
          required: false,
        },
        tableRelated: {
          header: "terms url",
          accessorKey: "terms",
          hidden: true,
        },
      } as FieldLevelMeta),

    startDate: preprocessedDate.meta({
      formRelated: {
        inputType: "date-time",
        label: "Start Date",
        placeholder: "Select the intended start date",
        description: "The date the candidate is expected to begin work.",
        validationErrorMessage: "A valid start date is required.",
        section: "General", // Changed to General
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Start Date",
        accessorKey: "startDate",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    organizationNodeId: orgology("General"),
    preparedBy: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "auto-complete",
          label: "prepared by",
          placeholder: "Enter user ID",
          description: "The user ID associated with the offer.",
          validationErrorMessage: "User ID is required.",
          section: "General",
          required: true,
          autoComplete: {
            async: true,
            allowCreateNew: true,
            getOptionsLabel: (opt) => opt.firstName + " " + opt.lastName,
            getOptionsValue: (opt) => opt.id,
            createSchema: userSchema,
            getEndpoint: "https://auth.api.techbee.et/api/users",
          },
        },
      } as FieldLevelMeta),

    status: z
      .string()
      .default("Draft")
      .meta({
        formRelated: {
          inputType: "auto-complete",
          section: "General", // Changed to General
          label: "Offer Status",
          placeholder: "Select offer status",
          description:
            "The candidate's response to the offer (Draft, Accepted, Declined).",
          validationErrorMessage: "Offer status is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: offerStatusOptions,
            allowCreateNew: false,
            getOptionsLabel: (value) => value.name,
            getOptionsValue: (value) => value.id,
          },
        },
        tableRelated: {
          header: "Offer Status",
          accessorKey: "status",
        },
      } as FieldLevelMeta),
    salaryStructure: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "General",
          inputType: "auto-complete",
          label: "Salary Structure",
          placeholder: "Select salary structure",
          description: "The salary structure for the contract.",
          validationErrorMessage: "Salary structure is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: true,
            options: undefined,
            allowCreateNew: true,
            createSchema: salaryStructureSchema,
            getEndpoint: "https://api.techbee.et/api/hr/salaryStructures",
            getOptionsLabel: (value) => value.name,
            getOptionsValue: (value) => value.id,
          },
        },
      } as FieldLevelMeta),
  })
  .meta({
    tableName: "Job Offers",
    apiEndPoint: "https://api.techbee.et/api/hr/offers",
    formName: "jobOfferForm",
    allowDelete: true,
    createTitle: "Create Job Offer",
    sections: [
      "General",
      "Benefits", // Updated to only include "General"
    ],
    editTitle: "Edit Job Offer",
    DetailModal: OfferDetailsDialog,
  } as SchemaMeta);
