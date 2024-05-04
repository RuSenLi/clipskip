export interface SelectedOption {
  url: string;
  label: string;
}

export interface ComboboxOption {
  label: string;
  value: string;
}

export interface TimeLineOption {
  label?: string;
  second?: string | number;
  startTime: string;
  endTime: string;
}

export type PageOption = {
  id: string;
  comboboxOption: ComboboxOption;
  timeLineOptions?: TimeLineOption[];
}
