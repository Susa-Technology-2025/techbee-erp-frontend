import { z } from "zod";

// Rule Category Zod Schema
export const ruleCategoryZodSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  code: z.string().min(1, "Code is required").max(20, "Code must be less than 20 characters"),
  description: z.string().optional(),
});

// Employee Zod Schema (example for future use)
export const employeeZodSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  department: z.string().optional(),
  hireDate: z.string().min(1, "Hire date is required"),
  salary: z.number().min(0, "Salary must be positive"),
});

// Product Zod Schema (example for future use)
export const productZodSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().optional(),
  description: z.string().optional(),
});

// Department Zod Schema (example for future use)
export const departmentZodSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  code: z.string().min(1, "Department code is required"),
  manager: z.string().optional(),
  location: z.string().optional(),
}); 