import "dotenv/config";

async function main() {
  console.log("Database configured. Questions load from questions.json at runtime.");
  console.log("Seed complete — no question data needs to be seeded.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
