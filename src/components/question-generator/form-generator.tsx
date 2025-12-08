import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  Box,
  FormHelperText,
  Paper,
  Checkbox,
  FormGroup,
  Grid,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Question, Questions } from "./types";

interface FormGeneratorProps {
  questions: Questions;
}

export const FormGenerator: React.FC<FormGeneratorProps> = ({ questions }) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const formValues = watch();

  const evaluateCondition = (condition) => {
    const targetQuestion = questions.find((q) => q.id === condition.questionId);
    if (!targetQuestion) return false;

    const targetQuestionId =
      targetQuestion.id || `question_${questions.indexOf(targetQuestion)}`;
    const targetValue = formValues[targetQuestionId];
    let conditionMet = false;

    switch (condition.operator) {
      case "equals":
        conditionMet = targetValue === condition.value;
        break;
      case "notEquals":
        conditionMet = targetValue !== condition.value;
        break;
      case "contains":
        conditionMet =
          (typeof targetValue === "string" &&
            targetValue.includes(String(condition.value))) ||
          (Array.isArray(targetValue) && targetValue.includes(condition.value));
        break;
      case "greaterThan":
        conditionMet = Number(targetValue) > Number(condition.value);
        break;
      case "lessThan":
        conditionMet = Number(targetValue) < Number(condition.value);
        break;
      case "isEmpty":
        conditionMet =
          targetValue === null ||
          targetValue === "" ||
          targetValue === undefined ||
          (Array.isArray(targetValue) && targetValue.length === 0);
        break;
      case "isNotEmpty":
        conditionMet =
          targetValue !== null &&
          targetValue !== "" &&
          targetValue !== undefined &&
          !(Array.isArray(targetValue) && targetValue.length === 0);
        break;
      default:
        conditionMet = false;
        break;
    }
    return conditionMet;
  };

  const shouldShowQuestion = (question: Question): boolean => {
    if (!question.conditions || question.conditions.length === 0) {
      return true;
    }

    return question.conditions.every((condition) => {
      const conditionMet = evaluateCondition(condition);
      switch (condition.action) {
        case "show":
          return conditionMet;
        case "hide":
          return !conditionMet;
        default:
          return true;
      }
    });
  };

  const isQuestionDisabled = (question: Question): boolean => {
    if (!question.conditions || question.conditions.length === 0) {
      return false;
    }

    return question.conditions.some((condition) => {
      const conditionMet = evaluateCondition(condition);
      switch (condition.action) {
        case "disable":
          return conditionMet;
        case "enable":
          return !conditionMet;
        default:
          return false;
      }
    });
  };

  const isQuestionRequired = (question: Question): boolean => {
    if (question.required) {
      return true;
    }

    if (!question.conditions || question.conditions.length === 0) {
      return false;
    }

    return question.conditions.some((condition) => {
      return condition.action === "require" && evaluateCondition(condition);
    });
  };

  const renderFormField = (question: Question) => {
    const fieldId = question.id || `question_${questions.indexOf(question)}`;
    const isRequired = isQuestionRequired(question);
    const isDisabled = isQuestionDisabled(question);

    switch (question.answerType) {
      case "text":
      case "number":
        return (
          <Controller
            name={fieldId}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type={question.answerType === "number" ? "number" : "text"}
                variant="outlined"
                fullWidth
                margin="normal"
                required={isRequired}
                disabled={isDisabled}
                error={!!errors[fieldId]}
                helperText={errors[fieldId]?.message as string}
                value={field.value === null ? "" : field.value}
              />
            )}
          />
        );
      case "multiple-choice":
        if (question.allowMultipleChoice) {
          return (
            <Controller
              name={fieldId}
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  required={isRequired}
                  error={!!errors[fieldId]}
                  disabled={isDisabled}
                >
                  <FormGroup>
                    {question.multipleChoices?.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            {...field}
                            value={option}
                            checked={
                              Array.isArray(field.value)
                                ? field.value.includes(option)
                                : false
                            }
                            onChange={(e) => {
                              const newValues = e.target.checked
                                ? [
                                    ...(Array.isArray(field.value)
                                      ? field.value
                                      : []),
                                    option,
                                  ]
                                : (Array.isArray(field.value)
                                    ? field.value
                                    : []
                                  ).filter((v) => v !== option);
                              field.onChange(newValues);
                            }}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </FormGroup>
                  {errors[fieldId] && (
                    <FormHelperText>
                      {errors[fieldId]?.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          );
        } else {
          return (
            <Controller
              name={fieldId}
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  required={isRequired}
                  error={!!errors[fieldId]}
                  disabled={isDisabled}
                >
                  <RadioGroup {...field}>
                    {question.multipleChoices?.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                  {errors[fieldId] && (
                    <FormHelperText>
                      {errors[fieldId]?.message as string}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          );
        }
      case "true-false":
        return (
          <Controller
            name={fieldId}
            control={control}
            render={({ field }) => (
              <FormControl
                fullWidth
                margin="normal"
                required={isRequired}
                error={!!errors[fieldId]}
                disabled={isDisabled}
              >
                <RadioGroup
                  {...field}
                  value={
                    field.value === null
                      ? ""
                      : field.value === true
                      ? "true"
                      : "false"
                  }
                  onChange={(e) =>
                    field.onChange(e.target.value === "true" ? true : false)
                  }
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="True"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="False"
                  />
                </RadioGroup>
                {errors[fieldId] && (
                  <FormHelperText>
                    {errors[fieldId]?.message as string}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        );
      case "date":
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name={fieldId}
              control={control}
              render={({ field: { onChange, value, ...restField } }) => (
                <DatePicker
                  {...restField}
                  value={value || null}
                  onChange={(date) => onChange(date)}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                      margin: "normal",
                      required: isRequired,
                      disabled: isDisabled,
                      error: !!errors[fieldId],
                      helperText: errors[fieldId]?.message as string,
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        );
      case "time":
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name={fieldId}
              control={control}
              render={({ field: { onChange, value, ...restField } }) => (
                <TimePicker
                  {...restField}
                  value={value || null}
                  onChange={(time) => onChange(time)}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                      margin: "normal",
                      required: isRequired,
                      disabled: isDisabled,
                      error: !!errors[fieldId],
                      helperText: errors[fieldId]?.message as string,
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        );
      case "date-time":
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name={fieldId}
              control={control}
              render={({ field: { onChange, value, ...restField } }) => (
                <DateTimePicker
                  {...restField}
                  value={value || null}
                  onChange={(dateTime) => onChange(dateTime)}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                      margin: "normal",
                      required: isRequired,
                      disabled: isDisabled,
                      error: !!errors[fieldId],
                      helperText: errors[fieldId]?.message as string,
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        );
      case "file":
        return (
          <Controller
            name={fieldId}
            control={control}
            render={({ field: { value, onChange, ...restField } }) => (
              <FormControl
                fullWidth
                margin="normal"
                error={!!errors[fieldId]}
                disabled={isDisabled}
              >
                <input
                  type="file"
                  onChange={(e) => onChange(e.target.files?.[0])}
                  {...restField}
                />
                {errors[fieldId] && (
                  <FormHelperText>
                    {errors[fieldId]?.message as string}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        );
      default:
        return null;
    }
  };

  let questionCounter = 0;

  const groupedQuestions = questions.reduce((acc, question) => {
    const section = question.section || "ungrouped";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(question);
    return acc;
  }, {});

  return (
    <Box sx={{ overflow: "auto", height: "100%" }}>
      {Object.entries(groupedQuestions).map(([section, sectionQuestions]) => (
        <Paper key={section} sx={{ p: 3, mb: 3 }}>
          {section !== "ungrouped" && (
            <Typography variant="h6" gutterBottom>
              {section}
            </Typography>
          )}
          <Grid container spacing={3}>
            {sectionQuestions.map((question) => {
              if (shouldShowQuestion(question)) {
                questionCounter++;
                return (
                  <Grid
                    size={{ xs: 12, md: 6 }}
                    key={
                      question.id || `question_${questions.indexOf(question)}`
                    }
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      {`${questionCounter}. ${question.question}`}
                    </Typography>
                    {renderFormField(question)}
                  </Grid>
                );
              }
              return null;
            })}
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};
