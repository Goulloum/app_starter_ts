export interface Mapper<E, D, S> {
    toDTO(entity: E): D;
    toSequelize(raw: any): S;
}
