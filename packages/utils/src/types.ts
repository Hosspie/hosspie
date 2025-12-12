export type IGender = 'male' | 'female' | 'regardless';

export type IDinnerParty = 'POT_LUCK' | 'HOST_SERVED' | 'CUSTOM';

export interface IRoom {
  capacity: number;
  gender: IGender;
  name: string;
  hasBathroom: boolean;
}
