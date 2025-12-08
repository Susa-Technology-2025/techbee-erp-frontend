import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Paper,
  Typography,
  Chip,
  IconButton,
  Divider,
  Alert,
  TextField,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  useTheme,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Menu,
  Skeleton,
  Grid,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  DragIndicator as DragIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  FilterAlt as FilterAltIcon,
  Add,
} from "@mui/icons-material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { z } from "zod";
import QuestionDialog from "./question-dialogue";
import { questionSchema, Questions } from "./types";
import { useDataMutation } from "@/lib/tanstack/useDataQuery";

const questionsSchema = z.array(questionSchema);

const answerTypes = [
  { value: "text", label: "Text", icon: "text_format" },
  { value: "number", label: "Number", icon: "tag" },
  { value: "date", label: "Date", icon: "calendar_today" },
  { value: "time", label: "Time", icon: "schedule" },
  { value: "date-time", label: "Date and Time", icon: "event" },
  { value: "email", label: "Email", icon: "email" },
  { value: "multiple-choice", label: "Multiple Choice", icon: "list" },
  { value: "true-false", label: "True/False", icon: "check_box" },
  { value: "file", label: "File", icon: "attachment" },
];

type QuestionFormProps = {
  initialTemplate?: {
    id?: string;
    title?: string;
    code?: string;
    description?: string;
    questions: Questions;
  };
  onSave?: (questions: Questions) => void;
  apiEndpoint?: string;
};

const SortableQuestionItem = ({
  field,
  index,
  handleEditQuestion,
  handleDeleteQuestion,
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
    margin: 0,
    padding: 0,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      elevation={isDragging ? 12 : 0}
      sx={{
        background: "transparent",
        p: 0,
        m: 0,
      }}
    >
      <CardContent
        sx={{
          p: 0,
          m: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "start", gap: 1, flex: 1 }}>
            <DragIcon
              sx={{ cursor: "grab", color: "text.secondary" }}
              {...attributes}
              {...listeners}
            />
            <Typography
              sx={{
                fontWeight: "small",
                wordBreak: "break-word",
              }}
            >
              {`${index + 1}. ${field.question}`}
              {field.required && (
                <Typography
                  component="span"
                  color="error"
                  sx={{ ml: 0.5, fontWeight: "bold" }}
                >
                  *
                </Typography>
              )}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
            <Chip
              label={
                answerTypes.find((type) => type.value === field.answerType)
                  ?.label || field.answerType
              }
              color="primary"
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 1,
                fontWeight: "small",
              }}
            />
            {field.section && field.section !== "ungrouped" && (
              <Tooltip title={`Section: ${field.section}`}>
                <Chip
                  label={field.section}
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              </Tooltip>
            )}
            <Tooltip title="Edit question">
              <IconButton
                color="primary"
                onClick={() => handleEditQuestion(index)}
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete question">
              <IconButton
                color="error"
                onClick={() => handleDeleteQuestion(index)}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {field.conditions && field.conditions.length > 0 && (
          <Tooltip title={`Has ${field.conditions.length} condition(s)`}>
            <Chip
              icon={<FilterIcon fontSize="small" />}
              label={`${field.conditions.length} condition${
                field.conditions.length > 1 ? "s" : ""
              }`}
              size="small"
              color="info"
              variant="outlined"
              sx={{ mt: 1, borderRadius: 1 }}
            />
          </Tooltip>
        )}
        {field.multipleChoices && field.multipleChoices.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              sx={{ display: "flex", gap: 3, pl: 5 }}
            >
              {field.multipleChoices.map((choice, choiceIndex) => (
                <Typography key={choiceIndex}>{`${
                  choiceIndex + 1
                }. ${choice}`}</Typography>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const QuestionBuilder: React.FC<QuestionFormProps> = ({
  initialTemplate,
  onSave,
  apiEndpoint = "https://api.techbee.et/api/hr/templates",
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [title, setTitle] = useState(initialTemplate?.title || "");
  const [code, setCode] = useState(initialTemplate?.code || "");
  const [description, setDescription] = useState(
    initialTemplate?.description || ""
  );

  const { mutate, isPending } = useDataMutation<Questions>({
    apiEndPoint: initialTemplate?.id
      ? `${apiEndpoint}/${initialTemplate.id}`
      : apiEndpoint,
    method: initialTemplate?.id ? "PATCH" : "POST",
    onSuccess: (data) => {
      showSnackbar("Questions saved successfully!", "success");
    },
    onError: (error) => {
      showSnackbar(`Failed to save questions: ${error.message}`, "error");
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const theme = useTheme();
  const { control, handleSubmit, watch, getValues, reset } = useForm<{
    questions: Questions;
  }>({
    resolver: zodResolver(z.object({ questions: questionsSchema })),
    defaultValues: {
      questions: initialTemplate?.questions || [],
    },
  });

  const { fields, append, remove, move, update, replace } = useFieldArray({
    control,
    name: "questions",
  });

  const questions = watch("questions");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const sections = [
    "all",
    ...Array.from(new Set(questions.map((q) => q.section || "ungrouped"))),
  ];

  const filteredQuestions = fields.filter((field) => {
    let matchesSearch = true;
    let matchesType = true;
    let matchesSection = true;

    if (searchQuery) {
      matchesSearch =
        field.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (field.section &&
          field.section.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (filterType) {
      matchesType = field.answerType === filterType;
    }

    if (selectedSection !== "all") {
      matchesSection = field.section === selectedSection;
    }

    return matchesSearch && matchesType && matchesSection;
  });

  const handleAddQuestion = () => {
    setEditingIndex(null);
    setOpenDialog(true);
  };

  const handleEditQuestion = (index: number) => {
    setEditingIndex(index);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingIndex(null);
  };

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    handleFilterMenuClose();
  };

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSaveQuestion = (question: any) => {
    if (editingIndex !== null) {
      update(editingIndex, {
        ...question,
      });
      showSnackbar("Question updated successfully", "success");
    } else {
      append({
        ...question,
      });
      showSnackbar("Question added successfully", "success");
    }
    handleCloseDialog();
  };

  const handleDeleteQuestion = (index: number) => {
    remove(index);
    showSnackbar("Question removed", "info");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);

      replace(arrayMove(fields, oldIndex, newIndex));

      showSnackbar("Question reordered", "info");
    }
  };

  const onSubmit = () => {
    const payload = {
      title,
      questions,
      description,
      code,
    };
    mutate(payload);
  };

  const dialogKey =
    editingIndex !== null
      ? questions[editingIndex]?.id || `edit-${editingIndex}`
      : `add-${fields.length}`;

  return (
    <>
      <Box
        sx={{
          width: "90%",
          p: 3,
          position: "relative",
          bgcolor: "backgroundSection.main",
          mx: "auto",
          borderRadius: 2,
        }}
      >
        <Card
          component="form"
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="Title"
            value={title}
            variant="standard"
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Code"
            variant="standard"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <TextField
            label="description"
            variant="standard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Card>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 2,
            background: "transparent",
            px: 2,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 1 },
              },
            }}
            variant="standard"
            size="small"
          />
          <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
              <Select
                value={selectedSection}
                onChange={(e) => handleSectionChange(e.target.value as string)}
                displayEmpty
                sx={{ borderRadius: 1 }}
                variant="standard"
              >
                {sections.map((section) => (
                  <MenuItem key={section} value={section}>
                    {section === "all"
                      ? "All Sections"
                      : section === "ungrouped"
                      ? "Ungrouped"
                      : section}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {(filterType || selectedSection !== "all" || searchQuery) && (
              <Tooltip title="Clear filters">
                <IconButton
                  onClick={() => {
                    setFilterType("");
                    setSelectedSection("all");
                    setSearchQuery("");
                  }}
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            )}{" "}
            <Button
              startIcon={<FilterAltIcon />}
              onClick={handleFilterMenuOpen}
              color="primary"
              variant={filterType ? "contained" : "outlined"}
              size="small"
            >
              {filterType
                ? answerTypes.find((t) => t.value === filterType)?.label
                : "Type"}
            </Button>
          </Box>
        </Paper>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleFilterMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={() => handleFilterChange("")}>
            <Typography color="primary" sx={{ fontWeight: "bold" }}>
              All Types
            </Typography>
          </MenuItem>
          <Divider />
          {answerTypes.map((type) => (
            <MenuItem
              key={type.value}
              onClick={() => handleFilterChange(type.value)}
            >
              {type.label}
            </MenuItem>
          ))}
        </Menu>
        {loading ? (
          <Box sx={{ mb: 4 }}>
            {[1, 2, 3].map((item) => (
              <Card key={item} sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="80%" height={24} />
                </CardContent>
              </Card>
            ))}
            <CardActions>
              <Skeleton variant="rectangular" width={120} height={36} />
            </CardActions>
          </Box>
        ) : fields.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 6,
              my: 3,
              textAlign: "center",
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              border: `1px dashed ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <InfoIcon color="primary" sx={{ fontSize: 64, opacity: 0.7 }} />
            </Box>
            <Typography variant="h6" color="text.primary" gutterBottom>
              No questions added yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get started by clicking the plus button to create your first
              question.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
            >
              Add First Question
            </Button>
          </Paper>
        ) : filteredQuestions.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              my: 3,
              textAlign: "center",
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No matching questions found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search or filters
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ p: 2, maxHeight: "60vh", overflowY: "auto" }}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredQuestions.map((field) => {
                  const originalIndex = fields.findIndex(
                    (item) => item.id === field.id
                  );
                  return (
                    <SortableQuestionItem
                      key={field.id}
                      field={field}
                      index={originalIndex}
                      handleEditQuestion={handleEditQuestion}
                      handleDeleteQuestion={handleDeleteQuestion}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          </Box>
        )}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            position: "sticky",
            bottom: theme.spacing(2),
            // background: "transparent",
            zIndex: 5,
          }}
        >
          <Box>
            <Tooltip title="Add new question" sx={{ justifySelf: "flex-end" }}>
              <IconButton
                sx={{ bgcolor: "section.main", color: "section.contrastText" }}
                onClick={handleAddQuestion}
              >
                <Add />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="subtitle1" color="text.secondary">
            {fields.length} {fields.length > 1 ? "questions" : "question"}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to clear all questions?"
                  )
                ) {
                  reset({ questions: [] });
                  showSnackbar("All questions cleared", "info");
                }
              }}
              disabled={isPending || fields.length === 0}
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={onSubmit}
              disabled={fields.length === 0 || !title || !code || isPending}
              sx={{
                position: "relative",
                minWidth: 120,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
              }}
            >
              {isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "save"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
      {openDialog && (
        <QuestionDialog
          key={dialogKey}
          open={openDialog}
          onClose={handleCloseDialog}
          onSave={handleSaveQuestion}
          question={
            editingIndex !== null
              ? getValues(`questions.${editingIndex}`)
              : undefined
          }
          existingQuestions={questions}
        />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 1 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default QuestionBuilder;
