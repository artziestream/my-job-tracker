import { gql } from '@apollo/client/core';

export const COMPANIES_QUERY = gql`
  query GetCompanies {
    companies {
      id
      name
      size
      type
      comments
      contacts {
        id
        name
        title
        email
        phone
        linkedinProfile
        seniority
        contactStatus
      }
    }
  }
`;

export const CREATE_COMPANY = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      name
      size
      type
      comments
    }
  }
`;

export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($id: ID!, $input: UpdateCompanyInput!) {
    updateCompany(id: $id, input: $input) {
      id
      name
      size
      type
      comments
    }
  }
`;

export const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id) {
      id
    }
  }
`;