import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rewards = [
    { name: "Aurora", category: "theme", priceCoins: 200, description: "Animated dark-green and neon aurora theme across the complete dashboard." },
  ];

  for (const r of rewards) {
    await prisma.reward.upsert({
      where: { name: r.name },
      update: r,
      create: r,
    });
  }

  console.log(`Seeded ${rewards.length} rewards.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
