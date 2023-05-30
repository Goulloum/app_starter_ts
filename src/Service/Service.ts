export abstract class Service<E, S> {
    public async add(entity: S): Promise<E> {
        throw new Error("Method not implemented !");
    }
    public async delete(id: number): Promise<Boolean> {
        throw new Error("Method not implemented !");
    }
    public async findById(id: number): Promise<E | null> {
        throw new Error("Method not implemented !");
    }
    public async findAll(): Promise<E[]> {
        throw new Error("Method not implemented !");
    }
    public async update(raw: S): Promise<E> {
        throw new Error("Method not implemented !");
    }
}
