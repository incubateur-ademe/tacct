"use client";

import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";

interface Props {
  legend: string;
  options: Array<{
    label: string;
    nativeInputProps: { checked: boolean; onChange: () => void };
  }>;
}

export const RadioButton: React.FC<Props> = ({ legend, options }: Props) => {
  return <RadioButtons legend={legend} name="radio" options={options} />;
};
