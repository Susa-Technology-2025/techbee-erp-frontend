import { Grid, Paper, TextField, IconButton, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormContext, Controller } from "react-hook-form";
import { z } from "zod";
import { LandingPageSchema } from "@/lib/schemas/core/landing-page";

type LandingPageFormValues = z.infer<typeof LandingPageSchema>;

interface NestedFieldProps {
  index: number;
  onRemove: () => void;
}

export function AnnouncementFields({ index, onRemove }: NestedFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<LandingPageFormValues>();
  const baseName = `announcements.${index}` as const;

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, mb: 2, border: 1, borderColor: "grey.200", borderRadius: 2 }}
    >
      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 5 }}>
          <Controller
            name={`${baseName}.title`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={`Announcement #${index + 1} Title`}
                fullWidth
                variant="standard"
                error={!!(errors.announcements?.[index] as any)?.title}
                helperText={
                  (errors.announcements?.[index] as any)?.title?.message
                }
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Controller
            name={`${baseName}.message`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Message"
                fullWidth
                variant="standard"
                error={!!(errors.announcements?.[index] as any)?.message}
                helperText={
                  (errors.announcements?.[index] as any)?.message?.message
                }
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 1 }}>
          <Controller
            name={`${baseName}.sortOrder`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Order"
                type="number"
                fullWidth
                variant="standard"
                error={!!(errors.announcements?.[index] as any)?.sortOrder}
                helperText={
                  (errors.announcements?.[index] as any)?.sortOrder?.message
                }
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 1 }}
          sx={{ display: "flex", justifyContent: "center", pt: 1 }}
        >
          <IconButton
            onClick={onRemove}
            color="error"
            aria-label="remove announcement"
            size="medium"
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
}

export function InsightFields({ index, onRemove }: NestedFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<LandingPageFormValues>();
  const baseName = `insights.${index}` as const;

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, mb: 2, border: 1, borderColor: "grey.200", borderRadius: 2 }}
    >
      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 5 }}>
          <Controller
            name={`${baseName}.title`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={`Insight #${index + 1} Title`}
                fullWidth
                variant="standard"
                error={!!(errors.insights?.[index] as any)?.title}
                helperText={(errors.insights?.[index] as any)?.title?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Controller
            name={`${baseName}.message`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Message"
                fullWidth
                variant="standard"
                error={!!(errors.insights?.[index] as any)?.message}
                helperText={(errors.insights?.[index] as any)?.message?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 1 }}>
          <Controller
            name={`${baseName}.sortOrder`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Order"
                type="number"
                fullWidth
                variant="standard"
                error={!!(errors.insights?.[index] as any)?.sortOrder}
                helperText={
                  (errors.insights?.[index] as any)?.sortOrder?.message
                }
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 1 }}
          sx={{ display: "flex", justifyContent: "center", pt: 1 }}
        >
          <IconButton
            onClick={onRemove}
            color="error"
            aria-label="remove insight"
            size="medium"
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
}

export function TutorialFields({ index, onRemove }: NestedFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<LandingPageFormValues>();
  const baseName = `tutorials.${index}` as const;

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, mb: 2, border: 1, borderColor: "grey.200", borderRadius: 2 }}
    >
      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 5 }}>
          <Controller
            name={`${baseName}.title`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={`Tutorial #${index + 1} Title`}
                fullWidth
                variant="standard"
                error={!!(errors.tutorials?.[index] as any)?.title}
                helperText={(errors.tutorials?.[index] as any)?.title?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Controller
            name={`${baseName}.url`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="URL"
                fullWidth
                variant="standard"
                error={!!(errors.tutorials?.[index] as any)?.url}
                helperText={(errors.tutorials?.[index] as any)?.url?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 1 }}>
          <Controller
            name={`${baseName}.sortOrder`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Order"
                type="number"
                fullWidth
                variant="standard"
                error={!!(errors.tutorials?.[index] as any)?.sortOrder}
                helperText={
                  (errors.tutorials?.[index] as any)?.sortOrder?.message
                }
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 1 }}
          sx={{ display: "flex", justifyContent: "center", pt: 1 }}
        >
          <IconButton
            onClick={onRemove}
            color="error"
            aria-label="remove tutorial"
            size="medium"
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
}
