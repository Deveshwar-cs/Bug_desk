import {Worker} from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "issue-jobs",
  async (job) => {
    // throw new Error("Simulated worker failure");
    if (job.name === "issue-created") {
      console.log("New issue created!");
      console.log("Issue Id:", job.data.issueId);
      console.log("Title:", job.data.title);
      console.log("User Id:", job.data.userId);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Job completed:", job.id);

    return {success: true};
  },
  {connection},
);

worker.on("failed", (job, error) => {
  console.error("Job failed:", job?.id, error.message);
});

worker.on("completed", (job, result) => {
  console.log("Completed job:", job.id);
  console.log("Result:", result);
});

worker.on("failed", (job, error) => {
  console.error("Failed job:", job?.id);
  console.error("Reason:", error.message);
});

worker.on("error", (error) => {
  console.error("Worker error:", error);
});

console.log("Issue worker is listening for jobs..");
