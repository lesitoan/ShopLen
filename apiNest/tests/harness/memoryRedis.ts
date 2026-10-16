export class MemoryRedis {
  readonly values = new Map<string, { value: string; expiresAt: number }>();
  readonly indexes = new Map<string, Map<string, number>>();
  time = Date.now();

  async get(key: string) {
    const item = this.values.get(key);
    if (!item || item.expiresAt <= this.time) { this.values.delete(key); return null; }
    return item.value;
  }

  async ttl(key: string) {
    const item = this.values.get(key);
    return item && item.expiresAt > this.time ? Math.floor((item.expiresAt - this.time) / 1000) : -2;
  }

  async del(keys: string | string[]) {
    for (const key of Array.isArray(keys) ? keys : [keys]) {
      this.values.delete(key);
      this.indexes.delete(key);
    }
    return 1;
  }

  async sendCommand(command: string[]) {
    if (command[0] === "GETDEL") {
      const value = await this.get(command[1]);
      const item = this.values.get(command[1]);
      if (!item) return null;
      this.values.delete(command[1]);
      return value;
    }
    if (command[0] === "SET") {
      this.values.set(command[1], { value: command[2], expiresAt: this.time + Number(command[4]) * 1000 });
      return "OK";
    }
    throw new Error(`Unsupported test command: ${command[0]}`);
  }

  async eval(script: string, options: { keys: string[]; arguments: string[] }) {
    if (!script.includes("ZPOPMIN") || !script.includes("redis.call('SET'")) {
      throw new Error("Unexpected session Lua script");
    }
    const [key, indexKey] = options.keys;
    const [value, ttl, score, jti, max, prefix] = options.arguments;
    this.values.set(key, { value, expiresAt: this.time + Number(ttl) * 1000 });
    const index = this.indexes.get(indexKey) ?? new Map<string, number>();
    index.set(jti, Number(score));
    while (index.size > Number(max)) {
      const oldest = [...index].sort((a, b) => a[1] - b[1])[0][0];
      index.delete(oldest);
      this.values.delete(`${prefix}${oldest}`);
    }
    this.indexes.set(indexKey, index);
    return 1;
  }

  async zRem(key: string, value: string) { this.indexes.get(key)?.delete(value); }
  async zRange(key: string, _start: number, _end: number) { return [...(this.indexes.get(key)?.keys() ?? [])]; }
}
