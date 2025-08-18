// src/graphql/authQueries.ts

export const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
      user {
        id
        email
        role
        wallet_address
        created_at
      }
    }
  }
`;

export const SIGNUP_MUTATION = `
  mutation Signup($email: String!, $password: String!, $role: String!, $walletAddress: String) {
    signup(email: $email, password: $password, role: $role, walletAddress: $walletAddress) {
      success
      message
    }
  }
`;
