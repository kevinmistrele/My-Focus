export class ApiError extends Error {
  public status: number
  public errors?: Record<string, string[]>

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.errors = errors
  }
}

export class ValidationError extends Error {
  public field: string

  constructor(message: string, field: string) {
    super(message)
    this.name = "ValidationError"
    this.field = field
  }
}

export class AuthenticationError extends Error {
  constructor(message = "Authentication required") {
    super(message)
    this.name = "AuthenticationError"
  }
}

export class AuthorizationError extends Error {
  constructor(message = "Insufficient permissions") {
    super(message)
    this.name = "AuthorizationError"
  }
}

export const handleApiError = (error: any): string => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof ValidationError) {
    return error.message
  }

  if (error instanceof AuthenticationError) {
    return "Please log in to continue"
  }

  if (error instanceof AuthorizationError) {
    return "You do not have permission to perform this action"
  }

  if (error.message) {
    return error.message
  }

  return "An unexpected error occurred"
}

export const isNetworkError = (error: any): boolean => {
  return error instanceof TypeError && error.message === "Failed to fetch"
}
