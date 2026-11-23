import type { CredentialStore,  AuthOperationOptions,  Credential,  CredentialInfo } from "@earendil-works/pi-ai";
import { homedir } from "node:os";
import { join } from "node:path";

export class authCredentials implements CredentialStore {
    constructor(readonly path = join(homedir(), ".kenni", "auth.json")) {}

    read(providerId: string, options?: AuthOperationOptions): Promise<Credential | undefined> {

    }

    list(options?: AuthOperationOptions): Promise<readonly CredentialInfo[]> {

    }

    modify(providerId: string, fn: (current: Credential | undefined) => Promise<Credential | undefined>, options?: AuthOperationOptions): Promise<Credential | undefined> {

    }

    delete(providerId: string, options?: AuthOperationOptions): Promise<void> {

    }
}
