**Status note:** Sessions are not yet implemented. A successful login or registration does not establish an identity. Downstream code still reads `DEV_USER_ID` from a local `.env` file.

**To-Do:**
- Display error messages on registration/login rejections and allow retries instead of JSON response.
- Implement sessions (some way to remember the user after login)

## Registration:

To register a new user account, provide your
- first name
- last name
- email address
- password

On submission, this sends a POST request to the server, which will then insert a new record into our `users` table with the gathered information. The password will be hashed before being inserted.

Users will be rejected if they try to register an account with an email address that already exists in our `users` table.

## Login:

To log in with your registered account, provide the following credentials associated with the account.
- email address
- password

On submission, this sends a POST request to the server, which will validate the inputted credentials with what was stored in the database.

Users will be rejected if the inputted credentials don't match what was stored in the database.

**Another note:** Nonexistent emails and wrong passwords are both deliberately treated the same way (throws InvalidCredentialsError) in order to prevent user enumeration attacks.

Some optional features that can be implemented:
- Password reset
- Email change
- Verification email sent to actual email address to validate account registration
