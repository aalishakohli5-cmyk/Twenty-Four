import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rewards = [
    { name: "Aurora", category: "theme", priceCoins: 200, description: "Animated dark-green and neon aurora theme across the complete dashboard." },
    { name: "Midnight Charcoal", category: "background", priceCoins: 200, description: "The default deep charcoal look, unlocked and free." },
    { name: "Gold Ledger", category: "background", priceCoins: 200, description: "A financial-ledger inspired timeline background." },
    { name: "Neon Focus", category: "theme", priceCoins: 500, description: "Neon-green accents across the whole app." },
    { name: "Glass Taskbar", category: "taskbar", priceCoins: 800, description: "A frosted glass current-task bar." },
    { name: "Aurora Environment", category: "background", priceCoins: 1000, description: "A special animated environment for your Today screen." },
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
