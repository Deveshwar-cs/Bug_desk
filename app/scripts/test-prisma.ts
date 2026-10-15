import {prisma} from "../lib/prisma";

// ====== For creating table ======
// async function main() {
//   const newIssue = await prisma.issue.create({
//     data: {
//       title: "Login button is not working",
//       description: "Clicking the login button does not the submit the form",
//     },
//   });

//   console.log("Created Issue:",newIssue);

//   const allIssues = await prisma.issue.findMany();

//   console.log("All issues:",allIssues)
// }

// main()
//   .catch(console.error)
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// ======= For getting all table rows ======
// async function main() {
//   const issues = await prisma.issue.findMany();

//   console.log("Issues in database:", issues);
// }

// main()
//   .catch(console.error)
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// ======= For updating data ======
async function main() {
  const issues = await prisma.issue.findFirst();

  if (!issues) {
    console.log("No issue found to update.");
    return;
  }

  const updateIssue = await prisma.issue.update({
    where: {id: issues.id},
    data: {
      status: "IN_PROGRESS",
    },
  });

  console.log("Updated issue:", updateIssue);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
