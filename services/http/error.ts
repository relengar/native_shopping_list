export class HttpError extends Error {
  #status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.#status = status;
  }

  get status(): number {
    return this.#status;
  }
}
