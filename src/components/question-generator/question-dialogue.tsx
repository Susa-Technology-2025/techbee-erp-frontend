"use client";
import React, { useMemo, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Question, Questions, questionSchema, answerTypes } from "./types";

type QuestionDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (question: Question) => void;
  question?: Question;
  existingQuestions: Questions;
};

const QuestionDialog: React.FC<QuestionDialogProps> = ({
  open,
  onClose,
  onSave,
  question,
  existingQuestions,
}) => {
  const defaultValues = useMemo(
    () =>
      question || {
        section: "",
        question: "",
        code: "",
        required: false,
        weighted: false,
        weight: null,
        answerType: "text",
        multipleChoices: [],
        allowMultipleChoice: false,
        defaultAnswer: null,
      },
    [question]
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<Question>({
    resolver: zodResolver(questionSchema),
    defaultValues,
  });

  const answerType = watch("answerType");
  const isWeighted = watch("weighted");

  const {
    fields: choiceFields,
    append: appendChoice,
    remove: removeChoice,
  } = useFieldArray({
    control,
    name: "multipleChoices",
  });

  const {
    fields: conditionFields,
    append: appendCondition,
    remove: removeCondition,
  } = useFieldArray({
    control,
    name: "conditions",
  });

  const handleAddChoice = () => {
    appendChoice("");
  };

  const handleAddCondition = () => {
    appendCondition({
      action: "show",
      questionId: "",
      operator: "equals",
      value: "",
    });
  };

  useEffect(() => {
    if (answerType !== "number") {
      reset((formValues) => ({
        ...formValues,
        min: null,
        max: null,
      }));
    }

    if (answerType !== "multiple-choice") {
      reset((formValues) => ({
        ...formValues,
        multipleChoices: [],
        allowMultipleChoice: false,
      }));
    }

    if (answerType !== "file") {
      reset((formValues) => ({
        ...formValues,
        fileTypes: null,
      }));
    }

    if (!isWeighted) {
      reset((formValues) => ({
        ...formValues,
        weight: null,
      }));
    }
  }, [answerType, isWeighted, reset]);

  const renderDefaultAnswerField = () => {
    switch (answerType) {
      case "text":
      case "email":
      case "date":
      case "time":
      case "date-time":
        return (
          <Grid size={{ xs: 12 }}>
            <Controller
              name="defaultAnswer"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Default Answer"
                  variant="outlined"
                  type={
                    answerType === "date-time" ? "datetime-local" : answerType
                  }
                />
              )}
            />
          </Grid>
        );
      case "number":
        return (
          <Grid size={{ xs: 12 }}>
            <Controller
              name="defaultAnswer"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Default Answer"
                  variant="outlined"
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value
                      ? Number(e.target.value)
                      : null;
                    field.onChange(value);
                  }}
                  value={field.value === null ? "" : field.value}
                />
              )}
            />
          </Grid>
        );
      case "true-false":
        return (
          <Grid size={{ xs: 12 }}>
            <Controller
              name="defaultAnswer"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value === true}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Default Answer"
                />
              )}
            />
          </Grid>
        );
      case "multiple-choice":
        return (
          <Grid size={{ xs: 12 }}>
            <Controller
              name="defaultAnswer"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="default-answer-label">
                    Default Answer
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="default-answer-label"
                    label="Default Answer"
                  >
                    {watch("multipleChoices", []).map((choice, index) => (
                      <MenuItem key={index} value={choice}>
                        {choice}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {question ? "Edit Question" : "Add New Question"}
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="question"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Question"
                    variant="outlined"
                    error={!!errors.question}
                    helperText={errors.question?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Code"
                    variant="outlined"
                    error={!!errors.code}
                    helperText={errors.code?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="section"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Section"
                    variant="outlined"
                    placeholder="ungrouped"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="answerType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.answerType}>
                    <InputLabel id="answer-type-label">Answer Type</InputLabel>
                    <Select
                      {...field}
                      labelId="answer-type-label"
                      label="Answer Type"
                    >
                      {answerTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.answerType && (
                      <FormHelperText>
                        {errors.answerType.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>{renderDefaultAnswerField()}</Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="required"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value === true}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Required"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="weighted"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value === true}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Weighted"
                  />
                )}
              />
            </Grid>

            {isWeighted && (
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="weight"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      fullWidth
                      label="Weight"
                      variant="outlined"
                      error={!!errors.weight}
                      helperText={errors.weight?.message}
                      onChange={(e) => {
                        const value = e.target.value
                          ? Number(e.target.value)
                          : null;
                        field.onChange(value);
                      }}
                      value={field.value === null ? "" : field.value}
                    />
                  )}
                />
              </Grid>
            )}

            {answerType === "multiple-choice" && (
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="allowMultipleChoice"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value === true}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label="Allow multiple choices"
                    />
                  )}
                />
              </Grid>
            )}

            {answerType === "multiple-choice" && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Choices
                </Typography>
                {choiceFields.map((field, index) => (
                  <Box key={field.id} sx={{ display: "flex", mb: 1 }}>
                    <Controller
                      name={`multipleChoices.${index}`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={`Choice ${index + 1}`}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                    <IconButton
                      color="error"
                      onClick={() => removeChoice(index)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddChoice}
                  sx={{ mt: 1 }}
                >
                  Add Choice
                </Button>
              </Grid>
            )}

            {answerType === "number" && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="min"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        fullWidth
                        label="Minimum Value"
                        variant="outlined"
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : null;
                          field.onChange(value);
                        }}
                        value={field.value === null ? "" : field.value}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="max"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        fullWidth
                        label="Maximum Value"
                        variant="outlined"
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : null;
                          field.onChange(value);
                        }}
                        value={field.value === null ? "" : field.value}
                      />
                    )}
                  />
                </Grid>
              </>
            )}

            {answerType === "file" && (
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="fileTypes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Accepted File Types (comma separated, e.g., .pdf,.doc,.jpg)"
                      variant="outlined"
                      onChange={(e) => {
                        const value = e.target.value
                          ? e.target.value.split(",").map((type) => type.trim())
                          : [];
                        field.onChange(value);
                      }}
                      value={(field.value || []).join(", ")}
                    />
                  )}
                />
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <Controller
                name="answerValidationMessage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Validation Message"
                    variant="outlined"
                    placeholder="Message to display when validation fails"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }} sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Conditions
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Add conditions to control how this question behaves based on
                other questions' answers.
              </Typography>

              {conditionFields.map((field, index) => (
                <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Controller
                        name={`conditions.${index}.action`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel id={`action-label-${index}`}>
                              Action
                            </InputLabel>
                            <Select
                              {...field}
                              labelId={`action-label-${index}`}
                              label="Action"
                            >
                              <MenuItem value="show">Show</MenuItem>
                              <MenuItem value="hide">Hide</MenuItem>
                              <MenuItem value="enable">Enable</MenuItem>
                              <MenuItem value="disable">Disable</MenuItem>
                              <MenuItem value="require">Require</MenuItem>
                              <MenuItem value="jumpTo">Jump To</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Controller
                        name={`conditions.${index}.questionId`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel id={`question-id-label-${index}`}>
                              Based on Question
                            </InputLabel>
                            <Select
                              {...field}
                              labelId={`question-id-label-${index}`}
                              label="Based on Question"
                            >
                              {existingQuestions.map((q, idx) => (
                                <MenuItem
                                  key={q.id || `question-${idx}`}
                                  value={q.id || `question-${idx}`}
                                >
                                  {q.questionNumber || idx + 1}: {q.question}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Controller
                        name={`conditions.${index}.operator`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel id={`operator-label-${index}`}>
                              Operator
                            </InputLabel>
                            <Select
                              {...field}
                              labelId={`operator-label-${index}`}
                              label="Operator"
                            >
                              <MenuItem value="equals">Equals</MenuItem>
                              <MenuItem value="notEquals">Not Equals</MenuItem>
                              <MenuItem value="contains">Contains</MenuItem>
                              <MenuItem value="greaterThan">
                                Greater Than
                              </MenuItem>
                              <MenuItem value="lessThan">Less Than</MenuItem>
                              <MenuItem value="isEmpty">Is Empty</MenuItem>
                              <MenuItem value="isNotEmpty">
                                Is Not Empty
                              </MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid
                      size={{ xs: 12, sm: 2 }}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Controller
                        name={`conditions.${index}.value`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Value"
                            disabled={
                              watch(`conditions.${index}.operator`) ===
                                "isEmpty" ||
                              watch(`conditions.${index}.operator`) ===
                                "isNotEmpty"
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid
                      size={{ xs: 12, sm: 1 }}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <IconButton
                        color="error"
                        onClick={() => removeCondition(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={handleAddCondition}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Add Condition
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSave, (errors) => {
            console.log(JSON.stringify(errors, null, 2));
          })}
          color="primary"
          variant="contained"
        >
          {question ? "Update" : "Add"} Question
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionDialog;
