export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type CreateGuesthouseInput = {
  address: Scalars['String']['input'];
  description: Scalars['String']['input'];
  dinnerPartyDescription?: InputMaybe<Scalars['String']['input']>;
  dinnerPartyType: DinnerPartyType;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  rooms: Array<CreateRoomInput>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreateRoomInput = {
  capacity: Scalars['Int']['input'];
  gender: Gender;
  hasBathroom: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

/** Type of dinner party offered */
export type DinnerPartyType =
  | 'CUSTOM'
  | 'HOST_SERVED'
  | 'POT_LUCK';

/** Gender restriction for room */
export type Gender =
  | 'FEMALE'
  | 'MALE'
  | 'REGARDLESS';

export type Guesthouse = {
  address: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  dinnerPartyDescription?: Maybe<Scalars['String']['output']>;
  dinnerPartyType: DinnerPartyType;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  onboardingStatus: OnboardingStatus;
  phone: Scalars['String']['output'];
  rooms: Array<Room>;
  updatedAt: Scalars['DateTime']['output'];
  website?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  createOnboarding: Guesthouse;
  updateGuesthouse: Guesthouse;
};


export type MutationCreateOnboardingArgs = {
  input: CreateGuesthouseInput;
};


export type MutationUpdateGuesthouseArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGuesthouseInput;
};

/** Onboarding completion status */
export type OnboardingStatus =
  | 'COMPLETED'
  | 'PENDING';

export type OnboardingStatusResponse = {
  isCompleted: Scalars['Boolean']['output'];
};

export type Query = {
  guesthouse: Guesthouse;
  myGuesthouse?: Maybe<Guesthouse>;
  onboardingStatus: OnboardingStatusResponse;
};


export type QueryGuesthouseArgs = {
  id: Scalars['ID']['input'];
};

export type Room = {
  capacity: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  gender: Gender;
  hasBathroom: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type UpdateGuesthouseInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dinnerPartyDescription?: InputMaybe<Scalars['String']['input']>;
  dinnerPartyType?: InputMaybe<DinnerPartyType>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  rooms?: InputMaybe<Array<CreateRoomInput>>;
  website?: InputMaybe<Scalars['String']['input']>;
};
