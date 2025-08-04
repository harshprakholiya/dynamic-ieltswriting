import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.question.createMany({
    data: [
      {
        type: 'part1',
        text: 'Describe this image in at least 150 words.',
        image: '/images/sample-part1.jpg',
      },
      {
        type: 'part2',
        text: 'Some people think that children should learn how to cook at school. Do you agree or disagree?',
      },
    ],
  });
}

main()
  .then(() => console.log('Seeded successfully!'))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
