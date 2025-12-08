import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Questions } from "@/components/question-generator/types";

interface QuestionState {
  questions: Questions;
}

const initialState: QuestionState = {
  questions: [],
};

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setAdditionalQuestions(state, action: PayloadAction<Questions>) {
      state.questions = action.payload;
    },
  },
});

export const { setAdditionalQuestions } = questionSlice.actions;

export default questionSlice.reducer;
