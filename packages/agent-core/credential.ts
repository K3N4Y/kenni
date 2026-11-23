import type {
  CredentialStore,
  AuthOperationOptions,
  Credential,
  CredentialInfo,
} from "@earendil-works/pi-ai";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { mkdir, rename } from "node:fs/promises";

type Store = Record<string, Credential>;

export class authCredentials implements CredentialStore {
  #queue: Promise<unknown> = Promise.resolve();

  constructor(readonly path = join(homedir(), ".kenni", "auth.json")) {}

  async #load(): Promise<Store> {
    const file = Bun.file(this.path);
    if (!(await file.exists())) return {};
    const text = await file.text();
    if (!text.trim()) return {};
    return JSON.parse(text) as Store;
  }

  async #save(store: Store): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true, mode: 0o700 });
    const tmp = `${this.path}.${process.pid}.tmp`;
    await Bun.write(tmp, JSON.stringify(store, null, 2), { mode: 0o600 });
    await rename(tmp, this.path);
  }

  #exclusive<T>(fn: () => Promise<T>): Promise<T> {
    const run = this.#queue.then(fn);
    this.#queue = run.catch(() => {});
    return run;
  }

  async read(providerId: string, options?: AuthOperationOptions): Promise<Credential | undefined> {
    options?.signal?.throwIfAborted();
    const store = await this.#load();
    return Object.hasOwn(store, providerId) ? store[providerId] : undefined;
  }

  async list(options?: AuthOperationOptions): Promise<readonly CredentialInfo[]> {
    options?.signal?.throwIfAborted();
    const store = await this.#load();
    return Object.entries(store).map(([providerId, cred]) => ({
      providerId,
      type: cred.type,
    }));
  }

  modify(
    providerId: string,
    fn: (current: Credential | undefined) => Promise<Credential | undefined>,
    options?: AuthOperationOptions,
  ): Promise<Credential | undefined> {
    return this.#exclusive(async () => {
      options?.signal?.throwIfAborted();
      const store = await this.#load();
      const current = Object.hasOwn(store, providerId) ? store[providerId] : undefined;

      const next = await fn(current);

      if (next === undefined) {
        delete store[providerId];
      } else {
        store[providerId] = next;
      }

      await this.#save(store);
      return next;
    });
  }

  delete(providerId: string, options?: AuthOperationOptions): Promise<void> {
    return this.#exclusive(async () => {
      options?.signal?.throwIfAborted();
      const store = await this.#load();
      if (!Object.hasOwn(store, providerId)) return;
      delete store[providerId];
      await this.#save(store);
    });
  }
}
