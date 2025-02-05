export class Database {
  #database = {};

  select(table) {
    const data = this.#database[table] || [];
    return data;
  }

  insert(table, data) {
    const tableExists = !!this.#database[table];

    if (!tableExists) {
      this.#database[table] = [];
    }

    this.#database[table].push(data);
    return data;
  }
}
