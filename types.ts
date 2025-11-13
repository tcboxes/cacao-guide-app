export enum Screen {
  Welcome,
  Intention,
  Preparation,
  Ceremony,
  Closing,
}

export interface CeremonyStep {
  title: string;
  description: string;
}
