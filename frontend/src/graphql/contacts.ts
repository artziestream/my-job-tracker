import { gql } from '@apollo/client/core'

export const CREATE_CONTACT = gql`
  mutation CreateContact($input: CreateContactInput!) {
    createContact(input: $input) {
      id
      name
      title
      email
      phone
      linkedinProfile
      seniority
      contactStatus
      referredBy
      notes
    }
  }
`

export const UPDATE_CONTACT = gql`
  mutation UpdateContact($id: ID!, $input: UpdateContactInput!) {
    updateContact(id: $id, input: $input) {
      id
      name
      title
      email
      phone
      linkedinProfile
      seniority
      contactStatus
      referredBy
      notes
    }
  }
`

export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id) {
      id
    }
  }
`