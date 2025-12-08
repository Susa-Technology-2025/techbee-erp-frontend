import {
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Divider,
} from "@mui/material";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { LandingPageSchema } from "@/lib/schemas/core/landing-page";
import FileUploadWithPreview from "@/components/ReusableFormDrawer/file-upload";
type LandingPageFormValues = z.infer<typeof LandingPageSchema>;
export function LandingPageFields() {
  const {
    control,
    formState: { errors, defaultValues },
  } = useFormContext<LandingPageFormValues>();
  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <Box
      sx={{ mb: 4, p: 3, border: 1, borderColor: "grey.200", borderRadius: 2 }}
    >
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {children}
    </Box>
  );
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Section title="Page Details & SEO">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <FileUploadWithPreview
                folder="logos"
                fileName={`lanidng-page-logo-${defaultValues?.code}`}
                watchField="logo"
                acceptedFileTypes={["image/*"]}
                label="Logo"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FileUploadWithPreview
                folder="logos"
                fileName={`auth-background-image-${defaultValues?.code}`}
                watchField="backgroundImage"
                acceptedFileTypes={["image/*"]}
                label="Background Image"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Page Name"
                    fullWidth
                    variant="standard"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Unique Code (e.g., HOME)"
                    fullWidth
                    variant="standard"
                    error={!!errors.code}
                    helperText={errors.code?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="headline"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Headline"
                    fullWidth
                    variant="standard"
                    error={!!errors.headline}
                    helperText={errors.headline?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    multiline
                    rows={2}
                    fullWidth
                    variant="standard"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Priority"
                    type="number"
                    fullWidth
                    variant="standard"
                    error={!!errors.priority}
                    helperText={errors.priority?.message}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    value={field.value || 0}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="isPublished"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Is Published"
                    sx={{ mt: 1 }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Section>
      </Grid>
    </Grid>
  );
}
