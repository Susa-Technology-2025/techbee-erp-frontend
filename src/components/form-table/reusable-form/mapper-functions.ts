import {
  ZodType,
  ZodObject,
  ZodOptional,
  ZodNullable,
  ZodDefault,
  ZodArray,
} from "zod";

export type FieldMapItem = {
  name: string;
  zodField: ZodType<any>;
  meta: any;
};

export type SectionMap = Record<string, FieldMapItem[]>;

/**
 * Recursively unwrap optional/nullable/default types
 */
export const unwrap = (field: ZodType<any>): ZodType<any> => {
  while (
    field instanceof ZodOptional ||
    field instanceof ZodNullable ||
    field instanceof ZodDefault
  ) {
    field = (field as any)._def.innerType;
  }
  return field;
};

/**
 * Get FieldLevelMeta from outer or inner field
 */
export const getFieldMeta = (field: ZodType<any>): any | undefined => {
  const outerMeta = (field as any).meta?.();
  if (outerMeta?.formRelated) return outerMeta;

  const unwrapped = unwrap(field);
  const innerMeta = (unwrapped as any).meta?.();
  if (innerMeta?.formRelated) return innerMeta;

  return undefined;
};

/**
 * Main function to map Zod schema to section map
 */
export const mapSchemaToSections = (
  schema: ZodObject<any>,
  values: Record<string, any> = {}
): SectionMap => {
  const sectionMap: SectionMap = {};

  const addFieldToSectionMap = (
    name: string,
    field: ZodType<any>,
    value: any
  ) => {
    const unwrapped = unwrap(field);

    if (unwrapped instanceof ZodObject && !(unwrapped instanceof ZodArray)) {
      const subShape = unwrapped.shape;
      Object.entries(subShape).forEach(([subKey, subField]) => {
        addFieldToSectionMap(`${name}.${subKey}`, subField, value?.[subKey]);
      });
      return;
    }

    const fieldMeta = getFieldMeta(field);
    if (fieldMeta?.formRelated) {
      const section = fieldMeta.formRelated.section || "no-section";
      (sectionMap[section] ||= []).push({
        name,
        zodField: field,
        meta: fieldMeta,
      });
    }
  };

  (Object.entries(schema.shape) as [string, ZodType<any>][]).forEach(
    ([name, zodField]) => {
      addFieldToSectionMap(name, zodField, values[name]);
    }
  );

  return sectionMap;
};
