import {issueQueue} from "./issue-queue";

async function main() {
  const job = await issueQueue.add("hello", {
    message: "My first bugdesk background job",
  });

  console.log("Job Added", job.id);

  await issueQueue.close();
}

main().catch(console.error);
