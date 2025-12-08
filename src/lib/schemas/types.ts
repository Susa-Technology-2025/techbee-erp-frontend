import type { MRT_ColumnDef } from "material-react-table";

export type FormFieldType =
  | "auto-complete"
  | "date-time"
  | "number-field"
  | "text-field"
  | "password-field"
  | "boolean-field"
  | "text-area"
  | "array"
  | "primitive-array"
  | "object-array"
  | "chips"
  | "table-only"
  | "question-template"
  | "markdown"
  | "object"
  | "expression-field"
  | "file";

export type FieldLevelMeta = {
  formRelated: {
    inputType: FormFieldType;
    label?: string;
    placeholder?: string;
    templateEndpoint?: string;
    expression?: {
      allowedVariablesEndpoint?: string;
      getVariables?: (data: any[]) => string[];
    };
    description?: string;
    disabled?: boolean;
    hidden?: boolean;
    validationErrorMessage: string;
    relationConnectKey?: string;
    section: string | "no-section";
    required?: boolean;
    staticAsync?: boolean;
    staticAsyncDisabled?: boolean;
    autoComplete?: {
      multiple: boolean;
      async: boolean;
      userId?: boolean;
      options?: any[];
      allowCreateNew: boolean;
      inputForStaticAsync?: boolean;
      dynamicGetEndPoint?: (dependsOnItemValue: any) => string;
      getEndpoint?: string;
      createSchema?: any;
      getOptionsLabel: (value: any) => string;
      getOptionsValue: (value: any) => any;
    };
    date?: {
      type: "date-only" | "time-only" | "date-and-time";
      min: Date | undefined;
      max: Date | undefined;
    };
    file?: {
      allowedFileTypes: string[];
      min?: number;
      max?: number;
    };
    conditional?: {
      dependsOn: string;
      showIf?: any;
      hideIf?: any;
    };
  };
  tableRelated: MRT_ColumnDef<any>;
};

export type SchemaMeta = {
  apiEndPoint: string;
  tableName: string;
  formName: string;
  sections: string[];
  createTitle: string;
  allowCreateNew?: boolean;
  editTitle: string;
  allowDelete?: boolean;
  allowEdit?: boolean;
  remover?: () => void;
};
