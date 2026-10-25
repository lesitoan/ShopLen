import { Injectable } from "@nestjs/common";

@Injectable()
export class ResourceDrainService {
  private callbacks: Array<() => Promise<void>> = [];
  private draining: Promise<void> | undefined;

  register(callback: () => Promise<void>) { this.callbacks.push(callback); }

  drain() {
    return this.draining ??= Promise.all(this.callbacks.map((callback) => callback())).then(() => undefined);
  }
}
