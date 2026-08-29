import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const TRIAL_EMAIL = "whymonkeydluffy@gmail.com";
const TRIAL_COINS = 90_000;

async function main() {
  const email = (process.argv[2] ?? TRIAL_EMAIL).trim().toLowerCase();
  const amount = Number(process.argv[3] ?? TRIAL_COINS);

  if (!email || Number.isNaN(amount) || amount < 0) {
    console.error("Usage: npx tsx scripts/grant-coins.ts <email> [amount]");
    process.exit(1);
  }

  const profile = await prisma.profile.findUnique({ where: { email } });
  if (!profile) {
    console.error(`No profile found for ${email}. Sign in once so the server creates a profile.`);
    process.exit(1);
  }

  const delta = Math.max(0, amount - profile.coinBalance);

  if (delta === 0) {
    console.log(`${email} already has ${profile.coinBalance} coins.`);
    return;
  }

  await prisma.$transaction([
    prisma.profile.update({
      where: { id: profile.id },
      data: { coinBalance: amount },
    }),
    prisma.transaction.create({
      data: {
        profileId: profile.id,
        type: "SIGNUP_BONUS",
        amount: delta,
        note: `Trial account grant (${amount} coins)`,
      },
    }),
  ]);

  console.log(`Granted ${delta} coins to ${email}. New balance: ${amount}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
