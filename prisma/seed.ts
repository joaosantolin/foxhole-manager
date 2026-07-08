import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL ?? "",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const existingDepots = await prisma.depot.count();

  if (existingDepots > 0) {
    console.log("Seed skipped: database already has data.");
    return;
  }

  await prisma.depot.create({
    data: {
      name: "The Moors - Bunker Base",
      region: "Deadlands",
      notes: "Depósito inicial para suprimentos de infantaria.",
      items: {
        create: [
          {
            name: "Rifle 7.62mm",
            quantity: 24,
            category: "Armas",
          },
          {
            name: "Bandagens Básicas",
            quantity: 60,
            category: "Suprimentos Médicos",
          },
        ],
      },
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Repor munição no front sul",
        description: "Enviar caixas de munição para o depósito avançado.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        order: 0,
      },
      {
        title: "Coletar materiais para construção",
        description: "Juntar bmats e cmats para reforço do bunker.",
        status: "TODO",
        priority: "MEDIUM",
        order: 1,
      },
      {
        title: "Conferir cronômetro de refresh",
        description: "Atualizar os depósitos que receberam nova carga.",
        status: "DONE",
        priority: "LOW",
        order: 2,
      },
    ],
  });

  console.log("Seed concluído com dados iniciais.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });