import { StructureRule } from "./structure-rule-schema";

export interface StructureRuleCardProps {
  card: StructureRule & { selected: boolean; editing: boolean };
  editingValues: Record<string, any>;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDeleteRequest: (item: StructureRule) => void;
  onEditFieldChange: (id: string, field: string, value: any) => void;
  onSave: (id: string) => void;
  onCancel: (id: string) => void;
  codeColors?: Record<string, any>;
  isSaving?: boolean;
  isDeleting?: boolean;
}
