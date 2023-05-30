import { Service } from "../Service/Service";
import { Mapper } from "../Mapper/Mapper";
import { Request, Response } from "express";

export class ControllerEntity<E, D, S> {
    public async addRoute(req: Request, res: Response, service: Service<E, S>, mapper: Mapper<E, D, S>): Promise<Response> {
        try {
            const sequelizedEntity: S = mapper.toSequelize(req.body);
            const newEntity = await service.add(sequelizedEntity);
            return res.status(200).send(mapper.toDTO(newEntity));
        } catch (err: any) {
            console.log(err);
            return res.status(400).send(err.message);
        }
    }

    public async deleteRoute(req: Request, res: Response, service: Service<E, S>, mapper: Mapper<E, D, S>): Promise<Response> {
        try {
            const deleted = await service.delete(req.body.id);
            return res.status(200).send(deleted);
        } catch (err: any) {
            console.log(err);
            return res.status(400).send(err.message);
        }
    }

    public async findByIdRoute(req: Request, res: Response, service: Service<E, S>, mapper: Mapper<E, D, S>): Promise<Response> {
        try {
            const user = await service.findById(req.body.id);
            if (!user) {
                return res.status(200).send(null);
            }
            return res.status(200).send(mapper.toDTO(user));
        } catch (err: any) {
            console.log(err);
            return res.status(400).send(err.message);
        }
    }

    public async findAll(req: Request, res: Response, service: Service<E, S>, mapper: Mapper<E, D, S>): Promise<Response> {
        try {
            const users = await service.findAll();
            const usersDTO = users.map((user) => mapper.toDTO(user));
            return res.status(200).send(usersDTO);
        } catch (err: any) {
            console.log(err);
            return res.status(400).send(err.message);
        }
    }

    public async update(req: Request, res: Response, service: Service<E, S>, mapper: Mapper<E, D, S>): Promise<Response> {
        try {
            const updatedUser = await service.update(mapper.toSequelize(req.body));
            return res.status(200).send(mapper.toDTO(updatedUser));
        } catch (err: any) {
            console.log(err);
            return res.status(400).send(err.message);
        }
    }
}
