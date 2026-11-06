## Stripe Deposits (Optional)

Stripe is optional for local development. Deposits can be made directly without Stripe or through Stripe Checkout using test payments.

### 1. Without Stripe (Default)

In `.env`:

```env
STRIPE_ENABLED=false
```

Run:

```bash
npm run dev
```

Deposits will immediately update the user's wallet balance.

### 2. With Stripe

1. Get your **test secret key** (`sk_test_...`) from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys).
2. Install the [Stripe CLI](https://docs.stripe.com/stripe-cli) and authenticate:

   ```bash
   stripe login
   ```

3. Update `.env`:

   ```env
   STRIPE_ENABLED=true
   STRIPE_SECRET_KEY=sk_test_...
   APP_URL=http://localhost:3000
   ```

4. Start the application and Stripe listener:

   ```bash
   npm run dev:stripe
   ```

5. Copy the **webhook signing secret** (`whsec_...`) printed by the Stripe CLI into `.env`:

   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

6. Restart `npm run dev:stripe` to load the updated secret.

### 3. Test a Deposit

1. Visit `http://localhost:3000/account`.
2. Enter a deposit amount and click **Deposit**.
3. Complete Stripe Checkout using the test card:
   - Card: `4242 4242 4242 4242`
   - Expiration: Any future date
   - CVC: Any valid 3 digits
4. After successful payment, the webhook automatically updates the wallet balance and transaction history.

**Note:** Keep `.env` out of GitHub. Stripe uses test payments only; no real money is charged.

[Back to Main README](../README.md)
