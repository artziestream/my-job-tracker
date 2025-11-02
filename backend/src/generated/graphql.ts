import { GraphQLResolveInfo } from 'graphql';
import { Company as PrismaCompany, Contact as PrismaContact, Application as PrismaApplication } from '@prisma/client';
import { Context } from '../context';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Application = {
  appliedDate?: Maybe<Scalars['String']['output']>;
  comments?: Maybe<Scalars['String']['output']>;
  company: Company;
  companyJobUrl?: Maybe<Scalars['String']['output']>;
  contacts: Array<Contact>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  jobTitle: Scalars['String']['output'];
  linkedinUrl?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  offerDeadline?: Maybe<Scalars['String']['output']>;
  postedDate?: Maybe<Scalars['String']['output']>;
  postingEndDate?: Maybe<Scalars['String']['output']>;
  preference: Preference;
  priority: Priority;
  remoteType?: Maybe<RemoteType>;
  requirements?: Maybe<Scalars['String']['output']>;
  salaryMax?: Maybe<Scalars['Int']['output']>;
  salaryMin?: Maybe<Scalars['Int']['output']>;
  status: ApplicationStatus;
  updatedAt: Scalars['String']['output'];
};

export type ApplicationFilterInput = {
  companyId?: InputMaybe<Scalars['ID']['input']>;
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  maxSalary?: InputMaybe<Scalars['Int']['input']>;
  minSalary?: InputMaybe<Scalars['Int']['input']>;
  preference?: InputMaybe<Preference>;
  priority?: InputMaybe<Priority>;
  remoteType?: InputMaybe<RemoteType>;
  status?: InputMaybe<ApplicationStatus>;
};

export type ApplicationStatus =
  | 'APPLIED_NO_REFERRAL'
  | 'APPLIED_WITH_REFERRAL'
  | 'EARLY_STAGES'
  | 'FINAL_ROUND'
  | 'NOT_STARTED'
  | 'OFFER_ACCEPTED'
  | 'OFFER_DECLINED'
  | 'OFFER_RECEIVED'
  | 'PHONE_SCREEN'
  | 'REJECTED'
  | 'WITHDRAWN';

export type Company = {
  applications: Array<Application>;
  comments?: Maybe<Scalars['String']['output']>;
  contacts: Array<Contact>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  size?: Maybe<CompanySize>;
  type?: Maybe<CompanyType>;
  updatedAt: Scalars['String']['output'];
};

export type CompanyFilterInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<CompanySize>;
  type?: InputMaybe<CompanyType>;
};

export type CompanySize =
  | 'ENTERPRISE'
  | 'LARGE'
  | 'MEDIUM'
  | 'SMALL';

export type CompanyType =
  | 'NONPROFIT'
  | 'PRIVATE'
  | 'PUBLIC'
  | 'STARTUP';

export type Contact = {
  applications: Array<Application>;
  company: Company;
  contactStatus: ContactStatus;
  createdAt: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  linkedinProfile?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  referredBy?: Maybe<Scalars['String']['output']>;
  seniority?: Maybe<Seniority>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type ContactFilterInput = {
  companyId?: InputMaybe<Scalars['ID']['input']>;
  contactStatus?: InputMaybe<ContactStatus>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  seniority?: InputMaybe<Seniority>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ContactStatus =
  | 'CONNECTED'
  | 'MEETING_SCHEDULED'
  | 'NOT_INTERESTED'
  | 'NO_RESPONSE'
  | 'REACHED_OUT'
  | 'RESPONDED'
  | 'TO_REACH_OUT';

export type CreateApplicationInput = {
  appliedDate?: InputMaybe<Scalars['String']['input']>;
  comments?: InputMaybe<Scalars['String']['input']>;
  companyId: Scalars['ID']['input'];
  companyJobUrl?: InputMaybe<Scalars['String']['input']>;
  jobTitle: Scalars['String']['input'];
  linkedinUrl?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  offerDeadline?: InputMaybe<Scalars['String']['input']>;
  postedDate?: InputMaybe<Scalars['String']['input']>;
  postingEndDate?: InputMaybe<Scalars['String']['input']>;
  preference?: InputMaybe<Preference>;
  priority?: InputMaybe<Priority>;
  remoteType?: InputMaybe<RemoteType>;
  requirements?: InputMaybe<Scalars['String']['input']>;
  salaryMax?: InputMaybe<Scalars['Int']['input']>;
  salaryMin?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<ApplicationStatus>;
};

export type CreateCompanyInput = {
  comments?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  size?: InputMaybe<CompanySize>;
  type?: InputMaybe<CompanyType>;
};

export type CreateContactInput = {
  companyId: Scalars['ID']['input'];
  contactStatus?: InputMaybe<ContactStatus>;
  email?: InputMaybe<Scalars['String']['input']>;
  linkedinProfile?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  referredBy?: InputMaybe<Scalars['String']['input']>;
  seniority?: InputMaybe<Seniority>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  createApplication: Application;
  createCompany: Company;
  createContact: Contact;
  deleteApplication: Application;
  deleteCompany: Company;
  deleteContact: Contact;
  linkContactToApplication: Application;
  updateApplication: Application;
  updateCompany: Company;
  updateContact: Contact;
};


export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput;
};


export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


export type MutationCreateContactArgs = {
  input: CreateContactInput;
};


export type MutationDeleteApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCompanyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteContactArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLinkContactToApplicationArgs = {
  applicationId: Scalars['ID']['input'];
  contactId: Scalars['ID']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateApplicationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateApplicationInput;
};


export type MutationUpdateCompanyArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCompanyInput;
};


export type MutationUpdateContactArgs = {
  id: Scalars['ID']['input'];
  input: UpdateContactInput;
};

export type Preference =
  | 'AVOID'
  | 'DEALBREAKER'
  | 'NEUTRAL'
  | 'PREFER'
  | 'STRONGLY_PREFER';

export type Priority =
  | 'HIGH'
  | 'LOW'
  | 'MEDIUM';

export type Query = {
  application?: Maybe<Application>;
  applications: Array<Application>;
  companies: Array<Company>;
  company?: Maybe<Company>;
  contact?: Maybe<Contact>;
  contacts: Array<Contact>;
};


export type QueryApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryApplicationsArgs = {
  filter?: InputMaybe<ApplicationFilterInput>;
};


export type QueryCompaniesArgs = {
  filter?: InputMaybe<CompanyFilterInput>;
};


export type QueryCompanyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryContactArgs = {
  id: Scalars['ID']['input'];
};


export type QueryContactsArgs = {
  filter?: InputMaybe<ContactFilterInput>;
};

export type RemoteType =
  | 'FLEXIBLE'
  | 'HYBRID'
  | 'ONSITE'
  | 'REMOTE';

export type Seniority =
  | 'ENTRY'
  | 'MID'
  | 'PRINCIPAL'
  | 'SENIOR'
  | 'VP';

export type UpdateApplicationInput = {
  appliedDate?: InputMaybe<Scalars['String']['input']>;
  comments?: InputMaybe<Scalars['String']['input']>;
  companyId?: InputMaybe<Scalars['ID']['input']>;
  companyJobUrl?: InputMaybe<Scalars['String']['input']>;
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  linkedinUrl?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  offerDeadline?: InputMaybe<Scalars['String']['input']>;
  postedDate?: InputMaybe<Scalars['String']['input']>;
  postingEndDate?: InputMaybe<Scalars['String']['input']>;
  preference?: InputMaybe<Preference>;
  priority?: InputMaybe<Priority>;
  remoteType?: InputMaybe<RemoteType>;
  requirements?: InputMaybe<Scalars['String']['input']>;
  salaryMax?: InputMaybe<Scalars['Int']['input']>;
  salaryMin?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<ApplicationStatus>;
};

export type UpdateCompanyInput = {
  comments?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<CompanySize>;
  type?: InputMaybe<CompanyType>;
};

export type UpdateContactInput = {
  companyId?: InputMaybe<Scalars['ID']['input']>;
  contactStatus?: InputMaybe<ContactStatus>;
  email?: InputMaybe<Scalars['String']['input']>;
  linkedinProfile?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  referredBy?: InputMaybe<Scalars['String']['input']>;
  seniority?: InputMaybe<Seniority>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Application: ResolverTypeWrapper<PrismaApplication>;
  ApplicationFilterInput: ResolverTypeWrapper<Partial<ApplicationFilterInput>>;
  ApplicationStatus: ResolverTypeWrapper<Partial<ApplicationStatus>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']['output']>>;
  Company: ResolverTypeWrapper<PrismaCompany>;
  CompanyFilterInput: ResolverTypeWrapper<Partial<CompanyFilterInput>>;
  CompanySize: ResolverTypeWrapper<Partial<CompanySize>>;
  CompanyType: ResolverTypeWrapper<Partial<CompanyType>>;
  Contact: ResolverTypeWrapper<PrismaContact>;
  ContactFilterInput: ResolverTypeWrapper<Partial<ContactFilterInput>>;
  ContactStatus: ResolverTypeWrapper<Partial<ContactStatus>>;
  CreateApplicationInput: ResolverTypeWrapper<Partial<CreateApplicationInput>>;
  CreateCompanyInput: ResolverTypeWrapper<Partial<CreateCompanyInput>>;
  CreateContactInput: ResolverTypeWrapper<Partial<CreateContactInput>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']['output']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']['output']>>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Preference: ResolverTypeWrapper<Partial<Preference>>;
  Priority: ResolverTypeWrapper<Partial<Priority>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RemoteType: ResolverTypeWrapper<Partial<RemoteType>>;
  Seniority: ResolverTypeWrapper<Partial<Seniority>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']['output']>>;
  UpdateApplicationInput: ResolverTypeWrapper<Partial<UpdateApplicationInput>>;
  UpdateCompanyInput: ResolverTypeWrapper<Partial<UpdateCompanyInput>>;
  UpdateContactInput: ResolverTypeWrapper<Partial<UpdateContactInput>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Application: PrismaApplication;
  ApplicationFilterInput: Partial<ApplicationFilterInput>;
  Boolean: Partial<Scalars['Boolean']['output']>;
  Company: PrismaCompany;
  CompanyFilterInput: Partial<CompanyFilterInput>;
  Contact: PrismaContact;
  ContactFilterInput: Partial<ContactFilterInput>;
  CreateApplicationInput: Partial<CreateApplicationInput>;
  CreateCompanyInput: Partial<CreateCompanyInput>;
  CreateContactInput: Partial<CreateContactInput>;
  ID: Partial<Scalars['ID']['output']>;
  Int: Partial<Scalars['Int']['output']>;
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  String: Partial<Scalars['String']['output']>;
  UpdateApplicationInput: Partial<UpdateApplicationInput>;
  UpdateCompanyInput: Partial<UpdateCompanyInput>;
  UpdateContactInput: Partial<UpdateContactInput>;
}>;

export type ApplicationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Application'] = ResolversParentTypes['Application']> = ResolversObject<{
  appliedDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  comments?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  companyJobUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contacts?: Resolver<Array<ResolversTypes['Contact']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  jobTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  linkedinUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  offerDeadline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postedDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postingEndDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  preference?: Resolver<ResolversTypes['Preference'], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['Priority'], ParentType, ContextType>;
  remoteType?: Resolver<Maybe<ResolversTypes['RemoteType']>, ParentType, ContextType>;
  requirements?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  salaryMax?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  salaryMin?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ApplicationStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type CompanyResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = ResolversObject<{
  applications?: Resolver<Array<ResolversTypes['Application']>, ParentType, ContextType>;
  comments?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contacts?: Resolver<Array<ResolversTypes['Contact']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<Maybe<ResolversTypes['CompanySize']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['CompanyType']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type ContactResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Contact'] = ResolversParentTypes['Contact']> = ResolversObject<{
  applications?: Resolver<Array<ResolversTypes['Application']>, ParentType, ContextType>;
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  contactStatus?: Resolver<ResolversTypes['ContactStatus'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  linkedinProfile?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  referredBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seniority?: Resolver<Maybe<ResolversTypes['Seniority']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createApplication?: Resolver<ResolversTypes['Application'], ParentType, ContextType, RequireFields<MutationCreateApplicationArgs, 'input'>>;
  createCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationCreateCompanyArgs, 'input'>>;
  createContact?: Resolver<ResolversTypes['Contact'], ParentType, ContextType, RequireFields<MutationCreateContactArgs, 'input'>>;
  deleteApplication?: Resolver<ResolversTypes['Application'], ParentType, ContextType, RequireFields<MutationDeleteApplicationArgs, 'id'>>;
  deleteCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationDeleteCompanyArgs, 'id'>>;
  deleteContact?: Resolver<ResolversTypes['Contact'], ParentType, ContextType, RequireFields<MutationDeleteContactArgs, 'id'>>;
  linkContactToApplication?: Resolver<ResolversTypes['Application'], ParentType, ContextType, RequireFields<MutationLinkContactToApplicationArgs, 'applicationId' | 'contactId'>>;
  updateApplication?: Resolver<ResolversTypes['Application'], ParentType, ContextType, RequireFields<MutationUpdateApplicationArgs, 'id' | 'input'>>;
  updateCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationUpdateCompanyArgs, 'id' | 'input'>>;
  updateContact?: Resolver<ResolversTypes['Contact'], ParentType, ContextType, RequireFields<MutationUpdateContactArgs, 'id' | 'input'>>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  application?: Resolver<Maybe<ResolversTypes['Application']>, ParentType, ContextType, RequireFields<QueryApplicationArgs, 'id'>>;
  applications?: Resolver<Array<ResolversTypes['Application']>, ParentType, ContextType, Partial<QueryApplicationsArgs>>;
  companies?: Resolver<Array<ResolversTypes['Company']>, ParentType, ContextType, Partial<QueryCompaniesArgs>>;
  company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType, RequireFields<QueryCompanyArgs, 'id'>>;
  contact?: Resolver<Maybe<ResolversTypes['Contact']>, ParentType, ContextType, RequireFields<QueryContactArgs, 'id'>>;
  contacts?: Resolver<Array<ResolversTypes['Contact']>, ParentType, ContextType, Partial<QueryContactsArgs>>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Application?: ApplicationResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  Contact?: ContactResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

