export type CardType = {
    id: string;
    name: string;
    code: string;
    description: string;
    selected: boolean;
    editing: boolean;
  };

  export type RuleCategoryCardProps = {
    card: CardType;
    editingValues: Record<string, { name: string; code: string; description: string }>;
    // codeColors: Record<string, 'primary' | 'success' | 'warning'>;
    onSelect: (id: string) => void;
    onEdit: (id: string) => void;
    onDeleteRequest: (card: CardType) => void;
    onEditFieldChange: (id: string, field: 'name' | 'code' | 'description', value: string) => void;
    onSave: (id: string) => void;
    onCancel: (id: string) => void;
    isSaving?: boolean;
    isDeleting?: boolean;
  };