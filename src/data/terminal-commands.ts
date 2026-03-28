/**
 * Home page terminal — edit these blocks to change what appears as you scroll.
 * Each entry: the typed `command` line, then the `output` (supports multiple lines).
 */
export interface TerminalBlock {
  /** Shown after the prompt, e.g. "cat who_am_i.txt" */
  command: string;
  /** Plain text output (use \\n for line breaks) */
  output: string;
}

export const terminalIntro = {
  /** Shown before any commands (boot / MOTD style) */
  lines: [
    "Portfolio shell v1.0 — scroll to run commands.",
    "",
  ],
};

export const terminalCommands: TerminalBlock[] = [
  {
    command: "cat who_am_i.txt",
    output:
      "Aarush Goyal\n" +
      "Student & builder — dual B.S. in Computer Science and Mathematics at the University of Delaware (Honors, Trustee Scholar).\n" +
      "I like shipping real software, securing systems, and learning in public.",
  },
  {
    command: "ls -1 ./currently",
    output:
      "sophmore_year_atUD.md\n" +
      "sensify_lab_experiments/\n" +
      "this_website/",
  },
  {
    command: "grep -i skills skills.txt",
    output:
      "Python · TypeScript · Java · C · C++ · JavaScript · HTML · CSS\n" +
      "AWS (Certified Cloud Practitioner) · VS Code · CLion",
  },
  {
    command: "echo $NEXT_STEP",
    output:
      "Check out Projects, read the Blog, or say hi on the Contact page.\n\n" +
      "You're at the end of the scroll tour — an interactive shell unlocks below.\n" +
      "Type `help` to see what you can do (navigate, theme colors, text me, and more).",
  },
];
