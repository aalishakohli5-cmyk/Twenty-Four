-- Grant the signup bonus to existing profiles that never received it.
UPDATE "Profile" p
SET "coinBalance" = "coinBalance" + 150
WHERE NOT EXISTS (
  SELECT 1
  FROM "Transaction" t
  WHERE t."profileId" = p."id"
    AND t."type" = 'SIGNUP_BONUS'
);

INSERT INTO "Transaction" ("id", "profileId", "type", "amount", "note", "createdAt")
SELECT
  gen_random_uuid()::text,
  p."id",
  'SIGNUP_BONUS'::"TransactionType",
  150,
  'Welcome signup bonus',
  NOW()
FROM "Profile" p
WHERE NOT EXISTS (
  SELECT 1
  FROM "Transaction" t
  WHERE t."profileId" = p."id"
    AND t."type" = 'SIGNUP_BONUS'
);
