import { MoreVert } from "@mui/icons-material";
import { IconButton, useTheme } from "@mui/material";

type TaskMenuButtonProps = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

export function TaskMenuButton({ onClick }: TaskMenuButtonProps) {
  const theme = useTheme();

  return (
    <IconButton
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        background: "none",
        position: "absolute",
        top: 8,
        right: 3,
        border: "none",
        padding: theme.spacing(0.3),
        color: theme.palette.text.disabled,
        cursor: "pointer",
        fontSize: "1rem",
        lineHeight: 1,
      }}
    >
      <MoreVert fontSize="small" />
    </IconButton>
  );
}
