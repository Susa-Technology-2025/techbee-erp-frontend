interface NestedObject {
  [key: string]: any;
}
const getNestedWriteAction = (
  nestedData: NestedObject
): "create" | "update" => {
  return nestedData.id ? "update" : "create";
};
const cleanNestedObject = (
  data: NestedObject,
  action: "create" | "update"
): NestedObject => {
  const cleaned: NestedObject = {};
  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
    const value = data[key];
    if (
      key === "createdAt" ||
      key === "updatedAt" ||
      key === "createdBy" ||
      key === "updatedBy"
    ) {
      continue;
    }
    if (value === null || value === undefined) {
      continue;
    }
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      const cleanedNested = cleanNestedObject(value, action);
      if (Object.keys(cleanedNested).length > 0) {
        cleaned[key] = cleanedNested;
      }
    } else {
      cleaned[key] = value;
    }
  }
  if (action === "create") {
    delete cleaned.id;
  }
  return cleaned;
};
const isTargetListWriteOperation = (value: NestedObject): boolean => {
  const keys = Object.keys(value);
  return keys.some((key) => key === "create" || key === "update");
};
export const transformToPrismaInput = (data: NestedObject): NestedObject => {
  const result: NestedObject = {};
  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
    const value = data[key];
    if (
      key === "createdAt" ||
      key === "updatedAt" ||
      key === "createdBy" ||
      key === "updatedBy"
    ) {
      continue;
    }
    if (value === null || value === undefined) {
      continue;
    }
    if (Array.isArray(value)) {
      const arrayContainsObjects = value.every(
        (item) => typeof item === "object" && item !== null
      );
      if (arrayContainsObjects) {
        const createItems: NestedObject[] = [];
        const updateItems: NestedObject[] = [];
        value.forEach((item) => {
          if (item.id) {
            const cleanedData = cleanNestedObject(item, "update");
            delete cleanedData.id;
            if (Object.keys(cleanedData).length > 0) {
              updateItems.push({
                where: { id: item.id },
                data: cleanedData,
              });
            }
          } else {
            const cleanedData = cleanNestedObject(item, "create");
            if (Object.keys(cleanedData).length > 0) {
              createItems.push(cleanedData);
            }
          }
        });
        const operation: NestedObject = {};
        if (createItems.length > 0) {
          operation.create = createItems;
        }
        if (updateItems.length > 0) {
          operation.update = updateItems;
        }
        if (Object.keys(operation).length > 0) {
          result[key] = operation;
        }
        continue;
      }
    }
    const isNestedObject =
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date);
    if (isNestedObject) {
      if (key === "metadata") {
        result[key] = value;
        continue;
      }
      if (isTargetListWriteOperation(value)) {
        const cleanedOperations: NestedObject = {};
        for (const opKey of ["create", "update"]) {
          const opValue = value[opKey];
          if (opValue && Array.isArray(opValue)) {
            cleanedOperations[opKey] = opValue
              .map((item) => {
                if (opKey === "create") {
                  return cleanNestedObject(item, "create");
                } else if (opKey === "update") {
                  if (item.data) {
                    return {
                      where: item.where,
                      data: cleanNestedObject(item.data, "update"),
                    };
                  }
                  return item;
                }
                return item;
              })
              .filter((item) => {
                if (opKey === "update") {
                  return item.data && Object.keys(item.data).length > 0;
                }
                return (
                  typeof item === "object" &&
                  item !== null &&
                  Object.keys(item).length > 0
                );
              });
            if (cleanedOperations[opKey].length === 0) {
              delete cleanedOperations[opKey];
            }
          }
        }
        if (Object.keys(cleanedOperations).length > 0) {
          result[key] = cleanedOperations;
        }
        continue;
      }
      const keys = Object.keys(value);
      if (keys.length === 1 && keys[0] === "id") {
        result[key] = { connect: value };
        continue;
      }
      const action = getNestedWriteAction(value);
      const cleanedNestedObject = cleanNestedObject(value, action);
      if (Object.keys(cleanedNestedObject).length > 0) {
        result[key] = { [action]: cleanedNestedObject };
      }
    } else {
      result[key] = value;
    }
  }
  const finalResult: NestedObject = {};
  for (const key in result) {
    if (!Object.prototype.hasOwnProperty.call(result, key)) continue;
    const value = result[key];
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      Object.keys(value).length === 1 &&
      Object.keys(value)[0] === "connect"
    ) {
      const connectValue = value.connect;
      if (
        typeof connectValue === "object" &&
        connectValue !== null &&
        !Array.isArray(connectValue) &&
        Object.keys(connectValue).length === 1 &&
        Object.keys(connectValue)[0] === "id"
      ) {
        finalResult[key] = connectValue;
        continue;
      }
    }
    finalResult[key] = value;
  }
  return finalResult;
};