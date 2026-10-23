import { getHighlighter } from "fumadocs-core/highlight";
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import Link from "next/link";
import { courierGrammar } from "@/lib/courier-grammar";

const schema = `enum Weapon { Sword, Bow, Staff }

event Shoot from Client {
	Weapon: Weapon,
	Target: Instance(BasePart),
	Aim: vector(-1..1, 0.001),
}

event Damaged from Server unreliable {
	Amount: int(0..100),
	Health: int(0..100),
}

function Buy from Client { Item: u16, Count: u8 } -> { Granted: bool, Balance: u32 }`;

const usage = `local Net = require(ReplicatedStorage.Net)

-- client
Net.Shoot.Fire("Bow", Target, Camera.CFrame.LookVector)
local Granted: boolean, Balance: number = Net.Buy.Invoke(5, 3):Wait()

-- server
Net.Shoot.On(function(Player: Player, Weapon: Net.Weapon, Target: BasePart?, Aim: Vector3)
	print(Player, Weapon, Target, Aim)
end)

Net.Buy.On(function(Player: Player, Item: number, Count: number): (boolean, number)
	return true, 985
end)

Net.Damaged.FireAll(10, 90)`;

const features = [
  {
    title: "The fewest bits",
    body: "A bool is 1 bit and int(0..100) is 7. Fields that waste part of a bit are packed together, so Shoot above is 37 bits, id included.",
  },
  {
    title: "One call per frame",
    body: "Everything a player gets in a frame goes out together in one remote call, sent once per Heartbeat.",
  },
  {
    title: "Typed from the schema",
    body: "Every Fire, On, Invoke and middleware is typed from the schema, so a wrong argument is an error in your editor, not in a live server.",
  },
  {
    title: "Clients can't break it",
    body: "Every value a client sends is checked as it's read. If one is wrong, Courier stops reading that frame, and your handler never sees it.",
  },
  {
    title: "Functions that answer",
    body: "Invoke returns a Future with the handler's results, or why the call failed. A call times out on its own, so a client that never answers can't stall your server.",
  },
  {
    title: "Fits how you work",
    body: "courier watch compiles schemas into the folder Rojo syncs, and the editor extension shows each field's size as you type.",
  },
];

const themes = { light: "github-light", dark: "github-dark" } as const;

export default async function HomePage() {
  // ServerCodeBlock highlights with the shared Shiki instance, which only knows bundled languages
  await getHighlighter("js", { langs: [courierGrammar] });

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-20">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Courier
        </h1>
        <p className="mt-4 text-lg text-fd-muted-foreground">
          Networking for Roblox that sends the fewest bytes it can, as fast as
          it can. You write a schema, and the compiler turns it into strictly
          typed Luau that packs every value into exactly the bits it needs.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/docs"
            className="rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground"
          >
            Read the docs
          </Link>
          <Link
            href="/docs/learn/getting-started"
            className="rounded-lg border px-5 py-2.5 font-medium"
          >
            Get started
          </Link>
        </div>

        <div className="mt-12 grid gap-4">
          <ServerCodeBlock code={schema} lang="courier" themes={themes} />
          <ServerCodeBlock code={usage} lang="luau" themes={themes} />
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-fd-card p-5"
            >
              <h2 className="font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm text-fd-muted-foreground">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
