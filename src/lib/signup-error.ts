type SignupError = { code?: string; status?: number };

/** Only a bounded error code is returned or logged; never credentials or raw errors. */
export function signupErrorDetails(error: SignupError | null) {
  const code = error?.code && /^[a-z][a-z0-9_]{0,63}$/.test(error.code)
    ? error.code : error ? "unknown_error" : "missing_user";
  const reference = `signup/${code}`;
  let message: string;
  switch (code) {
    case "email_exists":
    case "user_already_exists":
      message = "An account already exists for this email. Sign in instead. If you previously used email links and never set a password or recovery answer, contact SOCIS to access that account.";
      break;
    case "weak_password":
      message = "This password does not meet the account's password requirements. Choose a longer, unique password.";
      break;
    case "email_address_invalid":
      message = "The account service rejected this email address. Use a real, valid email address.";
      break;
    case "validation_failed":
      message = "The account service rejected the signup details. Check your email and password.";
      break;
    case "email_provider_disabled":
    case "signup_disabled":
      message = "Account creation is disabled in the site's authentication settings. Contact SOCIS.";
      break;
    case "not_admin":
    case "bad_jwt":
    case "no_authorization":
      message = "The site's account service is not configured correctly. Contact SOCIS.";
      break;
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      message = "Too many signup attempts. Please wait before trying again.";
      break;
    default:
      message = error?.status === 429
        ? "Too many signup attempts. Please wait before trying again."
        : "The account service could not create your account. Contact SOCIS with the reference below.";
  }
  return { code, reference, message: `${message} Reference: ${reference}.` };
}
