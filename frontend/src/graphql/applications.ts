import { gql } from '@apollo/client/core';


export const APPLICATIONS_QUERY = gql`
  query GetApplications {
    applications {
      id
      jobTitle
      linkedinUrl
      companyJobUrl
      priority
      salaryMin
      salaryMax
      status
      location
      remoteType
      preference
      postedDate
      postingEndDate
      appliedDate
      comments
      company {
        id
        name
      }
      contactLinks {
        id
        role
        contact {
          id
          name
          email
          phone
          title
          linkedinProfile
          contactStatus
          referredBy
          notes
        }
      }
    }
  }
`;

export const COMPANIES_LIST_QUERY = gql`
  query GetCompaniesList {
    companies {
      id
      name
    }
  }
`;

export const CREATE_APPLICATION = gql`
  mutation CreateApplication($input: CreateApplicationInput!) {
    createApplication(input: $input) {
      id
      jobTitle
      status
    }
  }
`;

export const UPDATE_APPLICATION = gql`
  mutation UpdateApplication($id: ID!, $input: UpdateApplicationInput!) {
    updateApplication(id: $id, input: $input) {
      id
      jobTitle
      status
    }
  }
`;

export const DELETE_APPLICATION = gql`
  mutation DeleteApplication($id: ID!) {
    deleteApplication(id: $id) {
      id
    }
  }
`;


export const LINK_CONTACT_TO_APPLICATION = gql`
  mutation LinkContactToApplication(
    $applicationId: ID!
    $contactId: ID!
    $role: String
  ) {
    linkContactToApplication(
      applicationId: $applicationId
      contactId: $contactId
      role: $role
    ) {
      id
      role
      contact {
        id
        name
        title
        email
        phone
        linkedinProfile
        contactStatus
      }
      application {
        id
        jobTitle
      }
    }
  }
`

export const UNLINK_CONTACT_FROM_APPLICATION = gql`
  mutation UnlinkContactFromApplication($applicationContactId: ID!) {
    unlinkContactFromApplication(applicationContactId: $applicationContactId) {
      id
    }
  }
`

export const UPDATE_APPLICATION_CONTACT = gql`
  mutation UpdateApplicationContact($id: ID!, $role: String) {
    updateApplicationContact(id: $id, role: $role) {
      id
      role
      contact {
        id
        name
        title
        email
        phone
        linkedinProfile
        contactStatus
      }
    }
  }
`