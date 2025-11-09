
import type React from 'react';

export interface Message {
  id: number;
  sender: 'bot' | 'user';
  text?: string;
  component?: React.ReactNode;
  options?: string[];
  inputType?: 'text' | 'tel' | 'email' | 'number';
  validation?: (input: string) => boolean;
  errorMessage?: string;
}

export interface UserData {
  name: string;
  phone: string;
  email: string;
  planType: 'PME' | 'Individual/Familiar' | null;
  age: string;
  hasPreviousPlan: 'Sim' | 'Não' | null;
  dependents: string;
}

export enum ConversationStep {
  GREETING,
  GET_NAME,
  GET_PHONE,
  GET_EMAIL,
  GET_PLAN_TYPE,
  GET_AGE,
  GET_DEPENDENTS_PROMPT,
  GET_DEPENDENTS_AGE,
  GET_PREVIOUS_PLAN,
  SHOW_PLANS,
  SHOW_PROMOTION,
  SHOW_DIFFERENTIALS,
  NEXT_STEP,
  SCHEDULE_CALL,
  HANDLE_DOUBTS,
  SUMMARY,
  END,
}
