import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import {
  preprocessedDate,
  dateCell,
  preprocessedTime,
  timeCell,
  preprocessedDateTime,
} from "@/lib/schemas/time-parser";
import { employeeId } from "../nested-reusable-objects";
import { trainingRequestSchema } from "./tna-request";

// --- Helper Enum Options ---
const approvalStatusOptions = [
  { id: "Draft", name: "Draft" },
  { id: "PendingApproval", name: "Pending Approval" },
  { id: "Approved", name: "Approved" },
  { id: "Rejected", name: "Rejected" },
  { id: "InformationRequested", name: "Information Requested" },
  { id: "Reassigned", name: "Reassigned" },
  { id: "Withdrawn", name: "Withdrawn" },
  { id: "Cancelled", name: "Cancelled" },
  { id: "Delete", name: "Delete" },
  { id: "Closed", name: "Closed" },
];

const deliveryMethodOptions = [
  { id: "Classroom", name: "Classroom" },
  { id: "Online", name: "Online" },
  { id: "Blended", name: "Blended" },
];

const modeOptions = [
  { id: "Internal", name: "Internal" },
  { id: "External", name: "External" },
];

const recordStatusOptions = [
  { id: "Enrolled", name: "Enrolled" },
  { id: "Attended", name: "Attended" },
  { id: "Completed", name: "Completed" },
  { id: "Dropped", name: "Dropped" },
];

const attendanceStatusOptions = [
  { id: "Present", name: "Present" },
  { id: "Absent", name: "Absent" },
  { id: "Late", name: "Late" },
  { id: "LeftEarly", name: "Left Early" },
];

// --- 1. TrainingProgramPlanCreateInput Schema ---
export const trainingProgramPlanSchema = z
  .object({
    id,
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Plan name",
        placeholder: "Enter a unique name",
        description: "Name for the entity.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Plan Code",
        placeholder: "Enter a unique code",
        description: "Code for the  plan.",
        validationErrorMessage: "plan code is required.",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),
    approvalStatus: z
      .string()
      .default("Draft")
      .meta({
        formRelated: {
          section: "Approval",
          inputType: "table-only",
          label: "Approval Status",
          placeholder: "Select approval status",
          description: "The current approval status of the plan.",
          validationErrorMessage: "Approval status is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: approvalStatusOptions,
            allowCreateNew: false,
            getOptionsLabel: (value: { name: string }) => value.name,
            getOptionsValue: (value: { id: string }) => value.id,
          },
        },
        tableRelated: {
          header: "Approval Status",
          accessorKey: "approvalStatus",
        },
      } as FieldLevelMeta),
    deliveryMethod: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Delivery Method",
        placeholder: "Select delivery method",
        description:
          "How the training will be delivered (Classroom, Online, Blended).",
        validationErrorMessage: "Delivery method is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: deliveryMethodOptions,
          allowCreateNew: false,
          getOptionsLabel: (value: { name: string }) => value.name,
          getOptionsValue: (value: { id: string }) => value.id,
        },
      },
      tableRelated: {
        header: "Delivery Method",
        accessorKey: "deliveryMethod",
      },
    } as FieldLevelMeta),
    mode: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Mode",
        placeholder: "Select mode",
        description:
          "The source of the trainer/training (Internal or External).",
        validationErrorMessage: "Mode is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: modeOptions,
          allowCreateNew: false,
          getOptionsLabel: (value: { name: string }) => value.name,
          getOptionsValue: (value: { id: string }) => value.id,
        },
      },
      tableRelated: {
        header: "Mode",
        accessorKey: "mode",
      },
    } as FieldLevelMeta),
    learningObjectives: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-area",
          label: "Learning Objectives",
          placeholder: "Enter learning objectives",
          description: "Key goals of the training program.",
        },
        tableRelated: {
          header: "Objectives",
          accessorKey: "learningObjectives",
        },
      } as FieldLevelMeta),

    sourceRequest: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Source Request",
            placeholder: "Select source training request",
            description: "The training request this plan fulfills.",
            validationErrorMessage: "Invalid source request.",
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainingRequests",
              getOptionsLabel: (value) => value.title,
              getOptionsValue: (value) => value.id,
              createSchema: trainingRequestSchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Source Request",
            accessorKey: "sourceRequest.title",
          },
        } as FieldLevelMeta),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Source Request",
          accessorKey: "sourceRequest.title",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Training Program Plans",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingProgramPlans",
    formName: "trainingProgramPlan",
    allowDelete: true,
    createTitle: "Create Training Program Plan",
    sections: ["General", "Details", "Relations"],
    editTitle: "Edit Training Program Plan",
  } as SchemaMeta);

// --- 2. TrainerCreateInput Schema ---
export const trainerSchema = z
  .object({
    id,
    fullName: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Full Name",
        placeholder: "Enter full name",
        description: "Full name of the trainer.",
        validationErrorMessage: "Full name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "fullName",
      },
    } as FieldLevelMeta),
    source: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Source",
        placeholder: "Select trainer source",
        description: "Whether the trainer is Internal or External.",
        validationErrorMessage: "Source is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: modeOptions,
          allowCreateNew: false,
          getOptionsLabel: (value: { name: string }) => value.name,
          getOptionsValue: (value: { id: string }) => value.id,
        },
      },
      tableRelated: {
        header: "Source",
        accessorKey: "source",
      },
    } as FieldLevelMeta),
    expertiseDescription: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-area",
          label: "Expertise Description",
          placeholder: "Describe trainer's expertise",
          description: "Summary of the trainer's areas of expertise.",
        },
        tableRelated: {
          header: "Expertise",
          accessorKey: "expertiseDescription",
        },
      } as FieldLevelMeta),
    employee: employeeId("Relations"),

    ...dateTime,
  })
  .meta({
    tableName: "Trainers",
    apiEndPoint: "https://api.techbee.et/api/hr/trainers",
    formName: "trainer",
    allowDelete: true,
    createTitle: "Create Trainer",
    sections: ["General", "Details", "Relations"],
    editTitle: "Edit Trainer",
  } as SchemaMeta);
// --- 7. TrainingSessionCreateInput Schema ---
export const trainingSessionSchema = z
  .object({
    id,
    name: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Session name",
        placeholder: "Enter a unique name",
        description: "Name for the entity.",
        validationErrorMessage: "Name is required.",
        required: true,
      },
      tableRelated: {
        header: "Name",
        accessorKey: "name",
      },
    } as FieldLevelMeta),
    code: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Session Code",
        placeholder: "Enter a unique code",
        description: "Code for the  Session.",
        validationErrorMessage: "Session code is required.",
        required: true,
      },
      tableRelated: {
        header: "Code",
        accessorKey: "code",
      },
    } as FieldLevelMeta),
    startDate: preprocessedDateTime.meta({
      formRelated: {
        inputType: "date-time",
        label: "Start Date & Time",
        placeholder: "Select start date and time",
        description: "The beginning date and time of the training session.",
        validationErrorMessage: "Start date and time is required.",
        section: "Timeframe",
        required: true,
        date: {
          type: "date-and-time",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Start Time",
        accessorKey: "startDate",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    endDate: preprocessedDateTime.meta({
      formRelated: {
        inputType: "date-time",
        label: "End Date & Time",
        placeholder: "Select end date and time",
        description: "The ending date and time of the training session.",
        validationErrorMessage: "End date and time is required.",
        section: "Timeframe",
        required: true,
        date: {
          type: "date-and-time",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "End Time",
        accessorKey: "endDate",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    maxParticipants: z
      .number()
      .int()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "number-field",
          label: "Max Participants",
          placeholder: "Enter maximum participants",
          description: "Maximum number of attendees allowed in the session.",
        },
        tableRelated: {
          header: "Max Part.",
          accessorKey: "maxParticipants",
        },
      } as FieldLevelMeta),
    location: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "Location",
          placeholder: "Enter location (e.g., Room A, Zoom link)",
          description: "Physical or virtual location of the session.",
        },
        tableRelated: {
          header: "Location",
          accessorKey: "location",
        },
      } as FieldLevelMeta),
    platform: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "Platform",
          placeholder: "Enter training platform (e.g., Moodle, Cisco Webex)",
          description: "The software or system used for online sessions.",
        },
        tableRelated: {
          header: "Platform",
          accessorKey: "platform",
        },
      } as FieldLevelMeta),
    equipmentRequirements: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-area",
          label: "Equipment Requirements",
          placeholder: "Describe required equipment",
          description:
            "Any special equipment needed for the session (e.g., projectors, labs).",
        },
        tableRelated: {
          header: "Equipment Req.",
          accessorKey: "equipmentRequirements",
        },
      } as FieldLevelMeta),
    programPlan: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Program Plan",
            placeholder: "Select program plan",
            description: "The program plan this session belongs to.",
            validationErrorMessage: "Program plan is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainingProgramPlans",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              createSchema: trainingProgramPlanSchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Program Plan",
            accessorKey: "programPlan.name",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Program Plan",
          accessorKey: "programPlan.name",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Training Sessions",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingSessions",
    formName: "trainingSession",
    allowDelete: true,
    createTitle: "Create Training Session",
    sections: ["General", "Timeframe", "Details", "Relations"],
    editTitle: "Edit Training Session",
  } as SchemaMeta);

// --- 3. TrainingSessionTrainerCreateInput Schema ---
export const trainingSessionTrainerSchema = z
  .object({
    id,
    session: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Training Session",
            placeholder: "Select training session",
            description: "The training session.",
            validationErrorMessage: "Session is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainingSessions",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              createSchema: undefined,
              allowCreateNew: true,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Training Session",
          accessorKey: "session.name",
        },
      } as FieldLevelMeta),
    trainer: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Trainer",
            placeholder: "Select trainer",
            description: "The trainer assigned to the session.",
            validationErrorMessage: "Trainer is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainers",
              getOptionsLabel: (value) => value.fullName,
              getOptionsValue: (value) => value.id,
              createSchema: undefined,
              allowCreateNew: true,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Trainer",
          accessorKey: "trainer.fullName",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Session Trainer Links",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingSessionTrainers",
    formName: "trainingSessionTrainer",
    allowDelete: true,
    createTitle: "Assign Trainer to Session",
    sections: ["Relations"],
    editTitle: "Edit Trainer Assignment",
  } as SchemaMeta);

// --- 4. TrainingRecordCreateInput Schema ---
export const trainingRecordSchema = z
  .object({
    id,
    status: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Status",
        placeholder: "Select record status",
        description:
          "The enrollment status (Enrolled, Attended, Completed, Dropped).",
        validationErrorMessage: "Status is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: recordStatusOptions,
          allowCreateNew: false,
          getOptionsLabel: (value: { name: string }) => value.name,
          getOptionsValue: (value: { id: string }) => value.id,
        },
      },
      tableRelated: {
        header: "Status",
        accessorKey: "status",
      },
    } as FieldLevelMeta),
    score: z
      .number()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "number-field",
          label: "Score",
          placeholder: "Enter score/result",
          description: "The score obtained by the employee in the training.",
        },
        tableRelated: {
          header: "Score",
          accessorKey: "score",
        },
      } as FieldLevelMeta),
    employee: employeeId("Relations"),
    session: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Training Session",
            placeholder: "Select training session",
            description: "The training session attended.",
            validationErrorMessage: "Session is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainingSessions",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              createSchema: trainingSessionSchema,
              allowCreateNew: true,
            },
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Session",
          accessorKey: "session.name",
        },
      } as FieldLevelMeta),
    certificate: z
      .object({
        id: z
          .string()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              section: "Relations",
              label: "Certificate",
              placeholder: "Select certificate",
              description: "The certificate issued for this record.",
              validationErrorMessage: "Invalid certificate.",
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint:
                  "https://api.techbee.et/api/hr/trainingCertificates",
                getOptionsLabel: (value) => value.certificateNumber,
                getOptionsValue: (value) => value.id,
                // createSchema: trainingCertificateSchema,
                // allowCreateNew: true,
              },
            },
            tableRelated: {
              header: "Certificate No.",
              accessorKey: "certificate.certificateNumber",
            },
          } as FieldLevelMeta)
          .optional()
          .nullable(),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Certificate",
          accessorKey: "certificate.certificateNumber",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Training Records",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingRecords",
    formName: "trainingRecord",
    allowDelete: true,
    createTitle: "Create Training Record",
    sections: ["General", "Details", "Relations"],
    editTitle: "Edit Training Record",
  } as SchemaMeta);

// --- 5. TrainingAttendanceCreateInput Schema ---
export const trainingAttendanceSchema = z
  .object({
    id,
    attendanceStatus: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "auto-complete",
        label: "Attendance Status",
        placeholder: "Select attendance status",
        description:
          "The attendance status for the date (Present, Absent, Late, LeftEarly).",
        validationErrorMessage: "Attendance status is required.",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: attendanceStatusOptions,
          allowCreateNew: false,
          getOptionsLabel: (value: { name: string }) => value.name,
          getOptionsValue: (value: { id: string }) => value.id,
        },
      },
      tableRelated: {
        header: "Status",
        accessorKey: "attendanceStatus",
      },
    } as FieldLevelMeta),
    date: preprocessedDate.meta({
      formRelated: {
        inputType: "date-time",
        label: "Date",
        placeholder: "Select date",
        description: "The date of the attendance record.",
        validationErrorMessage: "Date is required.",
        section: "General",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Date",
        accessorKey: "date",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    checkInTime: preprocessedTime
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Check-in Time",
          placeholder: "Select check-in time",
          description: "The time the employee checked in.",
          section: "Details",
          date: {
            type: "time-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Check-in",
          accessorKey: "checkInTime",
          Cell: ({ cell }) => timeCell({ cell }),
        },
      } as FieldLevelMeta),
    checkOutTime: preprocessedTime
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Check-out Time",
          placeholder: "Select check-out time",
          description: "The time the employee checked out.",
          section: "Details",
          date: {
            type: "time-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Check-out",
          accessorKey: "checkOutTime",
          Cell: ({ cell }) => timeCell({ cell }),
        },
      } as FieldLevelMeta),
    record: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Training Record",
            placeholder: "Select training record",
            description: "The training record this attendance belongs to.",
            validationErrorMessage: "Training record is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainingRecords",
              getOptionsLabel: (value) =>
                value.session?.name +
                " / " +
                value.employee?.firstName +
                " " +
                value.employee?.fatherName, // Assuming record has an employee link
              getOptionsValue: (value) => value.id,
              createSchema: trainingRecordSchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Record ID",
            accessorKey: "record.id",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Training Record",
          accessorKey: "record.employee?.fullName",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Training Attendances",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingAttendances",
    formName: "trainingAttendance",
    allowDelete: true,
    createTitle: "Create Training Attendance",
    sections: ["General", "Details", "Relations"],
    editTitle: "Edit Training Attendance",
  } as SchemaMeta);

// --- 6. TrainingCertificateCreateInput Schema ---
export const trainingCertificateSchema = z
  .object({
    id,
    certificateNumber: z.string().meta({
      formRelated: {
        section: "General",
        inputType: "text-field",
        label: "Certificate Number",
        placeholder: "Enter certificate number",
        description: "The unique identifier for the certificate.",
        validationErrorMessage: "Certificate number is required.",
        required: true,
      },
      tableRelated: {
        header: "Certificate No.",
        accessorKey: "certificateNumber",
      },
    } as FieldLevelMeta),
    issueDate: preprocessedDate.meta({
      formRelated: {
        inputType: "date-time",
        label: "Issue Date",
        placeholder: "Select issue date",
        description: "The date the certificate was issued.",
        validationErrorMessage: "Issue date is required.",
        section: "General",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Issue Date",
        accessorKey: "issueDate",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    validUntil: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Valid Until",
          placeholder: "Select validity end date",
          description: "The date the certificate expires.",
          section: "General",
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Valid Until",
          accessorKey: "validUntil",
          Cell: ({ cell }) => dateCell({ cell }),
        },
      } as FieldLevelMeta),
    issuer: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "Issuer",
          placeholder: "Enter issuing organization",
          description: "The organization that issued the certificate.",
        },
        tableRelated: {
          header: "Issuer",
          accessorKey: "issuer",
        },
      } as FieldLevelMeta),
    fileUrl: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Details",
          inputType: "text-field",
          label: "File URL",
          placeholder: "Enter file URL",
          description: "Link to the digital copy of the certificate.",
        },
        tableRelated: {
          header: "File URL",
          accessorKey: "fileUrl",
        },
      } as FieldLevelMeta),
    record: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            section: "Relations",
            label: "Training Record",
            placeholder: "Select associated record",
            description: "The training record this certificate belongs to.",
            validationErrorMessage: "Training record is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/hr/trainingRecords",
              getOptionsLabel: (value) =>
                value.employee?.firstName + " " + value.employee?.fatherName, // Assuming record has an employee link
              getOptionsValue: (value) => value.id,
              createSchema: trainingRecordSchema,
              allowCreateNew: true,
            },
          },
          tableRelated: {
            header: "Record ID",
            accessorKey: "record.id",
          },
        } as FieldLevelMeta),
      })
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Training Record",
          accessorKey: "record.employee.fullName",
        },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Training Certificates",
    apiEndPoint: "https://api.techbee.et/api/hr/trainingCertificates",
    formName: "trainingCertificate",
    allowDelete: true,
    createTitle: "Create Training Certificate",
    sections: ["General", "Details", "Relations"],
    editTitle: "Edit Training Certificate",
  } as SchemaMeta);
