import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { dateCell, preprocessedDateTime } from "@/lib/schemas/time-parser";

export const payrollEntrySchema = z
  .object({
    id,
    approvedByFinance: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Approved by Finance",
          section: "General",
          description:
            "Indicates if the payroll entry has been approved by finance.",
          validationErrorMessage: "This field is required.",
        },
        tableRelated: {
          header: "Approved by Finance",
          accessorKey: "approvedByFinance",
        },
      } as FieldLevelMeta),
    approvedByHr: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Approved by HR",
          section: "General",
          description:
            "Indicates if the payroll entry has been approved by HR.",
          validationErrorMessage: "This field is required.",
        },
        tableRelated: {
          header: "Approved by HR",
          accessorKey: "approvedByHr",
        },
      } as FieldLevelMeta),
    approvedByManager: z
      .boolean()
      .default(false)
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Approved by Manager",
          section: "General",
          description:
            "Indicates if the payroll entry has been approved by the manager.",
          validationErrorMessage: "This field is required.",
        },
        tableRelated: {
          header: "Approved by Manager",
          accessorKey: "approvedByManager",
        },
      } as FieldLevelMeta),
    grossPay: z.number().meta({
      formRelated: {
        inputType: "number-field",
        label: "Gross Pay",
        section: "Payroll Details",
        description: "The total gross pay for the period.",
        validationErrorMessage: "Gross pay is required.",
        required: true,
      },
      tableRelated: {
        header: "Gross Pay",
        accessorKey: "grossPay",
      },
    } as FieldLevelMeta),
    netPay: z.number().meta({
      formRelated: {
        inputType: "number-field",
        label: "Net Pay",
        section: "Payroll Details",
        description: "The total net pay after deductions.",
        validationErrorMessage: "Net pay is required.",
        required: true,
      },
      tableRelated: {
        header: "Net Pay",
        accessorKey: "netPay",
      },
    } as FieldLevelMeta),
    currency: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Currency",
          placeholder: "ETB",
          section: "Payroll Details",
          description: "The currency of the payroll entry.",
          validationErrorMessage: "Currency is required.",
        },
        tableRelated: {
          header: "Currency",
          accessorKey: "currency",
        },
      } as FieldLevelMeta),
    periodStart: preprocessedDateTime.meta({
      formRelated: {
        inputType: "date-time",
        label: "Period Start",
        section: "Payroll Details",
        description: "The start date of the payroll period.",
        validationErrorMessage: "Start date is required.",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Period Start",
        accessorKey: "periodStart",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    periodEnd: preprocessedDateTime.meta({
      formRelated: {
        inputType: "date-time",
        label: "Period End",
        section: "Payroll Details",
        description: "The end date of the payroll period.",
        validationErrorMessage: "End date is required.",
        required: true,
        date: {
          type: "date-only",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Period End",
        accessorKey: "periodEnd",
        Cell: ({ cell }) => dateCell({ cell }),
      },
    } as FieldLevelMeta),
    status: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Status",
        placeholder: "Draft",
        section: "General",
        description: "The status of the payroll entry.",
        validationErrorMessage: "Status is required.",
        required: true,
      },
      tableRelated: {
        header: "Status",
        accessorKey: "status",
      },
    } as FieldLevelMeta),
    analyticAccountId: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "auto-complete",
          label: "Analytic Account",
          section: "General",
          description: "The associated analytic account for the payroll entry.",
          validationErrorMessage: "Analytic account is required.",
          autoComplete: {
            multiple: false,
            async: true,
            getEndpoint:
              "https://api.techbee.et/api/accounting/analyticAccounts",
            getOptionsLabel: (value) => value.name,
            getOptionsValue: (value) => value.id,
            allowCreateNew: true,
          },
        },
        tableRelated: {
          header: "Analytic Account",
          accessorKey: "analyticAccountId",
        },
      } as FieldLevelMeta),
    journalEntryCode: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Journal Entry Code",
          section: "Accounting",
          description: "The code for the related journal entry.",
          validationErrorMessage: "Journal entry code is required.",
          hidden: true,
        },
        tableRelated: {
          header: "Journal Entry Code",
          accessorKey: "journalEntryCode",
        },
      } as FieldLevelMeta),
    journalEntryId: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Journal Entry ID",
          section: "Accounting",
          description: "The ID for the related journal entry.",
          validationErrorMessage: "Journal entry ID is required.",
          hidden: true,
        },
        tableRelated: {
          header: "Journal Entry ID",
          accessorKey: "journalEntryId",
        },
      } as FieldLevelMeta),
    organizationNodeId: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Organization Node ID",
          section: "General",
          description: "The organization node ID.",
          validationErrorMessage: "Organization node ID is required.",
          hidden: true,
        },
        tableRelated: {
          header: "Organization Node ID",
          accessorKey: "organizationNodeId",
        },
      } as FieldLevelMeta),
    contract: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            label: "Contract",
            section: "Contract Details",
            description: "The employee's contract.",
            validationErrorMessage: "Contract is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/payroll/contracts",
              getOptionsLabel: (value) => value.id,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
            },
          },
        } as FieldLevelMeta),
        baseSalary: z.number().meta({
          formRelated: {
            inputType: "number-field",
            label: "Base Salary",
            section: "Contract Details",
            description: "The base salary from the contract.",
            validationErrorMessage: "Base salary is required.",
            required: true,
          },
          tableRelated: {
            header: "Base Salary",
            accessorKey: "contract.baseSalary",
          },
        } as FieldLevelMeta),
        startDate: preprocessedDateTime.meta({
          formRelated: {
            inputType: "date-time",
            label: "Contract Start Date",
            section: "Contract Details",
            description: "The start date of the contract.",
            validationErrorMessage: "Start date is required.",
            required: true,
            date: {
              type: "date-and-time",
              min: undefined,
              max: undefined,
            },
          },
          tableRelated: {
            header: "Contract Start Date",
            accessorKey: "contract.startDate",
            Cell: ({ cell }) => dateCell({ cell }),
          },
        } as FieldLevelMeta),
        endDate: preprocessedDateTime.meta({
          formRelated: {
            inputType: "date-time",
            label: "Contract End Date",
            section: "Contract Details",
            description: "The end date of the contract.",
            validationErrorMessage: "End date is required.",
            required: true,
            date: {
              type: "date-and-time",
              min: undefined,
              max: undefined,
            },
          },
          tableRelated: {
            header: "Contract End Date",
            accessorKey: "contract.endDate",
            Cell: ({ cell }) => dateCell({ cell }),
          },
        } as FieldLevelMeta),
        salaryStructure: z.object({
          id: z.string().meta({
            formRelated: {
              inputType: "auto-complete",
              label: "Salary Structure",
              section: "Contract Details",
              description: "The salary structure for the contract.",
              validationErrorMessage: "Salary structure is required.",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                getEndpoint:
                  "https://api.techbee.et/api/payroll/salaryStructures",
                getOptionsLabel: (value) => value.name,
                getOptionsValue: (value) => value.id,
                allowCreateNew: true,
              },
            },
          } as FieldLevelMeta),
          name: z.string().meta({
            formRelated: {
              inputType: "text-field",
              hidden: true,
              section: "Contract Details",
            },
            tableRelated: {
              header: "Salary Structure",
              accessorKey: "contract.salaryStructure.name",
            },
          } as FieldLevelMeta),
          code: z.string().meta({
            formRelated: {
              inputType: "text-field",
              hidden: true,
              section: "Contract Details",
            },
            tableRelated: {
              header: "Salary Structure Code",
              accessorKey: "contract.salaryStructure.code",
            },
          } as FieldLevelMeta),
        }),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: { inputType: "object", section: "Contract Details" },
        tableRelated: { header: "Contract", accessorKey: "contract.id" },
      } as FieldLevelMeta),
    employee: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            label: "Employee",
            section: "Employee Information",
            description: "The employee associated with this payroll entry.",
            validationErrorMessage: "Employee is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/core/employees",
              getOptionsLabel: (value) =>
                value.firstName + " " + (value.fatherName || ""),
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
            },
          },
        } as FieldLevelMeta),
        firstName: z.string().meta({
          formRelated: {
            inputType: "text-field",
            hidden: true,
            section: "Employee Information",
          },
          tableRelated: {
            header: "First Name",
            accessorKey: "employee.firstName",
          },
        } as FieldLevelMeta),
        fatherName: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "text-field",
              hidden: true,
              section: "Employee Information",
            },
            tableRelated: {
              header: "Father Name",
              accessorKey: "employee.fatherName",
            },
          } as FieldLevelMeta),
        employeeCode: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "text-field",
              hidden: true,
              section: "Employee Information",
            },
            tableRelated: {
              header: "Employee Code",
              accessorKey: "employee.employeeCode",
            },
          } as FieldLevelMeta),
        email: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "text-field",
              hidden: true,
              section: "Employee Information",
            },
            tableRelated: { header: "Email", accessorKey: "employee.email" },
          } as FieldLevelMeta),
        phoneNumber: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "text-field",
              hidden: true,
              section: "Employee Information",
            },
            tableRelated: {
              header: "Phone Number",
              accessorKey: "employee.phoneNumber",
            },
          } as FieldLevelMeta),
        tinNumber: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "text-field",
              hidden: true,
              section: "Employee Information",
            },
            tableRelated: {
              header: "TIN Number",
              accessorKey: "employee.tinNumber",
            },
          } as FieldLevelMeta),
        position: z
          .object({
            id: z.string().meta({
              formRelated: {
                inputType: "auto-complete",
                label: "Position",
                section: "Employee Information",
                description: "The employee's position.",
                validationErrorMessage: "Position is required.",
                required: true,
                autoComplete: {
                  multiple: false,
                  async: true,
                  getEndpoint: "https://api.techbee.et/api/core/positions",
                  getOptionsLabel: (value) => value.title,
                  getOptionsValue: (value) => value.id,
                  allowCreateNew: true,
                },
              },
            } as FieldLevelMeta),
            title: z.string().meta({
              formRelated: {
                inputType: "text-field",
                hidden: true,
                section: "Employee Information",
              },
              tableRelated: {
                header: "Position",
                accessorKey: "employee.position.title",
              },
            } as FieldLevelMeta),
            code: z.string().meta({
              formRelated: {
                inputType: "text-field",
                hidden: true,
                section: "Employee Information",
              },
              tableRelated: {
                header: "Position Code",
                accessorKey: "employee.position.code",
              },
            } as FieldLevelMeta),
          })
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "object",
              hidden: true,
              section: "Employee Information",
            },
            tableRelated: {
              header: "Position",
              accessorKey: "employee.position.title",
            },
          } as FieldLevelMeta),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: { inputType: "object", section: "Employee Information" },
        tableRelated: { header: "Employee", accessorKey: "employee.firstName" },
      } as FieldLevelMeta),
    payrollBatch: z
      .object({
        id: z.string().meta({
          formRelated: {
            inputType: "auto-complete",
            label: "Payroll Batch",
            section: "Payroll Details",
            description: "The payroll batch this entry belongs to.",
            validationErrorMessage: "Payroll batch is required.",
            required: true,
            autoComplete: {
              multiple: false,
              async: true,
              getEndpoint: "https://api.techbee.et/api/payroll/payrollBatches",
              getOptionsLabel: (value) => value.name,
              getOptionsValue: (value) => value.id,
              allowCreateNew: true,
            },
          },
        } as FieldLevelMeta),
        name: z.string().meta({
          formRelated: {
            inputType: "text-field",
            hidden: true,
            section: "Payroll Details",
          },
          tableRelated: {
            header: "Payroll Batch",
            accessorKey: "payrollBatch.name",
          },
        } as FieldLevelMeta),
        periodStart: preprocessedDateTime.meta({
          formRelated: {
            inputType: "date-time",
            hidden: true,
            section: "Payroll Details",
          },
          tableRelated: {
            header: "Batch Period Start",
            accessorKey: "payrollBatch.periodStart",
            Cell: ({ cell }) => dateCell({ cell }),
          },
        } as FieldLevelMeta),
        periodEnd: preprocessedDateTime.meta({
          formRelated: {
            inputType: "date-time",
            hidden: true,
            section: "Payroll Details",
          },
          tableRelated: {
            header: "Batch Period End",
            accessorKey: "payrollBatch.periodEnd",
            Cell: ({ cell }) => dateCell({ cell }),
          },
        } as FieldLevelMeta),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: { inputType: "object", section: "Payroll Details" },
        tableRelated: {
          header: "Payroll Batch",
          accessorKey: "payrollBatch.name",
        },
      } as FieldLevelMeta),
    components: z
      .array(
        z.object({
          id: z
            .string()
            .optional()
            .nullable()
            .meta({
              formRelated: {
                inputType: "text-field",
                hidden: true,
                section: "Components",
              },
              tableRelated: {
                header: "Component ID",
                accessorKey: "components.id",
                hidden: true,
              },
            } as FieldLevelMeta),
          amount: z.number().meta({
            formRelated: {
              inputType: "number-field",
              label: "Amount",
              section: "Components",
              description: "The amount for the salary component.",
              validationErrorMessage: "Amount is required.",
              required: true,
            },
            tableRelated: { header: "Amount", accessorKey: "amount" },
          } as FieldLevelMeta),
          description: z
            .string()
            .optional()
            .nullable()
            .meta({
              formRelated: {
                inputType: "text-area",
                label: "Description",
                section: "Components",
                description: "Description of the salary component.",
                validationErrorMessage: "Description is required.",
              },
              tableRelated: {
                header: "Description",
                accessorKey: "description",
              },
            } as FieldLevelMeta),
          analyticAccountId: z
            .string()
            .optional()
            .nullable()
            .meta({
              formRelated: {
                inputType: "auto-complete",
                label: "Analytic Account",
                section: "Components",
                description:
                  "The associated analytic account for the component.",
                validationErrorMessage: "Analytic account is required.",
                autoComplete: {
                  multiple: false,
                  async: true,
                  getEndpoint:
                    "https://api.techbee.et/api/accounting/analyticAccounts",
                  getOptionsLabel: (value) => value.name,
                  getOptionsValue: (value) => value.id,
                  allowCreateNew: true,
                },
              },
              tableRelated: {
                header: "Analytic Account",
                accessorKey: "analyticAccountId",
              },
            } as FieldLevelMeta),
          salaryRule: z
            .object({
              id: z.string().meta({
                formRelated: {
                  inputType: "auto-complete",
                  label: "Salary Rule",
                  section: "Components",
                  description: "The salary rule for this component.",
                  validationErrorMessage: "Salary rule is required.",
                  required: true,
                  autoComplete: {
                    multiple: false,
                    async: true,
                    getEndpoint:
                      "https://api.techbee.et/api/payroll/salaryRules",
                    getOptionsLabel: (value) => value.name,
                    getOptionsValue: (value) => value.id,
                    allowCreateNew: true,
                  },
                },
              } as FieldLevelMeta),
              name: z.string().meta({
                formRelated: {
                  inputType: "text-field",
                  hidden: true,
                  section: "Components",
                },
                tableRelated: {
                  header: "Salary Rule",
                  accessorKey: "salaryRule.name",
                },
              } as FieldLevelMeta),
              code: z.string().meta({
                formRelated: {
                  inputType: "text-field",
                  hidden: true,
                  section: "Components",
                },
                tableRelated: {
                  header: "Rule Code",
                  accessorKey: "salaryRule.code",
                },
              } as FieldLevelMeta),
              category: z
                .object({
                  name: z.string().meta({
                    formRelated: {
                      inputType: "text-field",
                      hidden: true,
                      section: "Components",
                    },
                    tableRelated: {
                      header: "Category",
                      accessorKey: "salaryRule.category.name",
                    },
                  } as FieldLevelMeta),
                })
                .optional()
                .nullable()
                .meta({
                  formRelated: {
                    inputType: "object",
                    hidden: true,
                    section: "Components",
                  },
                  tableRelated: {
                    header: "Category",
                    accessorKey: "salaryRule.category.name",
                  },
                } as FieldLevelMeta),
            })
            .optional()
            .nullable()
            .meta({
              formRelated: {
                inputType: "object",
                hidden: true,
                section: "Components",
              },
              tableRelated: {
                header: "Salary Rule",
                accessorKey: "salaryRule.name",
              },
            } as FieldLevelMeta),
        })
      )
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "array",
          label: "Components",
          section: "Components",
        },
        tableRelated: { header: "Components", accessorKey: "components" },
      } as FieldLevelMeta),
    ...dateTime,
  })
  .meta({
    tableName: "Payroll Entries",
    apiEndPoint: "https://api.techbee.et/api/hr/payslips",
    formName: "payrollEntry",
    allowDelete: true,
    createTitle: "Create Payroll Entry",
    sections: [
      "General",
      "Employee Information",
      "Contract Details",
      "Payroll Details",
      "Components",
    ],
    editTitle: "Edit Payroll Entry",
  } as SchemaMeta);
