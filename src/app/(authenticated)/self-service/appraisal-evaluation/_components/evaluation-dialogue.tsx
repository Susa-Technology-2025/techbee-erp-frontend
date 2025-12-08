"use client";

import { Box, Typography, Button, Modal, Grid, Chip } from "@mui/material";
import { Assessment as AssessmentIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { ReusableFormModal } from "@/components/form-table/reusable-form/form-modal";
import { appraisalEvaluationSchema } from "@/lib/schemas/performance";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import { useDispatch, useSelector } from "react-redux";
import { setAdditionalQuestions } from "@/lib/store/question-slice";
import { RootState } from "@/lib/store/store";

interface AppraisalPlan {
  id: string;
  name: string;
  approvalStatus: string;
  type: string;
  periodStart: string;
  periodEnd: string;
  employee: {
    firstName: string;
    fatherName: string;
  };
  reviewer: {
    firstName: string;
    fatherName: string;
  };
}

interface EvaluationDialogProps {
  open: boolean;
  onClose: () => void;
  plan: AppraisalPlan | null;
}

const EvaluationDialog = ({ open, onClose, plan }: EvaluationDialogProps) => {
  const { data: { data: templates } = [], isLoading: templateLoading } =
    useDataQuery<any>({
      apiEndPoint: "https://api.techbee.et/api/hr/templates",
    });
  const [empId, setEmpId] = useState(null);
  const session = useSelector((state: RootState) => state.session);
  useEffect(() => {
    if (session?.user?.employeeId) {
      setEmpId(session.user.employeeId);
    }
  }, [session]);

  const dispatch = useDispatch();
  const selectedTemplate =
    templates?.find((t) => t.id === plan?.templateId) || null;

  useEffect(() => {
    if (selectedTemplate) {
      dispatch(setAdditionalQuestions(selectedTemplate.questions));
    }
  }, [selectedTemplate, dispatch]);
  return (
    <ReusableFormModal
      schema={appraisalEvaluationSchema}
      title={"Appraisal self evaluation Form"}
      formMode="create"
      defaultValues={{
        plan: { id: plan?.id },
        evaluatorEmployee: { id: empId },
        evaluationType: "Self",
        // candidate: { firstName, fatherName: lastName },
      }}
      disabledValues={{
        "plan.id": true,
        "evaluatorEmployee.id": true,
        evaluationType: true,
      }}
      sections={appraisalEvaluationSchema.meta().sections}
      onClose={onClose}
      open={open}
    />
  );
};

export default EvaluationDialog;
