type IssuePageProps = {
  params: Promise<{id: string}>;
};

export default async function IssuePage({params}: IssuePageProps) {
  const {id} = await params;

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900">Issue Details</h1>

        <p className="mt-4 text-slate-600">You are viewing issue: {id}</p>
      </div>
    </main>
  );
}
