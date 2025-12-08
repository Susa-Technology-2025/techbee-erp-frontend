import { FieldConfig } from "@/components/smart-crud/modal-dialog";

// Example field schemas for different entities

// Rule Categories (current implementation)
export const ruleCategoryFields: FieldConfig[] = [
  {
    name: "name",
    defaultValue: "",
    type: "text",
    required: true,
    label: "Name",
  },
  {
    name: "code",
    defaultValue: "",
    type: "text",
    required: true,
    label: "Code",
  },
  {
    name: "description",
    defaultValue: "",
    type: "text",
    required: false,
    label: "Description",
  },
];

// Employee fields example
export const employeeFields: FieldConfig[] = [
  {
    name: "firstName",
    defaultValue: "",
    type: "text",
    required: true,
    label: "First Name",
  },
  {
    name: "lastName",
    defaultValue: "",
    type: "text",
    required: true,
    label: "Last Name",
  },
  {
    name: "email",
    defaultValue: "",
    type: "email",
    required: true,
    label: "Email",
  },
  {
    name: "department",
    defaultValue: "",
    type: "select",
    required: false,
    label: "Department",
    options: [
      { label: "Engineering", value: "engineering" },
      { label: "Marketing", value: "marketing" },
      { label: "Sales", value: "sales" },
      { label: "HR", value: "hr" },
      { label: "Finance", value: "finance" },
    ],
  },
  {
    name: "hireDate",
    defaultValue: "",
    type: "date",
    required: true,
    label: "Hire Date",
  },
  {
    name: "salary",
    defaultValue: 0,
    type: "number",
    required: true,
    label: "Salary",
  },
];

// Product fields example
export const productFields: FieldConfig[] = [
  {
    name: "productName",
    defaultValue: "",
    type: "text",
    required: true,
    label: "Product Name",
  },
  { name: "sku", defaultValue: "", type: "text", required: true, label: "SKU" },
  {
    name: "price",
    defaultValue: 0,
    type: "number",
    required: true,
    label: "Price",
  },
  {
    name: "category",
    defaultValue: "",
    type: "select",
    required: false,
    label: "Category",
    options: [
      { label: "Electronics", value: "electronics" },
      { label: "Clothing", value: "clothing" },
      { label: "Books", value: "books" },
      { label: "Home & Garden", value: "home-garden" },
      { label: "Sports", value: "sports" },
    ],
  },
  {
    name: "description",
    defaultValue: "",
    type: "text",
    required: false,
    label: "Description",
  },
];
